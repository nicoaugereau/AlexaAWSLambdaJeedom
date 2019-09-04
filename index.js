'use strict';

const config = require('./config');
const request = require('./request');

const messages = {
    WELCOME: 'Welcome to Freebox Devialet Assistant',
    WHAT_DO_YOU_WANT: 'What do you want to ask?',
    GOODBYE: 'Bye! Thanks for using the Freebox Devialet Assistant!',
    UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
    HELP: 'You can use this skill by asking something like: Turn on the light of the kitchen, or Alexa tell Devialet to turn on the light of the kitchen.',
    STOP: 'Bye! Thanks for using the Freebox Devialet Assistant!',
    ERROR_ACTION: 'désolé je n\'ai pas compris l\'action',
    ERROR_PLACE: 'désolé je n\'ai pas compris l\'emplacement',
    ERROR_ACTION_SCENARIO: 'désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
    ERROR_SCENARIO_ID: 'désoélé le scenario n\'a pa été trouvé'
};

//-----------------------------------------------------------------------------

function getCommand(place, action, intent)
{
	//let room = config.cmds.find((t) => t.place == place);
	//let room = config.cmds.find((t) => {t.place == place, t.intent == intent});
	let room = config.cmds.find((t) => t.place == place + '_' + intent);
	if (room && room.cmd && room.cmd[action])
		return Promise.resolve(room.cmd[action]);

	return Promise.reject('désolé l\'emplacement ' + place + ' et l\'intention ' + intent +' ne prennent pas en charge l\'action ' + action);
}

function doRequest(id, type, json = true)
{
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

function getScenario(id, action) 
{
    let scenarioId = config.scenarios.find((t) => t.id == id);
    if (scenarioId && scenarioId.scenario && scenarioId.scenario[action])
		return Promise.resolve(scenarioId.scenario[action]);

    return Promise.reject('désolé le scenario ' + id + ' ne prend pas en charge l\'action ' + action);
}

function doRequestScn(action, id, type, json = true)
{
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

function createResponse(text, shouldEndSession = true) {
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
    /*
    ajouter la partie scenario

    */
    let intentName = intent.name;
    let action = null;
    let place = null;
    let scenarioId = null;
    let reqType = null;
    
    switch (intentName) {
        case "light":
        case "door":
        case "wallPlug":
        case "window":
        case "curtain":
        case "shutter":
            //if (name != "lightIntent")
	        //	return Promise.reject('désolé seul les lumières sont supportés');
	        
            reqType = 'cmd';

	        try {
                let actionValue = intent.slots.OnOff.resolutions.resolutionsPerAuthority[0];
                let placeValue = intent.slots.room.resolutions.resolutionsPerAuthority[0];

		        if (actionValue.values) {
			        action = actionValue.values[0].value.name;
		        }
		        if (placeValue.values) {
			        place = placeValue.values[0].value.name;
		        }
	        }
	        catch (err) {
		        return Promise.reject('désolé il y a eu une erreur');
	        }
	        // change || to && 
	        // action : should always filled
	        // place : filled but if null then "maison"
	        if (action == null) {
		        return Promise.reject(messages.ERROR_ACTION);
	        } else if (place == null) {
                return Promise.reject(messages.ERROR_PLACE);
            }

            return getCommand(place, action, intentName)
				.then((c) => doRequest(c, reqType, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
        case "scenario":
        	
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
				.then((c) => doRequestScn(c, scenarioId, reqType, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
        break;
    }
}

exports.handler = (event, context, callback) => {
	
    switch (event.request.type) {
        case "LaunchRequest":
            context.succeed(createResponse("Welcome to Freebox Devialet Assistant.", false));
        break;
        case "IntentRequest":
        	handleRequest(event.request.intent)
        		.then((response) => callback(null, response))
		        .catch((err) => {
			    	callback(null, createResponse(err));
		        });
        break;
    }
};
