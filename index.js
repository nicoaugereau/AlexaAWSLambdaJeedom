/*
    Alexa Skill Interaction for Jeedom
    Skill Version : 1.0
    Author : Nicolas Augereau
    Licence : MIT
*/

'use strict';

const config = require('./config');
const request = require('./request');

const locale = event.request.locale;

const fr_FR = {
    WELCOME: 'Bienvenue sur l\'assistant Freebox Devialet',
    WHAT_DO_YOU_WANT: 'Que vouliez-vous dire ?',
    UNHANDLED: 'Désolé cette skill n\'est pas prise en charge.',
    HELP: 'Désolée je n\'ai pas pu répondre à votre demande. Vous pouvez me demander par exemple : Alexa demande à Devialer d\'allumer la lumière de la cuisine, ou ferme le volet du salon, ou encore baisse le volet à 20%.',
    STOP: 'Au revoir. Merci pour avoir utilisé l\'assistant Freebox Devialet !',
    ERROR: 'Désolé il y a eu une erreur',
    ERROR_ACTION: 'désolé je n\'ai pas compris l\'action',
    ERROR_PLACE: 'désolé je n\'ai pas compris l\'emplacement',
    ERROR_ACTION_SCENARIO: 'désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
    ERROR_SCENARIO_ID: 'désoélé le scenario n\'a pa été trouvé'
};
const en_GB = {
    WELCOME: 'Welcome to Freebox Devialet Assistant',
    WHAT_DO_YOU_WANT: 'What did you want to say?',
    UNHANDLED: 'Désolé cette skill n\'est pas prise en charge.',
    HELP: 'Désolée je n\'ai pas pu répondre à votre demande. Vous pouvez me demander par exemple : Alexa demande à Devialer d\'allumer la lumière de la cuisine, ou ferme le volet du salon, ou encore baisse le volet à 20%.',
    STOP: 'Bye! Thanks for using the Freebox Devialet Assistant!',
    ERROR: 'Désolé il y a eu une erreur',
    ERROR_ACTION: 'sorry i did not understand the action',
    ERROR_PLACE: 'sory i did not understand the place',
    ERROR_ACTION_SCENARIO: 'désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
    ERROR_SCENARIO_ID: 'sorry i did not find the scenario'
};

function getRequest(type, action, intent, place)
{
    console.log("Getting Jeedom object information from Alexa JSON");
    // get informations from config.js
    switch (type) {
        case "scenario":
            console.log("Getting Jeedom scenario informations");
            let scenarioId = config.scenarios.find((t) => t.id == intent);
            if (scenarioId && scenarioId.scenario && scenarioId.scenario[action])
                return Promise.resolve(scenarioId.scenario[action]);
            
            return Promise.reject('désolé le scenario ' + id + ' ne prend pas en charge l\'action ' + action);
        case "cmd":
            let room = config.cmds.find((t) => t.place == place + '_' + intent);
            console.log("getCommand function. action = " + action + " place = " + place + " intent = " + intent);
            if (room && room.cmd && room.cmd[action])
                return Promise.resolve(room.cmd[action]);
            
            return Promise.reject('désolé l\'emplacement ' + place + ' et l\'intention ' + intent +' ne prennent pas en charge l\'action ' + action);
        case "interact":
        case "variable":
    }
    
}

function jeeQuery(type, id, value, json = true)
{
    console.log("Getting command request for Jeedom");
    // Jeedom Query
    switch (type) {
        case "scenario":
            console.log("Getting scenario request. Id = " + id + " action " + value + " type = " + type);
            return request({
                host: config.jeedom.host,
                port: config.jeedom.port,
                path: config.jeedom.path,
                json
                }, {
                    'apikey': config.jeedom.apikey,
                    'type': type,
                    'id': id,
                    'action': value
            });
        case "cmd":
            if (slider) {
            console.log("Getting command request with slider value. Id = " + id + " type =  " + type + " slider = " + value);
            return request({
                host: config.jeedom.host,
                port: config.jeedom.port,
                path: config.jeedom.path,
                json
                }, {
                    'apikey': config.jeedom.apikey,
                    'type': type,
                    'id': id,
                    'slider': value
                });
            }else{
                console.log("Getting command request without slider value. Id = " + id + " type =  " + type);
                return request({
                    host: config.jeedom.host,
                    port: config.jeedom.port,
                    path: config.jeedom.path,
                    json
                }, {
                    'apikey': config.jeedom.apikey,
                    'type': type,
                    'id': id
                });
            }
        case "interact":
        case "variable":
    }
}

