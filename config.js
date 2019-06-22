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
            place: 'salon_lightIntent',
            intent: 'lightIntent',
            cmd: {
                'allume': 86,
                'éteins': 87,
                'état': 85,
            }
        },
        {
            description: 'fenêtres du salon',
            place: 'salon_windowIntent',
            intent: 'windowIntent',
            cmd: {
                'ouvre': 86,
                'ferme': 87,
                'état': 85,
            }
        },
        {
            description: 'prises du salon',
            place: 'salon_wallPlugIntent',
            intent: 'wallPlugIntent',
            cmd: {
                'allume': 86,
                'éteins': 87,
                'état': 85,
            }
        },
        {
            place: 'salle de bain',
            intent: 'windowIntent',
            cmd: {
                'on': 266,
                'off': 267,
                'state': 268,
            }
        },
        {
            description: 'toutes les lumières',
            place: 'maison_wallPlugIntent',
            intent: 'wallPlugIntent',
            cmd: {
                'allume': 86,
                'éteins': 87,
                'état': 85,
            }
        }
    ]
};