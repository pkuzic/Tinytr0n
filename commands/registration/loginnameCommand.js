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

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

// This function is not necessary anymore, as I've found out that the database automatically sets the date for joindate upon new row creation
/*function getActualDate() {
    var d = new Date();
    return date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}*/ 

module.exports = class loginnameCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `loginname`,
            group: `accmgmt`,
            memberName: `loginname`,
            description: `Позволяет пользователю выбрать логин аккаунта для игры.`,
            args: [
                {
                    key: 'text',
                    prompt: 'Теперь введите свой логин отдельным сообщением.',
                    type: 'string'
                }
            ]
        })
    }
    async run(commandoMsg, { text }) { 
        discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function (err, results, fields) {

            if (results[0].stage >= 2) {
                commandoMsg.author.send(`Вы не можете пользоваться этой командой, поскольку Вы уже владеете игровым аккаунтом.`)
            } else {
                if (commandoMsg.guild === null)   { //check if the message wasn't sent on any server (was sent in DM)
                    var generatedPassword = generatePassword(); //put the generated password into a variable
                    var verificationKey = generatePassword(); //put the generated password into a variable

                    //convert that into the password, which is readable by TrinityCore
                    //note that it always has to be converted into upper case, otherwise it won't be readable
                    //furthermore, it always should look like "LOGIN:PASSWORD"
                    var sha_password_hash = sha1(`${text.toUpperCase()}:${generatedPassword.toUpperCase()}`)
                    

                    //puts the verification key into the database
                    discorddb.query(`UPDATE accounts SET verikey = "${verificationKey.toUpperCase()}" WHERE memberid = "${commandoMsg.author.id}"`)

                    //console.log(`${text.toUpperCase()}:${generatedPassword.toUpperCase()}`)
                    //console.log(sha_password_hash.toUpperCase())
                    //console.log(getActualDate())

                    authdb.query(`INSERT INTO account (username, sha_pass_hash, last_ip, last_attempt_ip, failed_logins, locked, lock_country, online, expansion, mutetime, locale, recruiter) VALUES ("${text.toUpperCase()}", "${sha_password_hash.toUpperCase()}", "127.0.0.1", "127.0.0.1", "0", "0", "00", "0", "2", "0", "0", "0")`, function (error, results, fields) {
                        var reg = /^[A-Za-z][A-Za-z0-9]+$/i;
                        //console.log(reg.test(text))
                        //console.log(text.length)
                        if(reg.test(text) === false) {//For obvious reasons the SQL is permitting cyrillic and special symbols, but the game can't read them. We shouldn't allow that
                            var errorExplanation = `запрещенные символы`;
                            return commandoMsg.say(`В процессе регистрации произошла ошибка: ` + "``" + `${errorExplanation}` + "``")
                        }
                        else if (text.length < 3) {//Check if the argument is less than 3 symbols
                            var errorExplanation = `слишком короткий логин`;
                            return commandoMsg.say(`В процессе регистрации произошла ошибка: ` + "``" + `${errorExplanation}` + "``")
                        }
                        else if (error) {//Check for SQL errors
                            var errorExplanation;
                            if (error.code === `ER_DUP_ENTRY`) {
                                errorExplanation = `такой пользователь уже существует`;
                            }
                            else if (error.code === `ER_PARSE_ERROR`) {
                                errorExplanation = `запрещенные символы`;
                            }
                            else {
                                errorExplanation = `неизвестная ошибка, свяжитесь с администратором, цитируя следующий код: (${error.code})`;
                            } 
                            return commandoMsg.say(`В процессе регистрации произошла ошибка: ` + "``" + `${errorExplanation}` + "``")
                        } else {
                            commandoMsg.say(`Отлично! Вот Ваши данные для входа на сервер игры —\nЛогин: ` + "``" + `${text.toUpperCase()}` + "``" +  `\nПароль: ` + "``" + `${generatedPassword.toUpperCase()}` + "``" +  `\nКод верификации: ` + "``" + `${verificationKey.toUpperCase()}` + "``, Вам нужно будет ввести его в игре при взаимодействии со стартовым квестгивером. Как только Вы это сделаете, напишите в чате #newbies ``" + config.botprefix + "verifyme``.")
                            discorddb.query(`UPDATE accounts SET stage = "2" WHERE memberid = "${commandoMsg.author.id}"`) //move to next stage (registered user)
                            
                            authdb.query(`SELECT id FROM account WHERE username = "${text.toUpperCase()}"`, function (err, results, fields) { //get the account id from the TrinityCore auth table, thus we can use it further
                                
                                var accountid = results[0].id; //gets the id of the first result (according to the SQL-request there's always just one result, so no additional "just to make sure" code required)
                                //console.log(accountid) //just to make sure that the id is right
                                discorddb.query(`UPDATE accounts SET accountid = "${accountid}" WHERE memberid = "${commandoMsg.author.id}"`)
                            })
                            //забирать роль нуба и давать роль регистрированного
                            //this.client.guilds.cache.get(`689418791289094190`).members.resolve(`${commandoMsg.author.id}`).roles.add(config.registeredrole)
                            //this.client.guilds.cache.get(`689418791289094190`).members.resolve(`${commandoMsg.author.id}`).roles.remove(config.newbierole)
                        }
                    })
                    
                    return;
                }
                else {
                    commandoMsg.author.send(`Эту команду нельзя использовать на сервере, либо Вам запрещено её использовать вовсе.`)
                    return console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) tried to set their login name, however couldn't use this command.`)
                }
            }
        })
    }
}