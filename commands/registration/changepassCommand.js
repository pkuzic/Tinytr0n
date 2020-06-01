const commando = require('discord.js-commando');

const path = require (`path`);
const config = require(path.join(__dirname, `../..` ,`config`, `config.json`));
const mysql = require(`mysql`);
const sha1 = require(`sha1`);

const authdb = mysql.createConnection({
    host: config.authhost,
    user: config.authuser,
    password: config.authpassword,
    database: config.authdatabase
});

const discorddb = mysql.createConnection({
    host: config.discordhost,
    user: config.discorduser,
    password: config.discordpassword,
    database: config.discorddatabase
});

discorddb.connect(function(err) {
    if (err) throw err;
})


module.exports = class changepassCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `changepass`,
            aliases: ['changepassword', 'pass', 'password', 'mypass'],
            group: `accmgmt`,
            memberName: `changepass`,
            description: `Позволяет пользователю сменить аккаунт в игре.`,
            guildOnly: false,
            throttling: {
                usages: 1,
                duration: 60
            },
            args: [
                {
                    key: 'text',
                    prompt: 'Теперь введите свой пароль у меня в **личных сообщениях** отдельным сообщением.',
                    type: 'string'
                }
            ]
        })
    }
    async run(commandoMsg, { text }) { 
        /*
        The bot should check if the message was sent in a guild or DM.

        Detect if the message was sent in a guild and automatically delete it
        */
    }
}