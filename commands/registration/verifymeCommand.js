const commando = require('discord.js-commando');

const path = require (`path`);
const config = require(path.join(__dirname, `../..` ,`config`, `config.json`));
const mysql = require(`mysql`);
//const sha1 = require(`sha1`);

/*const authdb = mysql.createConnection({
    host: config.authhost,
    user: config.authuser,
    password: config.authpassword,
    database: config.authdatabase
});*/

const discorddb = mysql.createConnection({
    host: config.discordhost,
    user: config.discorduser,
    password: config.discordpassword,
    database: config.discorddatabase
});

discorddb.connect(function(err) {
    if (err) throw err;
})

module.exports = class verifymeCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `verifyme`,
            group: `accmgmt`,
            memberName: `verifyme`,
            description: `Позволяет пользователю пройти верификацию.`,
            guildOnly: true
        })
    }
    async run(commandoMsg) {
        var finalresults;
       //console.log(`check 1` + finalresults + `\n`)
       //check if the message was sent in DMs
        function getStage() {
            return new Promise(resolve => {
                discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function (err, results, fields) {
                    //console.log(`check 2` + finalresults  + `\n`)
                    setTimeout(() => resolve(`Timeout`), 2000);
                    return finalresults = results[0].stage//,console.log(`check 3` + finalresults + `\n`)
                })
            })
        }

        getStage(1).then(x => {
            //console.log(`check 4` + finalresults  + `\n`)
            if (finalresults == `2`) { //See index.js guide section "stages"
            commandoMsg.member.send(`Поздравляем, вы успешно верифицировались!\nВойдя в игру, первым делом смените пароль, использовав команду \`.account password <старый пароль> <новый пароль>\``)
            discorddb.query(`UPDATE accounts SET stage = "3" WHERE memberid = "${commandoMsg.author.id}"`)

            this.client.guilds.cache.get(config.guildid).members.resolve(`${commandoMsg.author.id}`).roles.add(config.verifiedrole)
            this.client.guilds.cache.get(config.guildid).members.resolve(`${commandoMsg.author.id}`).roles.remove(config.newbierole)
            //send a message to #general that the new member just has joined
            } else {
                commandoMsg.author.send(`Вы не можете пройти верификацию!`)
            }
        }).catch(error => {
            console.log(error)
        });
    }
}
