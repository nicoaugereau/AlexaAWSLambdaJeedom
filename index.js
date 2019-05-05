'use strict';

const config = require('./config');
const request = require('./request');


var buildSpeechletResponse;
var generateResponse;

//-----------------------------------------------------------------------------

exports.handler = (event, context, callback) => {
	
    switch (event.request.type) {
        case "LaunchRequest":
            context.succeed(generateResponse(buildSpeechletResponse("Welcome to Freebox Devialet Assistant.", false)));
        break;
        case "IntentRequest":
            switch (event.request.intent.name) {
                case "lightIntent":
                    handleRequest(event.request.intent)
		                .then((response) => callback(null, response))
		                .catch((err) => {
			                callback(null, createResponse(err))
                            ;
		                });
                break;
                case "doorIntent":
                    handleRequest(event.request.intent)
		                .then((response) => callback(null, response))
		                .catch((err) => {
			                callback(null, createResponse(err))
                            ;
		                });                break;
                case "wallPlugIntent":
                    handleRequest(event.request.intent)
		                .then((response) => callback(null, response))
		                .catch((err) => {
			                callback(null, createResponse(err))
                            ;
		                });
                break;
                case "windowIntent":
                    handleRequest(event.request.intent)
		                .then((response) => callback(null, response))
		                .catch((err) => {
			                callback(null, createResponse(err))
                            ;
		                });
                break;
                default:
                    context.succeed(generateResponse(buildSpeechletResponse("Désolé je n'ai pas réussi à faire ce que vous vouliez", true)));
            }
        break;
    }
};

buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    };
};

generateResponse = (speechletResponse) => {
    return {
        version: "1.0",
        response: speechletResponse
    };
};

function createResponse(text) {
	let response = {
		"version": "1.0",
		"sessionAttributes": {
		},
		"response": {
		  "outputSpeech": {
			"type": "PlainText",
			"text": text
		  },
		  "shouldEndSession": true
		}
	  };

	  return response;
}

function handleRequest(intent) {
	let name = intent.name;

	if (name != "lightIntent")
		return Promise.reject('désolé seul les volets sont supportés');

	let action = null;
	let place = null;

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

	if (action == null || place == null) {
		return Promise.reject('désolé je n\'ai pas compris ');
	}

	return getCommand(place, action)
				.then((c) => doRequest(c, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
}

function getCommand(place, action)
{
	let room = config.cmds.find((t) => t.place == place);
	if (room && room.cmd && room.cmd[action])
		return Promise.resolve(room.cmd[action]);

	return Promise.reject('désolé l\'emplacement ' + place + ' ne prend pas encharge l\'action ' + action);
}
function doRequest(id, json = true)
{
	return request({
		host: config.jeedom.host,
		port: config.jeedom.port,
		path: config.jeedom.path,
		json
		}, {
		 'apikey': config.jeedom.apikey,
		 'type': 'cmd',
		 'id': id
	});
}