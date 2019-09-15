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
            description: '1 lumière du salon',
            place: 'salon_light',
            intent: 'light',
            cmd: {
                'allume': 86,
                'éteins': 87,
                'état': 85,
            }
        },
        {
            description: 'fenêtres du salon',
            place: 'salon_window',
            intent: 'window',
            cmd: {
                'ouvre': 86,
                'ferme': 87,
                'état': 85,
            }
        },
        {
            description: 'prises du salon',
            place: 'salon_wallPlug',
            intent: 'wallPlug',
            cmd: {
                'allume': 86,
                'éteins': 87,
                'état': 85,
            }
        },
        {
            description: 'Volet salon',
            place: 'salon_shutter',
            intent: 'shutter',
            cmd: {
                'ouvre': 127,
                'ferme': 126,
                'état': 124,
                'stoppe': 131,
                'mets': 125,
            }
        }
    ],
    scenarios: [
        {
            id: 5,
            name: '',
            type: '',
            category: 'scenario',
            description: 'scenario mode nuit',
            intent: '',
            scenario: {
                'exécute': 'start',
                'stoppe': 'stop',
                'active': 'activate',
                'désactive': 'deactivate',
            }
        }
    ]
};
