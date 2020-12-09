const commando = require('discord.js-commando');

const path = require (`path`);
const config = require(path.join(__dirname, `../..` ,`config`, `config.json`));
const mysql = require(`mysql`);
const sha1 = require(`sha1`);
const { Message } = require('discord.js');

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
                duration: 3
            },
            args: [
                {
                    key: 'text',
                    prompt: 'Пожалуйста, введите пароль у меня в личных сообщениях. Убедитесь, что вы инициировали команду в личных сообщениях.',
                    type: `string`
                }
            ]
        })
    }
    async run(commandoMsg, { text }) { 
        discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function (error, results, fields) {

            if (results[0].stage >= 3) {
                if (commandoMsg.guild === null)   { //check if the message wasn't sent on any server (was sent in DM)
                    var reg = /^[A-Za-z][A-Za-z0-9]+$/i;

                    if(reg.test(text) === false) {//For obvious reasons the SQL is permitting cyrillic and special symbols, but the game can't read them. We shouldn't allow that
                        var errorExplanation = `запрещенные символы`;
                        return commandoMsg.say(`Пароль не может быть сменен: ` + "``" + `${errorExplanation}` + "``")
                    }
                    else if (text.length < 3) {//Check if the argument is less than 3 symbols
                        var errorExplanation = `слишком короткий пароль`;
                        return commandoMsg.say(`Пароль не может быть сменен: ` + "``" + `${errorExplanation}` + "``")
                    }
                    else if (error) {//Check for SQL errors
                        var errorExplanation;

                        if (error.code === `ER_PARSE_ERROR`) {
                            errorExplanation = `запрещенные символы`;
                        }
                        else {
                            errorExplanation = `неизвестная ошибка, свяжитесь с администратором, цитируя следующий код: (${error.code})`;
                        } 
                        return commandoMsg.say(`Пароль не может быть сменен: ` + "``" + `${errorExplanation}` + "``")
                    } else {

                        discorddb.query(`SELECT accountid FROM accounts WHERE memberid = "${commandoMsg.author.id}"`, function (err, results, fields) { 
                            authdb.query(`SELECT username FROM account WHERE id = "${results[0].accountid}"`, function (err, results, fields) {
                            var username = results[0].username
                            var sha_password_hash = sha1(`${username.toUpperCase()}:${text.toUpperCase()}`)

                            authdb.query(`UPDATE account SET sha_pass_hash = "${sha_password_hash.toUpperCase()}" WHERE username = "${username}"`)
                            commandoMsg.say(`Отлично! Вот Ваш новый пароль: ` + "``" + `${text.toUpperCase()}` + "``")
                            return;
                            })
                        })
                    }
                }
                else {
                    commandoMsg.author.send(`Эту команду нельзя использовать на сервере, либо Вам запрещено её использовать вовсе.`)
                    return console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) tried to change their password in a public chat.`)
                }
            } else {
                commandoMsg.author.send(`Вы не можете пользоваться этой командой, поскольку не владеете игровым аккаунтом или не закончили регистрацию.`)
            }
        })

    }
}