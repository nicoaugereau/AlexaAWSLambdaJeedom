/**
 * Alexa Skill Interaction for Jeedom
 * Skill Version : 1.3
 * Author : Nicolas Augereau
 * Licence : MIT
 */
const { jeedom, cmds, scenarios, wallplugs, objects, modes } = require('./config.js');
const httpsJeedom = require ('./request.js');

const fr = require('./locales/fr.json');
const en = require('./locales/en.json');

let req;
// Default language
let DEFAULT_LOCALE = 'fr-FR';
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

function resourceData(lang) {
      var locale = lang !== undefined && lang.locale !== undefined ? lang.locale : DEFAULT_LOCALE;
     return globalResourceData[locale];
}

/**
 * type (Jeedom API): scenario, cmd, interact, variable
 * action: turn on, turn off...
 * intent: light, door, window, curtain, shutter, wallplug, scenario, object
 * place: id, room
 * @param {*} type 
 * @param {*} action 
 * @param {*} intent 
 * @param {*} place 
 * @param {*} user 
 * @returns 
 */
function getConfig(type, action, req, place, user = null) {
    console.log("Getting Jeedom object information from Alexa JSON");
    let intent = req.intent.name;
    let locale = req.locale;

    switch (type) {
        case "cmd":
            console.log(`Config information for ${type}. action: ${action}, intent: ${intent}, place: ${place}, user: ${user}`);
            try {
                let room = intent =='wallplug' ? wallplugs.find(mode => mode.place === place) : cmds.find(cmd => cmd.intent === intent && cmd.place === place && cmd.user === user);
                if (room && room.cmd && room.cmd[action]) {
                    return Promise.resolve(room.cmd[action]);
                }
            } catch (err) {
                return Promise.reject(resourceData(locale).HELP);
            }
            break;
        case "scenario":
            console.log(`Config information for ${type}. id: ${place}`);
            try {
                let scenarioId = scenarios.find(scenario => scenario.id == place);
                if (scenarioId && scenarioId.cmd[action]) {
                    return Promise.resolve(scenarioId.cmd[action]);
                }
            } catch (err) {
                return Promise.reject(resourceData(locale).ERROR_ACTION_SCENARIO);
            }
            break;
        case 'object':
            console.log(`Config information for ${type}. action: ${action}, intent: ${intent}, user: ${user}`);
            try {
                let object = objects.find(obj => obj.place === place && obj.user === user);
                if (object && object.cmd && object.cmd[action]) {
                    return Promise.resolve(object.cmd[action]);
                }
            } catch (err) {
                return Promise.reject(resourceData(locale).HELP);
            }
            break;
        case "mode":
            console.log(`Config information for ${type}. action: ${action}, mode: ${place}`);
            try {
                let mode = modes.find(mode => mode.name === place);
                if (mode && mode.cmd && mode.cmd[action]) {
                    return Promise.resolve(mode.cmd[action]);
                }
            } catch (err) {
                return Promise.reject(resourceData(locale).HELP);
            }
            break;
    }
}

async function jeeQuery({param, id, value, json = true}) {
    console.log("Sending request for Jeedom");
    console.log(`jeeQuerry params : ${param} ; ${id} ; ${value}`);

    const options = {
        host: jeedom.host,
        port: jeedom.port,
        path: jeedom.path,
        json
    };

    const apikey = jeedom.apikey;
    const typeQuery = {
        'apikey': apikey,
        'type': param,
        'id': id
    };

    if (value) {
        if (param === "cmd") {
            typeQuery['slider'] = value;
        } else {
            typeQuery['action'] = value;
        }
    } 

    try {
        const response = await httpsJeedom(options, typeQuery);
        return Promise.resolve(response);
    } catch (err) {
        return resourceData(req.locale).ERROR;
    }
}

function createResponse(text, shouldEndSession = true) {
    console.log("Creating response");
    return {
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
}

// Alexa intents
function handleRequest(req) {
    console.log("Handle request");

    let setQuerry = {};
    let intentName = req.intent.name;
    let action, place, setter, user, type;
    let actionValue = req.intent.slots.action.resolutions.resolutionsPerAuthority[0];

    action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req.locale).ERROR_ACTION);
    place = setter = user = type = null;

    function processIntent(intentName) {
        try {
            let placeValue;
            if (["light", "door", "window", "curtain", "shutter", "wallplug"].indexOf(intentName) > -1) {
                type = "cmd";
                placeValue = req.intent.slots.room.resolutions.resolutionsPerAuthority[0];
                place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req.locale).ERROR_PLACE);
            }
            if (intentName == "object") {
                type = "object";
                placeValue = req.intent.slots.objects.resolutions.resolutionsPerAuthority[0];
                place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req.locale).ERROR_PLACE);
            }
            if (intentName == "scenario") {
                type = "scenario";
                place = req.intent.slots.scenarioId.value ? req.intent.slots.scenarioId.value : Promise.reject(resourceData(req.locale).ERROR_SCENARIO_ID);
            }
            if (intentName == "mode") {
                type = "mode";
                place = req.intent.slots.modes.value ? req.intent.slots.modes.value : Promise.reject(resourceData(req.locale).ERROR_ACTION_SCENARIO);
            }

            user = req.intent.slots.user ? req.intent.slots.user.value : null;
            
            let sliderValue = req.intent.slots.slider ? req.intent.slots.slider.value : null;
            if (sliderValue) {
                setter = action == "close" ? 100 - sliderValue : sliderValue;
                action = "set";
            }
            
        } catch (err) {
            return resourceData(req.locale).ERROR;
        }

        try {
            const handle = getConfig(type, action, req, place, user)
            .then(config => {
                setQuerry = {
                    param: type == "scenario" ? "scenario" : "cmd",
                    id: type == "scenario" ? place : config,
                    value: type == "mode" ? action : type == "scenario" ? config : setter,
                    json: false
                };
                jeeQuery(setQuerry);
            })
            .then(() => createResponse(resourceData(req.locale).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(req.locale).MULTIPLE_RESPONSES.length)]));
            return Promise.resolve(handle);
        } catch (err) {
            return resourceData(req.locale).ERROR;
        }
    }

    try { 
        const process = processIntent(intentName);
        return Promise.resolve(process);
    } catch (err) {
        return resourceData(req.locale).ERROR;
    }
}

exports.handler = async function(event, context, callback) {
    req = event.request;
    if (req.type == "LaunchRequest") {
        console.log("Openning Freebox Devialet");
        return context.succeed(createResponse(resourceData(req.locale).WELCOME, false));
    }
    if (req.type == "IntentRequest") {
        console.log("Starting dialog with Alexa Freebox Devialet and Jeedom");
        try {
            const res = await handleRequest(req).then((response) => callback(null, response))
		        .catch((err) => {
			    	callback(null, createResponse(err));
		        });
            return res;
        } catch (err) {
            return createResponse(err);
        }
    }
};