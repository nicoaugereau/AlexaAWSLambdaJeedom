const jeedom = {
    port: 443,
    host: 'url-or-ip-to-jeedom',
    path: '/core/api/jeeApi.php',
    apikey: 'your-api-key',
};
const cmds = [
        {
            id: 1,
            type: 'light',
            description: 'lumière du salon',
            place: 'salon',
            intent: 'light',
            user: null,
            cmd: {
                'turnon': 10,
                'turnoff': 11,
                'status': 12,
            }
        },
        {
            id: 2,
            type: 'window',
            description: 'fenêtres du salon',
            place: 'salon',
            intent: 'window',
            user: null,
            cmd: {
                'open': 20,
                'close': 21,
                'status': 22,
            }
        },
        {
            id: 3,
            type: 'shutter',
            description: 'Volet salon',
            place: 'salon',
            intent: 'shutter',
            user: null,
            cmd: {
                'open': 31,
                'close': 32,
                'status': 33,
                'stop': 34,
                'set': 35,
            }
        },
        {
            id: 4,
            type: 'shutter',
            description: 'Volet salon',
            place: 'chambre 1',
            intent: 'shutter',
            user: null,
            cmd: {
                'open': 31,
                'close': 32,
                'status': 33,
                'stop': 34,
                'set': 35,
            }
        },
        {
            id: 4,
            type: 'shutter',
            description: 'Volet salon',
            place: 'chambre',
            intent: 'shutter',
            user: 'erik',
            cmd: {
                'open': 31,
                'close': 32,
                'status': 33,
                'stop': 34,
                'set': 35,
            }
        }
];
const scenarios = [
    {
        id: 5,
        type: '',
        description: 'scenario',
        cmd: {
            'start': 'start',
            'stop': 'stop',
            'active': 'activate',
            'deactive': 'deactivate',
        }
    }
];
const wallplugs = [
    {
        id: 4,
        type: 'walplug',
        description: 'Lampe',
        place: 'bureau',
        user: null,
        cmd: {
            'turnon': 41,
            'turnoff': 42,
        }
    },
    {
        id: 4,
        type: 'walplug',
        description: 'Lampe',
        place: 'chambre',
        user: 'erik',
        cmd: {
            'turnon': 41,
            'turnoff': 42,
        }
    }
];
const objects = [
    {
        id: 6,
        type: 'object',
        description: 'Recharger ma brosse à dents électrique',
        place: 'brosse à dents',
        user: 'charlotte',
        cmd: {
            'recharge': 51,
            'stop': 52,
        }
    },
    {
        id: 7,
        type: 'object',
        description: 'Recharger ma brosse à dents électrique',
        place: 'brosse à dents',
        user: 'erik',
        cmd: {
            'recharge': 51,
            'stop': 52,
        }
    }
];
const modes = [
    {
        id: 8,
        name: 'manuel',
        user: null,
        cmd: {
            'active': 344,
        }
    },
    {
        id: 9,
        name: 'jour',
        user: null,
        cmd: {
            'active': 346,
            'deactive': 344,
        }
    },
    {
        id: 10,
        name: 'nuit',
        user: null,
        cmd: {
            'active': 345,
            'deactive': 344,
        }
    }
];
module.exports = { jeedom, cmds, scenarios, wallplugs, objects, modes };