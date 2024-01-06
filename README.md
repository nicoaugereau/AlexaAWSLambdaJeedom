
![Version](https://img.shields.io/badge/Version-v1.3-brightgreen) ![MIT Licence](https://img.shields.io/badge/License-MIT-brightgreen)
![NodeJS version](https://img.shields.io/badge/NodeJS-v20.x-green.svg) 
<!--
![Dev status](https://img.shields.io/badge/status-development-orange.svg)
-->


# Alexa assistant for Jeedom

This repository allows you to control your Jeedom objects with Alexa. It works with Freebox Devialet, Echo, Dot, Alexa for iPhone or Android.

You can ask for : 
- object (light, door, wallplug, shutter, curtain, window)
- a scenario id
- home mode (with a virtual for example)

This skill is design for French and English languages. But it is possible to add many others.

You have an interaction model (French) example in the repository. You can import the content in the Alexa console, and can change the intent name.

**Prerequisites**
-------------
- Alexa developer account
- AWS developer account
- Freebox v7 (Delta with Devialet) or Alexa product (Echo, Dot)
- Raspberry and Jeedom installed with https


**Getting started**
-------------
- Open Alexa Developer Console and Create Skill
- Choose your name, don't change the option 1 and 2 
- Edit your skill and copy the file 'interaction-model.json' in JSON editor
- Adapt sentences for English or French.
- You can change or add utterrances, actions in action slot, places in place slot...
- Save
- Build the model
- Open AWS Developer console
- Choose Ireland (EU-West-1) to use Alexa Skill
- Create an empty lambda function
- Select Execution : Node.js 10.x
- Download the zip from this repository in the Amazon Developer Console
- Add the Alexa Skill kit trigger and set it up with the Alexa Skill ID (Endpoint in the left menu)
- Copy the AWS ID (ARN at the top rightof the page) and paste in the Alexa console
- Add your Jeedom configuration to 'config.js' file.

**Capabilities**
-------------
You can ask Alexa to invoke Jeedom API methods:
- Scenario: start, stop, active, deactive
- Command: turn on, turn off, open, close, slider (%)
- Objects : you can ask for objects actions (charging toothbrush, mow the lawn...)
- House mode : you can ask for your house mode (manual, day, night, guest, alarm...)


Objects supported:
- Lights
- Wallplugs
- Doors
- Windows
- Curtains
- Shutters


**Usage**
-------------
Invoke the skill (skill name : Devialet):
- "Alexa open Devialet" and "turn on the lights of the living room"
- or "Alexa ask devialet to turn on the lights of the living room"

Command examples:
- Tell Alexa "Alexa open Devialet" (Devialet is the skill invocation name) and tell "turn on the light of the kitchen"
- Or "Alexa ask Devialet to turn on the light of the kitchen"
- "Alexa ask Devialet to open the shutter of the kitchen"
- "Alexa ask Devialet to put the kitchen shutter at 40 %"


***Use for scenario***

To execute scenario, 2 elements are important to give to Alexa:
- the request to Freebox Devialet
- the action (start, stop, activate, deactive)
- number of the scenario

Example:
- "Alexa ask Devialet to start scenario 4"
- "Alexa ask Devialet to active scenario 2"

In the config.js you need to associate the id to the Jeedom scenario id.

***Use for roller shutters - curtains - windows***

To control the shutters, 3 or 4 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action on the roller shutter (open / close)
- the location of the roller shutter (in which room the shutter is located)
- and if applicable, the percentage for positioning the roller shutter

Examples: 
- To open the shutters, ask Alexa "Alexa ask Devialet to open the shutters of the living room".
- To position the roller shutter at a certain percentage, then ask "Alexa ask Devialet to set the shutter at 20%".

In the config.js you need to associate the object commands ids, and if you want for information the id to the Jeedom object Node ID.

***Use for lights***

To control the lights, 3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action on the light (on/off)
- the location of the lamp

Examples: 
- "Alexa ask Devialet to turn on the light in the living room"
- "Alexa ask Devialet to turn on the light in the Jack's room"

In the config.js you need to associate the object commands ids.

***Use for wallplugs***

To control the wallplugs, 3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action on the plug (on/off)
- the location of the outlet

Examples: 
- "Alexa ask Devialet to turn on the wall plug of the living room"
- "Alexa ask Devialet to turn on the wall plug in the Jack's room"

In the config.js you need to associate the object commands ids.

***Use for objects***

To control objects, 3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action (charge, mow, clean, wash)
- the object (toothbrush, lawn, house)

Examples: 
- "Alexa ask Devialet to mow the lawn"
- "Alexa ask Devialet to charge my toothbrush"
- "Alexa ask Devialet to charge Charlotte's toothbrush"
- "Alexa ask Devialet to stop charging my toothbrush"

In the config.js you need to associate the object commands ids, and associate Jeedom object to a room and wallplug.

***Use for housemode***

You need to install Virtual plugin.
Create virtual commands with what you want (manual, day, night, alarm, guest...) and create 1 or more scenario for all modes.

3 elements are important to give to Alexa: 
- the request to Freebox Devialet
- the action (activate, deactive (then return to manual mode))
- the name of the mode (manual, day, night, alarm, hollidays...)

Examples: 
- "Alexa ask Devialet to activate the night mode"

In the config.js you need to associate the Virtual commands ids.
