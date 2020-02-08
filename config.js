'use strict';

module.exports = {
    jeedom: {
        port: 443,
        host: 'url-or-ip-to-jeedom',
        path: '/core/api/jeeApi.php',
        apikey: 'your-api-key',
    },
    cmds: [
        {
            id: 1,
            type: 'light',
            description: 'lumière du salon',
            place: 'salon_light',
            intent: 'light',
            cmd: {
                'allume': 10,
                'éteins': 11,
                'état': 12,
            }
        },
        {
            id: 2,
            type: 'window',
            description: 'fenêtres du salon',
            place: 'salon_window',
            intent: 'window',
            cmd: {
                'ouvre': 20,
                'ferme': 21,
                'état': 22,
            }
        },
        {
            id: 3,
            type: 'shutter',
            description: 'Volet salon',
            place: 'salon_shutter',
            intent: 'shutter',
            cmd: {
                'ouvre': 31,
                'ferme': 32,
                'état': 33,
                'stoppe': 34,
                'mets': 35,
            }
        }
    ],
    wallplug:[
        {
            id:4,
            type: 'walplug',
            description: 'Lampe',
            place: 'bureau',
            cmd:{
                'allume': 41,
                'éteins': 42,
            }
        }
    ],
    scenarios: [
        {
            id: 5,
            type: '',
            description: 'Scenario',
            intent: '',
            scenario: {
                'exécute': 'start',
                'stoppe': 'stop',
                'active': 'activate',
                'désactive': 'deactivate',
            }
        }
    ],
    objects:[
        {
            id:6,
            type: 'object',
            description: 'Recharger ma brosse à dents électrique',
            place: 'brosse à dents',
            cmd:{
                'charge': 51,
                'stoppe': 52,
            }
        }
    ],
    housemode:[
        {
            id:7,
            name: 'jour',
            cmd:{
                'active': 'activate',
                'désactive': 'deactivate',
            }
        },
        {
            id:8,
            name: 'nuit',
            cmd:{
                'active': 'activate',
                'désactive': 'deactivate',
            }
        }
};
