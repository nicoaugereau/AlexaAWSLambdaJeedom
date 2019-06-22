'use strict';

const config = require('./config');
const request = require('./request');

//-----------------------------------------------------------------------------

function getCommand(place, action, intent)
{
	//let room = config.cmds.find((t) => t.place == place);
	//let room = config.cmds.find((t) => {t.place == place, t.intent == intent});
	let room = config.cmds.find((t) => t.place == place + '_' + intent);
	//if (room && room.cmd && room.cmd[action])
	if (room && room.cmd && room.cmd[action])
		return Promise.resolve(room.cmd[action]);

	return Promise.reject('désolé l\'emplacement ' + place + ' et l\'intention ' + intent +' ne prennent pas en charge l\'action ' + action);
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
	let intentName = intent.name;

	//if (name != "lightIntent")
	//	return Promise.reject('désolé seul les lumières sont supportés');

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
		} else {
			place = "maison";
		}
	}
	catch (err) {
		return Promise.reject('désolé il y a eu une erreur');
	}
	// change || to && 
	// action : should always filled
	// place : filled but if null then "maison"
	if (action == null && place == null) {
		return Promise.reject('désolé je n\'ai pas compris ');
	}

	return getCommand(place, action, intentName)
				.then((c) => doRequest(c, false))
				.then(() => createResponse([ "très bien", "oui", "compris", "je m'en occupe" ][Math.floor(Math.random() * 4)]) );
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