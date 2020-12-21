const commando = require('discord.js-commando');

const path = require (`path`);
const config = require(path.join(__dirname, `../..` ,`config`, `config.json`));
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
            name: `pinfo`,
            group: `mod`,
            memberName: `pinfo`,
            description: `Предоставляет данные о персонаже.`,
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [
                {
                    key: 'text',
                    prompt: 'Пожалуйста, введите имя персонажа у меня в личных сообщениях. Убедитесь, что вы инициировали команду в личных сообщениях.',
                    type: `string`
                }
            ]
        })
    }
    async run(commandoMsg, { text }) { 
        var rbac_permissionId = 517; //permission id for this command according to rbac_permissions table 
        var rbac_sensitivePermissionId = 48; //permission id for this sensitive pinfo data according to rbac_permissions table 
        var resolvedPermissionId;
        var resolvedAccess;

        if (commandoMsg.guild === null)   { //check if the message wasn't sent on any server (was sent in DM)
            discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function (err, results, fields) { //check user's stage, so that users with unregistered accounts can't use the command
                if (results[0].stage >= 3) {
                    function getUserPermissionId() {
                        return new Promise(resolve => {
                            discorddb.query(`SELECT accountid FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function (err, results, fields) {
                                authdb.query(`SELECT permissionId FROM rbac_account_permissions WHERE accountId = ${results[0].accountid}`, function (err, results, fields) { //!!Слать в пизду, если нет записи. if(!err) продолжаем, если нет то нет (У вас нет доступа к этой команде).
                                    if (results.length > 0) { // check if there is a row containing such account id
                                        resolvedPermissionId = results[0].permissionId; //save user's permission id from rbac_account_permissions so that we can compare it with required id later
                                        authdb.query(`SELECT id FROM rbac_linked_permissions WHERE linkedid = ${rbac_permissionId}`, function (err, results, fields) {
                                            if (resolvedPermissionId <= results[0].id) { //compare user's permission id with required id
                                                //Ok access

                                                //additional logic for sensitive data (email, ip, last login)
                                                authdb.query(`SELECT id FROM rbac_linked_permissions WHERE linkedid = ${rbac_sensitivePermissionId}`, function (err, results, fields) {
                                                    if (resolvedPermissionId <= results[0].id) { //compare user's permission id with required id
                                                        setTimeout(() => resolve(`Timeout`), 2000);
                                                        return resolvedAccess = 1;    
                                                    } else {
                                                        setTimeout(() => resolve(`Timeout`), 2000);
                                                        return resolvedAccess = 2;        
                                                    }
                                                })
                                            } else {
                                                //No access
    
                                                setTimeout(() => resolve(`Timeout`), 2000);
                                                return resolvedAccess = 0;
                                            }
                                        })
                                    } else {
                                        console.log(`(${commandoMsg.content}): ${commandoMsg.author.tag} (${commandoMsg.author.id}) tried to access sensitive information while not having an access to it.`)
                                        return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                                    }
                                })
                            })
                        })
                    }

                    getUserPermissionId().then(x => {
                        if (resolvedAccess == 0) {
                            commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                        } else {
                            worlddb.query(`SELECT * FROM characters WHERE name = "${text}"`, function (err, results, fields) {
                                var playerUsername, playerDiscord, playerGuid, playerMs, playerOnline, playerGender, playerRace, playerClass,
                                playerLevel, playerXp, playerMoney, playerKills, playerArenaCurrency, playerHonorCurrency,
                                playerX, playerY, playerZ, playerZone, playerGmLevel, playerCharacterTotalTime;
                                var playerLastLogin, playerLastIp, playerEmail, playerCharacterLastLogout;
                                var playerCharacterActiveBan;
                                var playerCharacterBannedBy, playerCharacterBanDate, playerCharacterUnbanDate, playerCharacterBanReason;


                                function getUserData() { //from DBs other than world db or assign to variables 
                                    return new Promise(resolve => {
                                        setTimeout(() => resolve(`Timeout`), 500);
                                        //playerUsername
                                        authdb.query(`SELECT username FROM account WHERE id = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) playerUsername = results[0].username;
                                        })    
                                        //playerDiscord
                                        discorddb.query(`SELECT memberid FROM accounts WHERE accountid = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) playerDiscord = results[0].memberid;
                                        })    
                                        //playerGuid
                                        playerGuid = results[0].guid;
                                        // playerMs
                                        playerMs = results[0].latency;
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
                                        //playerMoney
                                        var playerTotalMoney = results[0].money;
                                        var playerGold = playerTotalMoney/10000
                                        playerTotalMoney = playerTotalMoney%10000
                                        var playerSilver = playerTotalMoney/100;
                                        var playerCopper = playerTotalMoney%100;
                                        playerMoney = `${Math.round(playerGold)}з ${Math.round(playerSilver)}с ${Math.round(playerCopper)}м`
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
                                        //playerKills
                                        playerKills = results[0].totalKills;
                                        //playerArenaCurrency
                                        playerArenaCurrency = results[0].arenaPoints;
                                        //playerHonorCurrency
                                        playerHonorCurrency = results[0].totalHonorPoints;
                                        //playerX
                                        playerX = results[0].position_x;
                                        //playerY
                                        playerY = results[0].position_y;
                                        //playerZ
                                        playerZ = results[0].position_z;
                                        //playerZone
                                        playerZone = results[0].map;
                                        //playerLastLogin
                                        authdb.query(`SELECT last_login FROM account WHERE id = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) playerLastLogin = results[0].last_login;
                                        })    
                                        //playerLastIp
                                        authdb.query(`SELECT last_ip FROM account WHERE id = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) playerLastIp = results[0].last_ip;
                                        })    
                                        //playerEmail
                                        authdb.query(`SELECT email FROM account WHERE id = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) playerEmail = results[0].email; 
                                        })   
                                        //playerLastLogout
                                        var d = new Date(results[0].logout_time*1000).toLocaleDateString("en-GB")
                                        var t = new Date(results[0].logout_time*1000).toLocaleTimeString("en-GB")
                                        playerCharacterLastLogout = `${d} ${t}`;
                                        //playerCharacterActiveBan - check if the character is actually banned
                                        worlddb.query(`SELECT * FROM character_banned WHERE guid = "${playerGuid}"`, function (err, results, fields) {
                                            if(results.length > 0) {
                                                if (results[0].active == 1) {
                                                    playerCharacterActiveBan = 1;
                                                    playerCharacterBannedBy = results[0].bannedby;

                                                    var BDd = new Date(results[0].bandate*1000).toLocaleDateString("en-GB")
                                                    var BDt = new Date(results[0].bandate*1000).toLocaleTimeString("en-GB")
                                                    playerCharacterBanDate = `${BDd} ${BDt}`;
                                                
                                                    var UDd = new Date(results[0].unbandate*1000).toLocaleDateString("en-GB")
                                                    var UDt = new Date(results[0].unbandate*1000).toLocaleTimeString("en-GB")
                                                    playerCharacterUnbanDate = `${UDd} ${UDt}`; 

                                                    playerCharacterBanReason = results[0].banreason;
                                                }
                                            } else {
                                                playerCharacterActiveBan = 0;
                                            }
                                        })
                                        //playerGmLevel
                                        authdb.query(`SELECT permissionId FROM rbac_account_permissions WHERE accountId = ${results[0].account}`, function (err, results, fields) {
                                            if (results.length > 0) {
                                                authdb.query(`SELECT secId FROM rbac_default_permissions WHERE permissionId = ${results[0].permissionId}`, function (err, results, fields) {
                                                    playerGmLevel = results[0].secId
                                                })
                                            } else {
                                                playerGmLevel = `Нет`;
                                            }
                                        })  
                                        //playerCharacterTotalTime
                                        worlddb.query(`SELECT totaltime FROM characters WHERE guid = ${playerGuid}`, function (err, results, fields) {

                                            function secToTime(d) {
                                                d = Number(results[0].totaltime);
                                                var h = Math.floor(d / 3600);
                                                var m = Math.floor(d % 3600 / 60);
                                                var s = Math.floor(d % 3600 % 60);
                                            
                                                return `${h}ч ${m}мин ${s}сек`; 
                                            }
                                            
                                            playerCharacterTotalTime = `${secToTime()}`
                                        })  
                                        return;    
                                    })
                                }
            

                                    if (results.length > 0) { // check if there is a row containing such character name
                                        getUserData().then(x => {
                                            const embed = {
                                                "title": `Игрок: ${playerUsername} (GM-уровень: ${playerGmLevel}), Discord-аккаунт: <@${playerDiscord}>`,
                                                "color": 15105570,
                                                "footer": {
                                                "text": `Актуально на момент получения сообщения`
                                                },
                                                "thumbnail": {
                                                "url": `https://charscrolls.com/cot/img/${results[0].race}_${results[0].gender}.png`
                                                },
                                                "author": {
                                                "name": `Информация о ${text} (guid: ${playerGuid})`
                                                },
                                                "fields": [
                                                {
                                                    "name": "Соединение",
                                                    "value": `Задержка: ${playerMs}ms\nСтатус: ${playerOnline}\nНаиграно: ${playerCharacterTotalTime}`
                                                },
                                                {
                                                    "name": "Персонаж",
                                                    "value": `Раса: ${playerGender} ${playerRace}\nКласс: ${playerClass}\n${playerLevel} уровень\nОпыт: ${playerXp} xp\nДеньги: ${playerMoney}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "PvP",
                                                    "value": `Убийства: ${playerKills}\nОчков арены: ${playerArenaCurrency}\nОчков чести: ${playerHonorCurrency}`,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Позиция",
                                                    "value": `X: ${playerX}\nY: ${playerY}\nZ: ${playerZ}\nЗона: ${playerZone}`,
                                                    "inline": true
                                                }
                                                ]
                                            };
                                            commandoMsg.author.send({ embed })

                                            if (resolvedAccess == 1) {

                                                const embed = {
                                                    "color": 15105570,
                                                    "footer": {
                                                    "text": `Актуально на момент получения сообщения`
                                                    },
                                                    "thumbnail": {
                                                        "url": `https://charscrolls.com/cot/img/${results[0].race}_${results[0].gender}.png`
                                                    },
                                                    "author": {
                                                    "name": `Информация о ${text} (guid: ${playerGuid})`
                                                    },
                                                    "fields": [
                                                    {
                                                        "name": "Дополнительная информация:",
                                                        "value": `Последняя дата захода на аккаунт: ${playerLastLogin}\nПоследняя дата выхода с персонажа: ${playerCharacterLastLogout}\nПоследний IP : ${playerLastIp}\nЭлектронная почта: ${playerEmail}`
                                                    }
                                                    ]
                                                };
                                                
                                                commandoMsg.author.send({ embed });
                                            }
                                            if (playerCharacterActiveBan == 1) {
                                                const embed = {
                                                    "color": 15158332,
                                                    "description": `Заблокирован ${playerCharacterBannedBy}`,
                                                    "footer": {
                                                      "text": "Актуально на момент получения сообщения"
                                                    },
                                                    "thumbnail": {
                                                        "url": `https://charscrolls.com/cot/img/${results[0].race}_${results[0].gender}.png`
                                                    },
                                                    "author": {
                                                      "name": `Активный бан для ${text} (guid: ${playerGuid})`
                                                    },
                                                    "fields": [
                                                      {
                                                        "name": "Дата бана",
                                                        "value": `${playerCharacterBanDate}`,
                                                        "inline": true
                                                      },
                                                      {
                                                        "name": "Дата разбана",
                                                        "value": `${playerCharacterUnbanDate}`,
                                                        "inline": true
                                                      },
                                                      {
                                                        "name": "Причина бана",
                                                        "value": `${playerCharacterBanReason}`
                                                      }
                                                    ]
                                                  };
                                                  commandoMsg.author.send({ embed });
                                                  
                                            }
                                        })

                                    }
                                     else {
                                        return commandoMsg.author.send(`Персонаж не найден.`)
                                    }
                            })    
                        }
                    }).catch(error => {
                        console.log(error)
                    });
                }
                else {
                    return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                }
            })
        } else { 
            commandoMsg.author.send(`Эту команду нельзя использовать в общем чате. Пожалуйста, пришлите команду в личные сообщения со мной.`)
            return console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) tried to access sensitive information in a public chat.`)
        }
    }
}