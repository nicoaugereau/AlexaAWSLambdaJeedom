![NodeJS version](https://img.shields.io/badge/node-v8.10-green.svg)

# Freebox Devialet and Alexa AWS Lambda assistant control for Jeedom

This repository allows you to control home automation objects with Alexa (Freebox Devialet, Echo or Dot) with AWS Lambda and Jeedom installed on a raspberry.

Prerequisites
-------------
- Alexa developer account
- AWS developer account
- Freebox Devialet or Alexa product (Echo, Dot)


Getting started
-------------
- Open Alexa Developer Console and Create Skill
- Copy the file 'inteaction-model.json' in JSON editor
- Save
- Build the model
- Open AWS Developer console
- Create an empty lambda function
- Download the zip from this repository in the Amazon Developer Console
- Add the Alexa Skill kit trigger and set it up with the Alexa Skill ID
- Enter the AWS ID in the Alexa console
- Add your Jeedom configuration to 'config.js' file. Adapt sentences for English or French

Testing (English)
- Tell Alexa "Alexa open Freebox Devialet" (Freebox Devialet is the skill invocation name)
- And tell "turn on the light of the kitchen"

Tester (Français
- Demander à Alexa "Alexa ouvre Freebox Devialet" (Freebox Devialet est le nom d'invocation du skill)
- Et demander "Allume la lumière de la cuisine"
