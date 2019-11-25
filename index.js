'use strict';

const config = require('./config');
const request = require('./request');

const messages = {
    WELCOME: 'Welcome to Freebox Devialet Assistant',
    WHAT_DO_YOU_WANT: 'Que vouliez-vous dire ?',
    UNHANDLED: 'Désolé cette skill n\'est pas prise en charge.',
    HELP: 'Désolée je n\'ai pas pu répondre à votre demande. Vous pouvez me demander par exemple : Alexa demande à Devialer d\allumer la lumière de la cuisine, ou ferme le volet du salon, ou encore baisse le volet à 20%.',
    STOP: 'Bye! Thanks for using the Freebox Devialet Assistant!',
    ERROR: 'Désolé il y a eu une erreur',
    ERROR_ACTION: 'désolé je n\'ai pas compris l\'action',
    ERROR_PLACE: 'désolé je n\'ai pas compris l\'emplacement',
    ERROR_ACTION_SCENARIO: 'désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
    ERROR_SCENARIO_ID: 'désoélé le scenario n\'a pa été trouvé'
};

//-----------------------------------------------------------------------------

function getCommand(place, action, intent)
{
    console.log("Getting Jeedom object information");
	let room = config.cmds.find((t) => t.place == place + '_' + intent);
	console.log("getCommand function. Room = " + room + " action = " + action);
	if (room && room.cmd && room.cmd[action])
		return Promise.resolve(room.cmd[action]);

	return Promise.reject('désolé l\'emplacement ' + place + ' et l\'intention ' + intent +' ne prennent pas en charge l\'action ' + action);
}

function doRequest(id, type, slider, json = true)
{
    console.log("Getting command request");
    // Query for command : http://#IP_JEEDOM#/core/api/jeeApi.php?apikey=#APIKEY#&type=cmd&id=#ID#
    // Query for command with shutter slider : http://#IP_JEEDOM#/core/api/jeeApi.php?apikey=#APIKEY#&type=cmd&id=#ID#value=#SLIDER#
    if (slider) {
        console.log("Getting command request with slider value. Id = " + id + " type =  " + type + " slider = " + slider);
        return request({
            host: config.jeedom.host,
            port: config.jeedom.port,
            path: config.jeedom.path,
            json
            }, {
             'apikey': config.jeedom.apikey,
             'type': type,
             'id': id,
             'slider': slider
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

function getScenario(id, action) 
{
    console.log("Getting Jeedom scenario information");
    let scenarioId = config.scenarios.find((t) => t.id == id);
    if (scenarioId && scenarioId.scenario && scenarioId.scenario[action])
		return Promise.resolve(scenarioId.scenario[action]);

    return Promise.reject('désolé le scenario ' + id + ' ne prend pas en charge l\'action ' + action);
}

function doRequestScn(action, id, type, json = true)
{
    console.log("Getting scenario request. Id = " + id + " action " + action + " type = " + type);
	return request({
		host: config.jeedom.host,
		port: config.jeedom.port,
		path: config.jeedom.path,
		json
		}, {
		 'apikey': config.jeedom.apikey,
		 'type': type,
		 'id': id,
		 'action': action
	});
}

function createResponse(text, shouldEndSession = true) 
{
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

function handleRequest(intent) 
{
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
		        return Promise.reject(messages.ERROR);
	        }
	        if (action == null) {
		        return Promise.reject(messages.ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(messages.ERROR_PLACE);
            }
            
            return getCommand(place, action, intentName)
                .then(console.log("Sending object command and request"))
                .then((c) => doRequest(c, reqType, slider, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
	case "wallPlug":
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
		        return Promise.reject(messages.ERROR);
	        }
	        if (action == null) {
		        return Promise.reject(messages.ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(messages.ERROR_PLACE);
            }
            
            return getCommand(place, action, intentName)
                .then(console.log("Sending object command and request"))
                .then((c) => doRequest(c, reqType, slider, false))
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
            	return Promise.reject(messages.ERROR_SCENARIO_ID);
    		}

            try {
                let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
		        }
	        }
	        catch (err) {
		        return Promise.reject(messages.ERROR_ACTION_SCENARIO);
            }
            
            return getScenario(scenarioId, action)
                .then(console.log("Sending scenario command and request"))
                .then((c) => doRequestScn(c, scenarioId, reqType, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
        default:
            context.succeed(createResponse(messages.H));
    }
    console.log("End dialog with Alexa Freebox Devialet and Jeedom");
}

exports.handler = (event, context, callback) => {
	
    switch (event.request.type) {
        case "LaunchRequest":
            console.log("Openning Freebox Devialet");
            context.succeed(createResponse("Welcome to Freebox Devialet Assistant.", false));
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
