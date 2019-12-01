
![NodeJS version](https://img.shields.io/badge/node-v8.10-green.svg) 
![Version](https://img.shields.io/badge/version-v1.0-brightgreen)
<!--
![Dev status](https://img.shields.io/badge/status-development-orange.svg)
-->
![MIT Licence](https://img.shields.io/badge/license-MIT-green)

# Alexa AWS Lambda assistant for Jeedom

This repository allows you to control home automation objects with Alexa (Freebox Devialet, Echo, Dot, Alexa for iPhone or Android) with AWS Lambda and Jeedom installed on a raspberry. 
You can ask for object (light, door, wallplug, shutter, curtain, window) in a room or ask for a scenario id.

This skill is design for French and English languages. But it is possible to add many others.

**Prerequisites**
-------------
- Alexa developer account
- AWS developer account
- Freebox v7 (Delta with Devialet) or Alexa product (Echo, Dot)
- Raspberry and Jeedom installed with https


**Getting started**
-------------
- Open Alexa Developer Console and Create Skill
- Copy the file 'interaction-model.json' in JSON editor
- You can change add utterrances, actions in action slot or places in place slot
- Save
- Open AWS Developer console
- Create an empty lambda function
- Select Execution : Node.js 8.10
- Download the zip from this repository in the Amazon Developer Console
- Add the Alexa Skill kit trigger and set it up with the Alexa Skill ID
- Enter the AWS ID in the Alexa console
- Build the model
- Add your Jeedom configuration to 'config.js' file. Adapt sentences for English or French

**Capabilities**
-------------
You can ask Alexa to invoke Jeedom API methods:
- Scenario: start, stop, activate, deactive
- Command: turn on, turn off, open, close, slider (%), status

Objects supported:
- Lights
- Wallplugs
- Doors
- Windows
- Curtains
- Shutters

**Usage**
-------------
Invoke the skill:  
Scenario example:
- "Alexa ask Devialet to start scenario 4"

Command examples:
- Tell Alexa "Alexa open Devialet" (Devialet is the skill invocation name) and tell "turn on the light of the kitchen"
- Or, tell "Alexa ask Devialet to turn on the light of the kitchen"
- "Alexa ask Devialet to open the shutter of the kitchen"
- "Alexa ask Devialet to put the kitchen shutter at 40 %"


***Use for roller shutters***

To control the shutters, 3 or 4 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action on the roller shutter (open / close)
- the location of the roller shutter (in which room the shutter is located)
- and if applicable, the percentage for positioning the roller shutter

For example: 
- To open the shutters, ask Alexa "Alexa asks Devialet to open the shutters of the living room".
- To position the roller shutter at a certain percentage, then ask "Alexa asks Devialet to set the shutter at 20%".


***Use for lights***

To control the lights, 3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action on the light (on/off)
- the location of the lamp

For example: 
"Alexa asks Devialet to turn on the light in the living room"

***Use for wallplugs***

To control the wallplugs, 3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- he action on the plug (on/off)
- the location of the outlet

For example: 
"Alexa asks Devialet to turn on the taking of the living room"