function createResponse(text, shouldEndSession = true) {
    console.log("Creating response");
	let response = {
		"version": "1.0",
		"sessionAttributes": {
		},
		"response": {
		  "outputSpeech": {
			"type": "PlainText",
			"text": text
		  },
		  "shouldEndSession": shouldEndSession
		}
	  };

	  return response;
}

function handleRequest(intent) {
    
    console.log("Handle request");
    
    let intentName = intent.name;
    let action = null;
    let place = null;
    let slider = null;
    let scenarioId = null;
    let reqType = null;

    switch (intentName) {
        case "light":
        case "door":
        case "window":
        case "curtain":
        case "shutter":
	        console.log("Getting intent name = " + intentName);
            reqType = 'cmd';

	        try {
                let actionValue = intent.slots.OnOff.resolutions.resolutionsPerAuthority[0];
                let placeValue = intent.slots.room.resolutions.resolutionsPerAuthority[0];
                let sliderValue = intent.slots.slider.value;

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
			        console.log("Action value =" + action);
		        }
		        if (placeValue.values) {
			        place = placeValue.values[0].value.name;
			        console.log("Place value = " + place);
		        }
		        if (sliderValue) {
                    console.log("Slider value = " + sliderValue);
                    slider = 100-sliderValue;
                    console.log("slider = " + slider);
		        }
	        }
	        
	        catch (err) {
		        return Promise.reject(locale.ERROR);
	        }
	        if (action == null) {
		        return Promise.reject(locale.ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(locale.ERROR_PLACE);
            }
            
            return getRequest(reqType, action, intentName, place)
                .then(console.log("Sending object command and request"))
                .then((c) => jeeQuery(reqType, c, slider, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
        case "wallplug":
            console.log("Getting intent name = " + intentName);
            reqType = 'cmd';

	        try {
                let actionValue = intent.slots.OnOff.resolutions.resolutionsPerAuthority[0];
                let placeValue = intent.slots.room.resolutions.resolutionsPerAuthority[0];

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
			        console.log("Action value =" + action);
		        }
		        if (placeValue.values) {
			        place = placeValue.values[0].value.name;
			        console.log("Place value = " + place);
		        }
	        }
	        
	        catch (err) {
		        return Promise.reject(locale.ERROR);
	        }
	        if (action == null) {
		        return Promise.reject(locale.ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(locale.ERROR_PLACE);
            }
            
            return getRequest(reqType, action, intentName, place)
                .then(console.log("Sending object command and request"))
                .then((c) => jeeQuery(reqType, c, slider, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
        case "scenario":
            console.log("Getting intent name = " + intentName);
            reqType = 'scenario';
            
            try {
            	if (intent.slots.scenarioId.value) {
            		scenarioId = intent.slots.scenarioId.value;
            	}
            }
            catch (err) {
            	return Promise.reject(locale.ERROR_SCENARIO_ID);
    		}

            try {
                let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
		        }
	        }
	        catch (err) {
		        return Promise.reject(locale.ERROR_ACTION_SCENARIO);
            }
            
            
            return getRequest(reqType, action, intentName, place)
                .then(console.log("Sending scenario command and request"))
                .then((c) => jeeQuery(reqType, scenarioId, c, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
        default:
            context.succeed(createResponse(locale.HELP));
    }
    console.log("End dialog with Alexa Freebox Devialet and Jeedom");
}

exports.handler = (event, context, callback) => {
    
    switch (event.request.type) {
        case "LaunchRequest":
            console.log("Openning Freebox Devialet");
            context.succeed(createResponse(locale.WELCOME, false));
        break;
        case "IntentRequest":
            console.log("Starting dialog with Alexa Freebox Devialet and Jeedom");
        	handleRequest(event.request.intent)
        		.then((response) => callback(null, response))
		        .catch((err) => {
			    	callback(null, createResponse(err));
		        });
        break;
    }
};
