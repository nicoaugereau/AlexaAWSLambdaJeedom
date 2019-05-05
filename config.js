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
            place: 'salon',
            cmd: {
                'Allume': 86,
                'Eteins': 87,
            }
        },
        {
            place: 'salle de bain',
            cmd: {
                'Allume': 266,
                'Eteins': 267,
            }
        }
    ]
};
