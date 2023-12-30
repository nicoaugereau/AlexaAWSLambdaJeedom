/**
 * Alexa Skill Interaction for Jeedom
 * Skill Version : 1.3
 * Author : Nicolas Augereau
 * Licence : MIT
 */
import { scenarios, cmds, objects, housemode, jeedom } from './config.js';
import request from './request.js';
import fr from './locales/fr.json';
import en from './locales/en.json';
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
    // get informations from config.js
    switch (type) {
        case "scenario":
            console.log(`Config information for ${type}. id: ${place}`);
            let scenarioId = scenarios.find(scenario => scenario.id == place);
            if (scenarioId && scenarioId.scenario && scenarioId.scenario[action]) {
                return Promise.resolve(scenarioId.scenario[action]);
            }
            return Promise.reject(resourceData(locale).ERROR_ACTION_SCENARIO);
        case "cmd":
            console.log(`Config information for ${type}. action: ${action}, intent: ${intent}, place: ${place}, user: ${user}`);
            let room = cmds.find(cmd => cmd.intent === intent && cmd.place === place && cmd.user === user);
            if (room && room.cmd && room.cmd[action]) {
                return Promise.resolve(room.cmd[action]);
            }
            return Promise.reject(resourceData(locale).HELP);
        case 'object':
            console.log(`Config information for ${type}. action: ${action}, intent: ${intent}, user: ${user}`);
            let object = objects.find(obj => obj.place === place && obj.user === user);
            if (object && object.cmd && object.cmd[action]) {
                return Promise.resolve(object.cmd[action]);
            }
            return Promise.reject(resourceData(locale).HELP);
        case "housemode":
            console.log(`Config information for ${type}. action: ${action}, mode: ${place}`);
            let mode = housemode.find(mode => mode.name === place);
            if (mode && mode.cmd && mode.cmd[action]) {
                return Promise.resolve(mode.cmd[action]);
            }
            return Promise.reject(resourceData(locale).HELP);
    }
}
 
function jeeQuery(type, id, value, json = true) {
    console.log("Sending request for Jeedom");

    const options = {
        host: jeedom.host,
        port: jeedom.port,
        path: jeedom.path,
        json
    };

    const apikey = jeedom.apikey;
    const typeQuery = {
        'apikey': apikey,
        'type': type
    };

    if (value) {
        if (type === "cmd") {
            typeQuery['slider'] = value;
        } else {
            typeQuery['id'] = value;
        }
    } else {
        typeQuery['id'] = id;
    }

    return request(options, typeQuery);
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

    let intentName = req.intent.name;
    let action, place, setter, user, type;
    let actionValue = req.intent.slots.action.resolutions.resolutionsPerAuthority[0];

    action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req.locale).ERROR_ACTION);
    place = setter = user = type = null;

    function processIntent(intentName) {
        try {
            let placeValue;
            let sliderValue = req.intent.slots.slider.value;
            if (["light", "door", "window","curtain","shutter", "wallplug"].indexOf(intentName) > -1) {
                type= "cmd";
                placeValue = req.intent.slots.room.resolutions.resolutionsPerAuthority[0];
                place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req.locale).ERROR_PLACE);
            }
            if (intentName == "objects") {
                type = "object";
                placeValue = req.intent.slots.object.resolutions.resolutionsPerAuthority[0];
                place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req.locale).ERROR_PLACE);
            }
            if (intentName == "scenario") {
                type = "scenario";
                place = req.intent.slots.scenarioId.value ? req.intent.slots.scenarioId.value : Promise.reject(resourceData(req.locale).ERROR_SCENARIO_ID);
            }
            if (intentName == "housemode") {
                type = "housemode";
                placeValue = req.intent.slots.mode.resolutions.resolutionsPerAuthority[0];
                place = placeValue.values ? placeValue.values[0].value.name :Promise.reject(resourceData(req.locale).ERROR_ACTION_SCENARIO);
            }

            user = req.intent.slots.user.value ? req.intent.slots.user.value : null;
            
            if (sliderValue) {
                setter = action == "close" ? 100 - sliderValue : sliderValue;
                action = "set";
            }
            
        } catch (err) {
            return Promise.reject(resourceData(req.locale).ERROR);
        }

        return getConfig(type, action, req, place, user)
            .then(config => jeeQuery(type, config, setter, true))
            .then(() => createResponse(resourceData(req.locale).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(req.locale).MULTIPLE_RESPONSES.length)]));
    }

    processIntent(intentName);
}
 
export function  handler(event, context, callback) {
    req = event.request;
    switch (req.type) {
        case "LaunchRequest":
            console.log("Openning Freebox Devialet");
            context.succeed(createResponse(resourceData(req.locale).WELCOME, false));
        break;
        case "IntentRequest":
            console.log("Starting dialog with Alexa Freebox Devialet and Jeedom");
            handleRequest(req)
                .then((response) => callback(null, response))
                .catch((err) => {
                    callback(null, createResponse(err));
                });
        break;
    }
}