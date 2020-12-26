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
            name: `cinfo`,
            group: `misc`,
            memberName: `cinfo`,
            description: `Предоставляет данные о персонаже (игроку).`,
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [{
                key: 'text',
                prompt: 'Пожалуйста, введите имя персонажа у меня в личных сообщениях. Убедитесь, что вы инициировали команду в личных сообщениях.',
                type: `string`
            }]
        })
    }
    async run(commandoMsg, {
        text
    }) {
        if (commandoMsg.guild === null) { //check if the message wasn't sent on any server (was sent in DM)
            discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function(err, results, fields) { //check user's stage, so that users with unregistered accounts can't use the command
                
                if (results.length > 0) {
                    if (results[0].stage >= 3) {
                        worlddb.query(`SELECT * FROM characters WHERE name = "${text}"`, function(err, results, fields) {
                            var playerUsername, playerDiscord, playerGuid, playerMs, playerOnline, playerGender, playerRace, playerClass,
                                playerLevel, playerXp, playerMoney, playerKills, playerArenaCurrency, playerHonorCurrency,
                                playerX, playerY, playerZ, playerZone, playerGmLevel, playerCharacterTotalTime;
                            var playerLastLogin, playerLastIp, playerEmail, playerCharacterLastLogout;
                            var playerCharacterBannedBy, playerCharacterBanDate, playerCharacterUnbanDate, playerCharacterBanReason;
                            var playerCharscrolls = `N/A`

                            function getUserData() { //from DBs other than world db or assign to variables 
                                return new Promise(resolve => {
                                    setTimeout(() => resolve(`Timeout`), 500);
                                    //playerDiscord
                                    discorddb.query(`SELECT memberid FROM accounts WHERE accountid = ${results[0].account}`, function(err, results, fields) {
                                        if (results.length > 0) playerDiscord = results[0].memberid;
                                    })
                                    //playerOnline
                                    if (results[0].online == 0) {
                                        playerOnline = `Не в сети`
                                    } else {
                                        playerOnline = `Онлайн`
                                    }
                                    //playerGender
                                    if (results[0].gender == 0) {
                                        playerGender = `Мужчина`
                                    } else {
                                        playerGender = `Женщина`
                                    }
                                    //playerRace
                                    if (results[0].race == 1) {
                                        playerRace = `Человек`
                                    } else if (results[0].race == 2) {
                                        playerRace = `Орк`
                                    } else if (results[0].race == 3) {
                                        playerRace = `Дворф`
                                    } else if (results[0].race == 4) {
                                        playerRace = `Ночной эльф`
                                    } else if (results[0].race == 5) {
                                        playerRace = `Отрекшийся`
                                    } else if (results[0].race == 6) {
                                        playerRace = `Таурен`
                                    } else if (results[0].race == 7) {
                                        playerRace = `Гном`
                                    } else if (results[0].race == 8) {
                                        playerRace = `Тролль`
                                    } else if (results[0].race == 9) {
                                        playerRace = `Гоблин`
                                    } else if (results[0].race == 10) {
                                        playerRace = `Эльф`
                                    } else if (results[0].race == 11) {
                                        playerRace = `Дреней`
                                    } else if (results[0].race == 12) {
                                        playerRace = `Ночнорожденный`
                                    } else if (results[0].race == 13) {
                                        playerRace = `Человек`
                                    } else if (results[0].race == 14) {
                                        playerRace = `Ворген`
                                    } else if (results[0].race == 15) {
                                        playerRace = `Скелет`
                                    } else if (results[0].race == 16) {
                                        playerRace = `Пандарен`
                                    } else if (results[0].race == 17) {
                                        playerRace = `Эльф Бездны`
                                    } else if (results[0].race == 18) {
                                        playerRace = `Зандалар`
                                    } else if (results[0].race == 19) {
                                        playerRace = `Светозарный Дреней`
                                    } else if (results[0].race == 20) {
                                        playerRace = `Высший эльф`
                                    } else if (results[0].race == 21) {
                                        playerRace = `Ледяной Тролль`
                                    } else {
                                        playerRace = `Неизвестно`
                                    }
                                    //playerLevel
                                    playerLevel = results[0].level;
                                    //playerXp
                                    playerXp = results[0].xp;
                                    //playerClass
                                    if (results[0].class == 1) {
                                        playerClass = `Воин`
                                    } else if (results[0].class == 2) {
                                        playerClass = `Паладин`
                                    } else if (results[0].class == 3) {
                                        playerClass = `Охотник`
                                    } else if (results[0].class == 4) {
                                        playerClass = `Разбойник`
                                    } else if (results[0].class == 5) {
                                        playerClass = `Жрец`
                                    } else if (results[0].class == 6) {
                                        playerClass = `Рыцарь Смерти`
                                    } else if (results[0].class == 7) {
                                        playerClass = `Шаман`
                                    } else if (results[0].class == 8) {
                                        playerClass = `Маг`
                                    } else if (results[0].class == 9) {
                                        playerClass = `Чернокнижник`
                                    } else if (results[0].class == 11) {
                                        playerClass = `Друид`
                                    } else {
                                        playerClass = `Неизвестно`
                                    }
                                    //playerLastLogin
                                    authdb.query(`SELECT last_login FROM account WHERE id = ${results[0].account}`, function(err, results, fields) {
                                        if (results.length > 0) playerLastLogin = results[0].last_login;
                                    })
                                    //playerGmLevel
                                    authdb.query(`SELECT permissionId FROM rbac_account_permissions WHERE accountId = ${results[0].account}`, function(err, results, fields) {
                                        if (results.length > 0) {
                                            authdb.query(`SELECT secId FROM rbac_default_permissions WHERE permissionId = ${results[0].permissionId}`, function(err, results, fields) {
                                                playerGmLevel = results[0].secId
                                            })
                                        } else {
                                            playerGmLevel = `Нет`;
                                        }
                                    })
                                    return;
                                })
                            }
                            if (results.length > 0) { // check if there is a row containing such character name
                                getUserData().then(x => {
                                    const embed = {
                                        "title": `Discord-аккаунт: <@${playerDiscord}>`,
                                        "color": 15105570,
                                        "footer": {
                                            "text": `Актуально на момент получения сообщения`,
                                            "icon_url": "https://charscrolls.com/cot/img/logo.png"
                                        },
                                        "thumbnail": {
                                            "url": `https://charscrolls.com/cot/img/${results[0].race}_${results[0].gender}.png`
                                        },
                                        "author": {
                                            "name": `Информация о ${text} (GM-уровень: ${playerGmLevel})`
                                        },
                                        "fields": [{
                                            "name": "Соединение",
                                            "value": `Статус: ${playerOnline}`
                                        }, {
                                            "name": "Персонаж",
                                            "value": `Раса: ${playerGender} ${playerRace}\nКласс: ${playerClass}\n${playerLevel} уровень (${playerXp} xp)\nЧарлист на Charscrolls: ${playerCharscrolls}`,
                                            "inline": true
                                        }]
                                    };
                                    commandoMsg.author.send({
                                        embed
                                    })
                                })
                            } else {
                                return commandoMsg.author.send(`Персонаж не найден.`)
                            }
                        })
                        
                    } else {
                        return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                    }
                } else {
                    return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                }
            })
        } else {
            commandoMsg.author.send(`Эту команду нельзя использовать в общем чате. Пожалуйста, пришлите команду в личные сообщения со мной.`)
            return console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) tried to access sensitive information in a public chat.`)
        }
    }
}