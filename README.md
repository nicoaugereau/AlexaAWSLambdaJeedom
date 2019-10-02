![NodeJS version](https://img.shields.io/badge/node-v8.10-green.svg) ![Dev status](https://img.shields.io/badge/status-development-orange.svg)

# Freebox Devialet and Alexa AWS Lambda assistant control for Jeedom

This repository allows you to control home automation objects with Alexa (Freebox Devialet, Echo, Dot, Alexa for iPhone or Android) with AWS Lambda and Jeedom installed on a raspberry. 
You can ask for object (light, door, wallplug, shutter, curtain, window) in a room or ask for a scenario id.

This skill is design for French language.

Prerequisites
-------------
- Alexa developer account
- AWS developer account
- Freebox v7 (Delta and Devialet) or Alexa product (Echo, Dot)
- Raspberry and Jeedom installed with https


Getting started
-------------
- Open Alexa Developer Console and Create Skill
- Copy the file 'interaction-model.json' in JSON editor
- Save
- Open AWS Developer console
- Create an empty lambda function
- Download the zip from this repository in the Amazon Developer Console
- Add the Alexa Skill kit trigger and set it up with the Alexa Skill ID
- Enter the AWS ID in the Alexa console
- Build the model
- Add your Jeedom configuration to 'config.js' file. Adapt sentences for English or French

Invoke the skill:  
Object:
- Tell Alexa "Alexa open Devialet" (Devialet is the skill invocation name) and tell "turn on the light of the kitchen"
- Or, tell "Alexa ask Devialet to turn on the light of the kitchen"
- "Alexa ask Devialet to open the shutter of the kitchen"
- "Alexa ask Devialet to put the kitchen shutter at 40 %"
  
Scenario:
- "Alexa ask Devialet to execute scenario 4"

Invoker le skill :  
Objet :
- Demander à Alexa "Alexa ouvre Devialet" (Devialet est le nom d'invocation du skill) et demander "Allume la lumière de la cuisine"
- Ou, "Alexa demande à Devialet d'allumer la lumière de la cuisine"
- "Alexa demande à Devialet d'ouvrir le volet de la cuisine"
- "Alexa demande à Devialet d'ouvrir le volet de la cuisine à 40 %"
  
Scenario :
- "Alexa demande à Devialet d'exécuter le scenario 4"
