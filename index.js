/**
 * Alexa Skill Interaction for Jeedom
 * Skill Version : 1.2
 * Author : Nicolas Augereau
 * Licence : MIT
 */
 'use strict';

 const config = require('./config');
 const request = require('./request');
 let req;
 
 // Default language
 let DEFAULT_LOCALE = 'fr-FR';
 
 // language management
 let fr = {
     WELCOME: 'Bienvenue sur l\'assistant Freebox Devialet',
     WHAT_DO_YOU_WANT: 'Que vouliez-vous dire ?',
     UNHANDLED: 'Désolé cette skill n\'est pas prise en charge.',
     HELP: 'Désolé je n\'ai pas pu répondre à votre demande. Vous pouvez me demander par exemple : Alexa demande à Devialet d\'allumer la lumière de la cuisine, ou fermer le volet du salon, ou encore mettre le volet de la chambre à 20%.',
     STOP: 'Au revoir. Merci pour avoir utilisé l\'assistant Freebox Devialet !',
     ERROR: 'Désolé il y a eu une erreur',
     ERROR_ACTION: 'Désolé je n\'ai pas compris l\'action',
     ERROR_PLACE: 'Désolé je n\'ai pas compris l\'emplacement',
     ERROR_VALUE: "Désolé il y a eu un problème avec la valeur que vous souhaitez paramétrer",
     ERROR_ACTION_SCENARIO: 'Désolé l\'action n\'a pas été trouvée. Vous pouvez demander stoppe, arrête, lance, exécute, démarre, active, désactive.',
     ERROR_SCENARIO_ID: 'Désolé le scenario n\'a pa été trouvé',
     MULTIPLE_RESPONSES: ["oui", "très bien", "je m\'en occupe"]
 };
 let en = {
     WELCOME: 'Welcome to Freebox Devialet Assistant',
     WHAT_DO_YOU_WANT: 'What did you want to say?',
     UNHANDLED: 'Sorry this skill is not supported.',
     HELP: 'Sorry I couldn\'t answer your request. You can ask me for example: Alexa asks Devialet to turn on the kitchen light, or closes the living room shutter, or lowers the bedroomm shutter to 20%.',
     STOP: 'Bye! Thanks for using the Freebox Devialet Assistant!',
     ERROR: 'Sorry there was something wrong',
     ERROR_ACTION: 'Sorry i did not understand the action',
     ERROR_PLACE: 'Sorry i did not understand the place',
     ERROR_VALUE: 'Sorry, there was a problem with the value you want to set',
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
 
 function resourceData(lang) {
      var locale = lang !== undefined && lang.locale !== undefined ? lang.locale : DEFAULT_LOCALE;
      return globalResourceData[locale];
 }
 
 /* 
 type (Jeedom API): scenario, cmd, interact, variable
 action: turn on, turn off...
 intent: light, door, window, curtain, shutter, wallplug, scenario, object
 place: id, room
 */
 function getConfig(type, action, intent, place, user = null)
 {
     console.log("Getting Jeedom object information from Alexa JSON");
     // get informations from config.js
     switch (type) {
         case "scenario":
             console.log("Config information for " + type + ". id: " + place);
             let scenarioId = config.scenarios.find((t) => t.id == place);
             if (scenarioId && scenarioId.scenario && scenarioId.scenario[action])
                 return Promise.resolve(scenarioId.scenario[action]);
             return Promise.reject(resourceData(req).ERROR_ACTION_SCENARIO);
         case "cmd":
             console.log("Config information for " + type + ". action: " + action + " intent: " + intent + " place: " + place + " user:" + user);
             let room = config.cmds.find((t) => t.intent == intent && t.place == place && t.user == user);
             if (room && room.cmd && room.cmd[action])
                 return Promise.resolve(room.cmd[action]);
             return Promise.reject(resourceData(req).HELP);
         case 'object':
             console.log("Config information for " + type + ". action: " + action + " intent: " + intent + " user:" + user);
             let object = config.objects.find((t) => t.place == place && t.user == user);
             if (object && object.cmd && object.cmd[action])
                 return Promise.resolve(object.cmd[action]);
             return Promise.reject(resourceData(req).HELP);
         case "housemode":
             console.log("Config information for " + type + ". action: " + action + " mode: " + place);
             let mode = config.housemode.find((t) => t.name == place);
             if (mode && mode.cmd && mode.cmd[action])
                 return Promise.resolve(mode.cmd[action]);
             return Promise.reject(resourceData(req).HELP);
     }
 }
 
 function jeeQuery(type, id, value, json = true)
 {
     console.log("Sending request for Jeedom");
     var options = {
                 host: config.jeedom.host,
                 port: config.jeedom.port,
                 path: config.jeedom.path,
                 json
                 };
     // Jeedom Query
     switch (type) {
         case "scenario":
             console.log(type + ". Id: " + id + " action: " + value + " type: " + type);
             return request(options, {
                     'apikey': config.jeedom.apikey,
                     'type': type,
                     'id': value,
                     'action': id
             });
         case "cmd":
             if (value) {
                 console.log(type + " with slider value. Id: " + id + " type: " + type + " slider: " + value);
                 return request(options, {
                     'apikey': config.jeedom.apikey,
                     'type': type,
                     'id': id,
                     'slider': value
                 });
             }else{
                 console.log(type + " without slider value. Id: " + id + " type: " + type);
                 return request(options, {
                     'apikey': config.jeedom.apikey,
                     'type': type,
                     'id': id
                 });
             }
         case "object":
             console.log(type + ". Id: " + id + " type: " + type);
             return request(options, {
                     'apikey': config.jeedom.apikey,
                     'type': 'cmd',
                     'id': id,
             });
         case "housemode":
             console.log(type + ". Id: " + id );
             return request(options, {
                 'apikey': config.jeedom.apikey,
                 'type': 'cmd',
                 'id': id
             });
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
 function handleRequest(intent) {
     
     console.log("Handle request");
     let intentName = intent.name;
     let action, place, setter, user, scenarioId, mode, reqType;
     action = place = setter = user = scenarioId = mode = reqType = null;
     
     console.log("Intent is " + intentName);
     switch (intentName) {
         case "light":
         case "door":
         case "window":
         case "curtain":
         case "shutter":
             reqType = 'cmd';
 
             try {
                 let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];
                 
                 let placeValue = intent.slots.room.resolutions.resolutionsPerAuthority[0];
                 let sliderValue = intent.slots.slider.value;
                 let userValue = intent.slots.user.value;
     
                 action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req).ERROR_ACTION);
                 console.log("Action value: " + action);
                 place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req).ERROR_PLACE);
                 console.log("Place value: " + place);
                 user = userValue ? userValue : null;
                 console.log("User value: " + user);
                 
                 if (sliderValue) {
                     setter = action == "close" ? 100-sliderValue : sliderValue;
                     action = "set";
                     console.log("Slider: " + setter);
                 }
             }
             catch (err) {
                 return Promise.reject(resourceData(req).ERROR);
             }
             break;
         case "wallplug":
             reqType = 'cmd';
 
             try {
                 let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];
                 let placeValue = intent.slots.room.resolutions.resolutionsPerAuthority[0];
                 let userValue = intent.slots.user.value;
 
                 action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req).ERROR_ACTION);
                 console.log("Action value: " + action);
                 place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req).ERROR_PLACE);
                 console.log("Place value: " + place);
                 user = userValue ? userValue : null;
                 console.log("User value: " + user);
             }
             catch (err) {
                 return Promise.reject(resourceData(req).ERROR);
             }
             break;
         case "objects":
             reqType = 'object';
 
             try {
                 let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];
                 let placeValue = intent.slots.object.resolutions.resolutionsPerAuthority[0];
                 let userValue = intent.slots.user.value;
                 
                 action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req).ERROR_ACTION);
                 console.log("Action value: " + action);
                 place = placeValue.values ? placeValue.values[0].value.name : Promise.reject(resourceData(req).ERROR_PLACE);
                 console.log("Place value: " + place);
                 user = userValue ? userValue : null;
                 console.log("User value: " + user);
             }
             catch (err) {
                 return Promise.reject(resourceData(req).ERROR);
             }
             break;
         case "scenario":
             reqType = 'scenario';
             
             try {
                 let scenarioValue = intent.slots.scenarioId;
                 let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];
                 
                 scenarioId = scenarioValue ? scenarioValue : Promise.reject(resourceData(req).ERROR_SCENARIO_ID);
                 place = setter = scenarioId;
                 console.log("Scenario id: " + place);
                 action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req).ERROR_ACTION_SCENARIO);
                 console.log("Action value: " + action);
             }
             catch (err) {
                 return Promise.reject(resourceData(req).ERROR_SCENARIO_ID);
             }
             break;
         case "housemode":
             reqType = 'housemode';
             
             try {
                 let actionValue = intent.slots.action.resolutions.resolutionsPerAuthority[0];
                 let modeValue = intent.slots.mode.resolutions.resolutionsPerAuthority[0];
                 
                 action = actionValue.values ? actionValue.values[0].value.id : Promise.reject(resourceData(req).ERROR_SCENARIO_ID);
                 setter = action;
                 console.log("Action value: " + setter);
                 mode = modeValue.values ? modeValue.values[0].value.name : Promise.reject(resourceData(req).ERROR_ACTION);
                 place = mode;
                 console.log("Mode value: " + place);
             }
             catch (err) {
                 return Promise.reject(resourceData(req).ERROR_ACTION_SCENARIO);
             }
             break;
         default:
             context.succeed(createResponse(resourceData(req).HELP));
     }
     return getConfig(reqType, action, intentName, place, user)
                 .then(console.log("Sending cmd request"))
                 .then((c) => jeeQuery(reqType, c, setter, false))
                 .then(() => createResponse( resourceData(req).MULTIPLE_RESPONSES[Math.floor(Math.random() * resourceData(req).MULTIPLE_RESPONSES.length)] ))
                 //.then(() => console.log("End dialog with Alexa Freebox Devialet and Jeedom"));
 }
 
 exports.handler = (event, context, callback) => {
     req = event.request;
     switch (req.type) {
         case "LaunchRequest":
             console.log("Openning Freebox Devialet");
             context.succeed(createResponse(resourceData(req).WELCOME, false));
         break;
         case "IntentRequest":
             console.log("Starting dialog with Alexa Freebox Devialet and Jeedom");
             handleRequest(req.intent)
                 .then((response) => callback(null, response))
                 .catch((err) => {
                     callback(null, createResponse(err));
                 });
         break;
     }
 };
 