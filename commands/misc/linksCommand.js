const commando = require('discord.js-commando');
const path = require(`path`);
const config = require(path.join(__dirname, `../..`, `config`, `config.json`));
const mysql = require(`mysql`);
const authdb = mysql.createConnection({
    host: config.authhost,
    user: config.authuser,
    password: config.authpassword,
    database: config.authdatabase
});
const worlddb = mysql.createConnection({
    host: config.worldhost,
    user: config.worlduser,
    password: config.worldpassword,
    database: config.worlddatabase
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
module.exports = class registerCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `links`,
            group: `misc`,
            memberName: `links`,
            description: `Предоставляет список полезных ссылок.`,
            throttling: {
                usages: 1,
                duration: 3
            }
        })
    }
    async run(commandoMsg,) {
        const embed = {
            "color": 15105570,
            "footer": {
              "icon_url": "https://charscrolls.com/cot/img/logo.png",
              "text": "Последний раз обновлено 21/12/2020"
            },
            "fields": [
              {
                "name": "Игра",
                "value": "[Правила сервера]()\n[Скачать игру](http://cavernsoftime.ru/patch/WoW_Caverns_of_Time%20(2).torrent)\n[FAQ (часто задаваемые вопросы и ответы на них)](https://discord.com/channels/689418791289094190/689419117257687103/786326813407576085)\n[О ролевой игре на сервере](https://discord.com/channels/689418791289094190/689419117257687103/789772489084895232)"
              },
              {
                "name": "Discord",
                "value": "[Правила Discord-сервера](https://discord.com/channels/689418791289094190/689419117257687103/786562339126247465)"
              },
              {
                "name": "Полезные ресурсы",
                "value": "[Charscrolls](https://ru.charscrolls.com/) - наш проект для публикации чарлистов, гильдий, логов и прочего.\n[RPWiki](https://rpwiki.ru/) - кладезь полезной информации по вселенной Warcraft."
              }
            ]
          };
          commandoMsg.reply({ embed });
    }
}