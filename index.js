/*
    Alexa Skill Interaction for Jeedom
    Skill Version : 1.0
    Author : Nicolas Augereau
    Licence : MIT
*/

'use strict';

const config = require('./config');
const request = require('./request');

// language management
let fr = {
    WELCOME: 'Bienvenue sur l\'assistant Freebox Devialet',
    WHAT_DO_YOU_WANT: 'Que vouliez-vous dire ?',
    UNHANDLED: 'Désolé cette skill n\'est pas prise en charge.',
    HELP: 'Désolé je n\'ai pas pu répondre à votre demande. Vous pouvez me demander par exemple : Alexa demande à Devialet d\'allumer la lumière de la cuisine, ou fermer le volet du salon, ou encore mettre le volet à 20%.',
    STOP: 'Au revoir. Merci pour avoir utilisé l\'assistant Freebox Devialet !',
    ERROR: 'Désolé il y a eu une erreur',
    ERROR_ACTION: 'Désolé je n\'ai pas compris l\'action',
    ERROR_PLACE: 'Désolé je n\'ai pas compris l\'emplacement',
    ERROR_ACTION_SCENARIO: 'Désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
    ERROR_SCENARIO_ID: 'Désolé le scenario n\'a pa été trouvé',
    MULTIPLE_RESPONSES: ["oui", "très bien", "je m\'en occupe"]
};
let en = {
    WELCOME: 'Welcome to Freebox Devialet Assistant',
    WHAT_DO_YOU_WANT: 'What did you want to say?',
    UNHANDLED: 'Sorry this skill is not supported.',
    HELP: 'Sorry I couldn\'t answer your request. You can ask me for example: Alexa asks Devialet to turn on the kitchen light, or closes the living room shutter, or lowers the shutter to 20%.',
    STOP: 'Bye! Thanks for using the Freebox Devialet Assistant!',
    ERROR: 'Sorry there was something wrong',
    ERROR_ACTION: 'Sorry i did not understand the action',
    ERROR_PLACE: 'Sorry i did not understand the place',
    ERROR_ACTION_SCENARIO: 'Sorry the action wasn\'t found. You can request stop, stop, start, run, execute, start, enable, disable.',
    ERROR_SCENARIO_ID: 'Sorry i did not find the scenario',
    MULTIPLE_RESPONSES: ["yes", "ok", "I will handle it"]
};
let globalResourceData = {
    'en-AU': en,
    'en-CA': en,
    'en-GB': en,
    'en-US': en,
    'fr-BE': fr,
    'fr-CA': fr,
    'fr-CH': fr,
    'fr-FR': fr,
    'fr-LU': fr,
    'fr-MC': fr
};

function resourceData(request) {
    let DEFAULT_LOCALE = 'fr-FR';
    if (request !== undefined && request.locale !== undefined) {
        var locale = request.locale;
    }
    else {
        var locale = DEFAULT_LOCALE;
    }
    return globalResourceData[locale];
}

/* 
type (Jeedom API): scenario, cmd, interact, variable
action: turn on, turn off...
intent: light, door, window, curtain, shutter, wallplug, scenario, object
place: id, room
*/
function getRequest(type, action, intent, place)
{
    console.log("Getting Jeedom object information from Alexa JSON");
    // get informations from config.js
    switch (type) {
        case "scenario":
            console.log("Getting Jeedom scenario informations");
            let scenarioId = config.scenarios.find((t) => t.id == place);
            if (scenarioId && scenarioId.scenario && scenarioId.scenario[action])
                return Promise.resolve(scenarioId.scenario[action]);
            
            return Promise.reject(resourceData(request).ERROR_ACTION_SCENARIO);
        case "cmd":
            console.log("getCommand function. action = " + action + " place = " + place + " intent = " + intent);
            let room = config.cmds.find((t) => t.place == place, (t) => t.place == intent);
            if (room && room.cmd && room.cmd[action])
                return Promise.resolve(room.cmd[action]);
            
            return Promise.reject(resourceData(request).ERROR_ACTION_SCENARIO);
        case 'object':
            console.log("Getting object informations");
            let object = config.objects.find((t) => t.id == place);
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
            if (value) {
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

// Alexa intents
function handleRequest(intent) {
    
    console.log("Handle request");
    let intentName = intent.name;
    let action = null;
    let place = null;
    let slider = null;
    let scenarioId = null;
    let object = null;
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
		        return Promise.reject(resourceData(request).ERROR);
	        }
	        if (action == null) {
		        return Promise.reject(resourceData(request).ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(resourceData(request).ERROR_PLACE);
            }
            
            return getRequest(reqType, action, intentName, place)
                .then(console.log("Sending object command and request"))
                .then((c) => jeeQuery(reqType, c, slider, false))
				.then(() => createResponse( resourceData(request).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(request).MULTIPLE_RESPONSES.length)] ));
        break;
        case "wallplug":
        case "objects":
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
		        return Promise.reject(resourceData(request).ERROR);
	        }
	        
	        if (action == null) {
		        return Promise.reject(resourceData(request).ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(resourceData(request).ERROR_PLACE);
            }
            
            return getRequest(reqType, action, intentName, place)
                .then(console.log("Sending object command and request"))
                .then((c) => jeeQuery(reqType, c, slider, false))
				.then(() => createResponse( resourceData(request).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(request).MULTIPLE_RESPONSES.length)] ));
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
            	return Promise.reject(resourceData(request).ERROR_SCENARIO_ID);
    		}

            try {
                let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
		        }
	        }
	        catch (err) {
		        return Promise.reject(resourceData(request).ERROR_ACTION_SCENARIO);
            }
            
            
            return getRequest(reqType, action, intentName, scenarioId)
                .then(console.log("Sending scenario command and request"))
                .then((c) => jeeQuery(reqType, scenarioId, c, false))
				.then(() => createResponse( resourceData(request).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(request).MULTIPLE_RESPONSES.length)] ));
        break;
        default:
            context.succeed(createResponse(resourceData(request).HELP));
    }
    console.log("End dialog with Alexa Freebox Devialet and Jeedom");
}

exports.handler = (event, context, callback) => {
    let request = event.request;
    switch (request.type) {
        case "LaunchRequest":
            console.log("Openning Freebox Devialet");
            context.succeed(createResponse(resourceData(request).WELCOME, false));
        break;
        case "IntentRequest":
            console.log("Starting dialog with Alexa Freebox Devialet and Jeedom");
        	handleRequest(request.intent)
        		.then((response) => callback(null, response))
		        .catch((err) => {
			    	callback(null, createResponse(err));
		        });
        break;
    }
};
