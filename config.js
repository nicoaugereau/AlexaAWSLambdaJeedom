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
            type: 'wallplug',
            description: 'prises du salon',
            place: 'salon_wallPlug',
            intent: 'wallPlug',
            cmd: {
                'allume': 30,
                'éteins': 31,
                'état': 32,
            }
        },
        {
            id: 4,
            type: 'shutter',
            description: 'Volet salon',
            place: 'salon_shutter',
            intent: 'shutter',
            cmd: {
                'ouvre': 41,
                'ferme': 42,
                'état': 43,
                'stoppe': 44,
                'mets': 45,
            }
        }
    ],
    scenarios: [
        {
            id: 5,
            type: '',
            description: 'scenario mode nuit',
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
            id:15,
            type: 'object',
            description: 'Recharger ma brosse à dents électrique',
            place: 'brosse à dents',
            cmd:{
                'charge': 276,
                'stoppe': 277,
            }
        }
    ]
};
