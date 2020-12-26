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
            name: `stats`,
            group: `misc`,
            memberName: `stats`,
            description: `Предоставляет статистику сервера.`,
            throttling: {
                usages: 1,
                duration: 3
            }
        })
    }
    async run(commandoMsg) {
        discorddb.query(`SELECT stage FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function(err, results, fields) { //check user's stage, so that users with unregistered accounts can't use the command
            if (commandoMsg.guild === null) { //check if the message wasn't sent on any server (was sent in DM)
                if (results.length > 0) {
                    if (results[0].stage >= 3) {
        
                        //RBAC system variables
                        var rbac_permissionId = 194; // same as lookup
                        var resolvedPermissionId;
                        var resolvedAccess;

                        //Command-related variables
                        var totalCharacters, totalMale, totalFemale, playersTotalTime, playerTotalKills, playerTotalWealth;

                        var totalHuman, dominantHumanGender, dominantHumanClass; // 1
                        var totalOrc, dominantOrcGender, dominantOrcClass; // 2
                        var totalDwarf, dominantDwarfGender, dominantDwarfClass; // 3
                        var totalNightelf, dominantNightelfGender, dominantNightelfClass; // 4
                        var totalUndead, dominantUndeadGender, dominantUndeadClass; // 5
                        var totalTauren, dominantTaurenGender, dominantTaurenClass; // 6
                        var totalGnome, dominantGnomeGender, dominantGnomeClass; // 7
                        var totalTroll, dominantTrollGender, dominantTrollClass; // 8
                        var totalGoblin, dominantGoblinGender, dominantGoblinClass; // 9
                        var totalElf, dominantElfGender, dominantElfClass; // 10
                        var totalDraenei, dominantDraeneiGender, dominantDraeneiClass; // 11
                        var totalNightborn, dominantNightbornGender, dominantNightbornClass; // 12
                        var totalKulTirasHuman, dominantKulTirasHumanGender, dominantKulTirasHumanClass; // 13
                        var totalWorgen, dominantWorgenGender, dominantWorgenClass; // 14
                        var totalSkeleton, dominantSkeletonGender, dominantSkeletonClass; // 15
                        var totalPandaren, dominantPandarenGender, dominantPandarenClass; // 16
                        var totalVoidElf, dominantVoidElfGender, dominantVoidElfClass; // 17
                        var totalZandalar, dominantZandalarGender, dominantZandalarClass; // 18
                        var totalLightDraenei, dominantLightDraeneiGender, dominantLightDraeneiClass; // 19
                        var totalHighElf, dominantHighElfGender, dominantHighElfClass; // 20
                        var totalIceTroll, dominantIceTrollGender, dominantIceTrollClass; // 21

                        var totalWarrior, totalPaladin, totalHunter, totalRogue, totalPriest, totalDK, totalShaman, totalMage, totalWarlock, totalDruid;
                        var modeGenderWarrior, modeGenderPaladin, modeGenderHunter, modeGenderRogue, modeGenderPriest, modeGenderDK, modeGenderShaman, modeGenderMage, modeGenderWarlock, modeGenderDruid;
                        var modeRaceWarrior, modeRacePaladin, modeRaceHunter, modeRaceRogue,modeRacePriest, modeRaceDK, modeRaceShaman, modeRaceMage, modeRaceWarlock, modeRaceDruid;

                        var killsTop1, killsTop2, killsTop3, killsTop4, killsTop5;
                        var killsTop1Total, killsTop2Total, killsTop3Total, killsTop4Total, killsTop5Total;

                        var wealthTop1, wealthTop2, wealthTop3, wealthTop4, wealthTop5;
                        var wealthTop1Total, wealthTop2Total, wealthTop3Total, wealthTop4Total, wealthTop5Total;

                        var timeTop1, timeTop2, timeTop3, timeTop4, timeTop5;
                        var timeTop1Total, timeTop2Total, timeTop3Total, timeTop4Total, timeTop5Total;

                        //end of variables

                        function getUserPermissionId() {
                            return new Promise(resolve => {
                                discorddb.query(`SELECT accountid FROM accounts WHERE memberid = ${commandoMsg.author.id}`, function(err, results, fields) {
                                    authdb.query(`SELECT permissionId FROM rbac_account_permissions WHERE accountId = ${results[0].accountid}`, function(err, results, fields) { //!!Слать в пизду, если нет записи. if(!err) продолжаем, если нет то нет (У вас нет доступа к этой команде).
                                        if (results.length > 0) { // check if there is a row containing such account id
                                            resolvedPermissionId = results[0].permissionId; //save user's permission id from rbac_account_permissions so that we can compare it with required id later
                                            authdb.query(`SELECT id FROM rbac_linked_permissions WHERE linkedid = ${rbac_permissionId}`, function(err, results, fields) {
                                                if (resolvedPermissionId <= results[0].id) { //compare user's permission id with required id
                                                    //Ok access
                                                    setTimeout(() => resolve(`Timeout`), 500);
                                                    return resolvedAccess = 1;
                                                } else {
                                                    //No access
                                                    setTimeout(() => resolve(`Timeout`), 500);
                                                    return resolvedAccess = 0;
                                                }
                                            })
                                        } else {
                                            return;
                                        }
                                    })
                                })
                            })
                        }

                        function resolveStats() {
                            return new Promise(resolve => {
                                //totalCharacters
                                worlddb.query(`SELECT count(*) AS totalCharacters FROM characters`, function(err, results, fields) { 
                                    totalCharacters = results[0].totalCharacters;
                                })
                                //totalMale & totalFemale
                                worlddb.query(`SELECT COUNT(*) AS totalMale FROM characters WHERE gender = 0`, function(err, results, fields) { 
                                    totalMale = results[0].totalMale;
                                    totalFemale = totalCharacters - totalMale; //count female here
                                })

                                //Human
                                worlddb.query(`SELECT COUNT(*) as totalHuman FROM characters WHERE race = 1`, function(err, results, fields) { 
                                    totalHuman = results[0].totalHuman;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 1
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantHumanGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantHumanGender = `♀️`
                                        } else {
                                            dominantHumanGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 1
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantHumanClass = resolveClassName.className;
                                    })

                                })

                                //Orc
                                worlddb.query(`SELECT COUNT(*) as totalOrc FROM characters WHERE race = 2`, function(err, results, fields) { 
                                    totalOrc = results[0].totalOrc;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 2
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantOrcGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantOrcGender = `♀️`
                                        } else {
                                            dominantOrcGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 2
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantOrcClass = resolveClassName.className;
                                    })

                                })

                                //dwarf
                                worlddb.query(`SELECT COUNT(*) as totalDwarf FROM characters WHERE race = 3`, function(err, results, fields) { 
                                    totalDwarf = results[0].totalDwarf;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 3
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantDwarfGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantDwarfGender = `♀️`
                                        } else {
                                            dominantDwarfGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 3
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantDwarfClass = resolveClassName.className;
                                    })
                                })

                                //night elf
                                worlddb.query(`SELECT COUNT(*) as totalNightelf FROM characters WHERE race = 4`, function(err, results, fields) { 
                                    totalNightelf = results[0].totalNightelf;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 4
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantNightelfGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantNightelfGender = `♀️`
                                        } else {
                                            dominantNightelfGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 4
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantNightelfClass = resolveClassName.className;
                                    })
                                })

                                //undead
                                worlddb.query(`SELECT COUNT(*) as totalUndead FROM characters WHERE race = 5`, function(err, results, fields) { 
                                    totalUndead = results[0].totalUndead;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 5
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantUndeadGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantUndeadGender = `♀️`
                                        } else {
                                            dominantUndeadGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 5
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantUndeadClass = resolveClassName.className;
                                    })
                                })

                                //tauren
                                worlddb.query(`SELECT COUNT(*) as totalTauren FROM characters WHERE race = 6`, function(err, results, fields) { 
                                    totalTauren = results[0].totalTauren;

                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 6
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantTaurenGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantTaurenGender = `♀️`
                                        } else {
                                            dominantTaurenGender = `❓`
                                        }
                                    })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 6
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantTaurenClass = resolveClassName.className;
                                    })
                                })
                                
                               //Gnome
                               worlddb.query(`SELECT COUNT(*) as totalGnome FROM characters WHERE race = 7`, function(err, results, fields) { 
                                totalGnome = results[0].totalGnome;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 7
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantGnomeGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantGnomeGender = `♀️`
                                    } else {
                                        dominantGnomeGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 7
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantGnomeClass = resolveClassName.className;
                                    })
                                })

                               //Troll
                               worlddb.query(`SELECT COUNT(*) as totalTroll FROM characters WHERE race = 8`, function(err, results, fields) { 
                                totalTroll = results[0].totalTroll;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 8
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantTrollGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantTrollGender = `♀️`
                                    } else {
                                        dominantTrollGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 8
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantTrollClass = resolveClassName.className;
                                    })
                                })

                               //Goblin
                               worlddb.query(`SELECT COUNT(*) as totalGoblin FROM characters WHERE race = 9`, function(err, results, fields) { 
                                totalGoblin = results[0].totalGoblin;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 9
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantGoblinGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantGoblinGender = `♀️`
                                    } else {
                                        dominantGoblinGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 9
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantGoblinClass = resolveClassName.className;
                                    })
                                })

                               //Elf
                               worlddb.query(`SELECT COUNT(*) as totalElf FROM characters WHERE race = 10`, function(err, results, fields) { 
                                totalElf = results[0].totalElf;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 10
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantElfGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantElfGender = `♀️`
                                    } else {
                                        dominantElfGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 10
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantElfClass = resolveClassName.className;
                                    })
                                })

                               //Draenei
                               worlddb.query(`SELECT COUNT(*) as totalDraenei FROM characters WHERE race = 11`, function(err, results, fields) { 
                                totalDraenei = results[0].totalDraenei;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 11
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantDraeneiGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantDraeneiGender = `♀️`
                                    } else {
                                        dominantDraeneiGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 11
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantDraeneiClass = resolveClassName.className;
                                    })
                                })

                               //Nightborn
                               worlddb.query(`SELECT COUNT(*) as totalNightborn FROM characters WHERE race = 12`, function(err, results, fields) { 
                                totalNightborn = results[0].totalNightborn;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 12
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantNightbornGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantNightbornGender = `♀️`
                                    } else {
                                        dominantNightbornGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 12
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantNightbornClass = resolveClassName.className;
                                    })
                                })

                                //Kul tiras human
                               worlddb.query(`SELECT COUNT(*) as totalKulTirasHuman FROM characters WHERE race = 13`, function(err, results, fields) { 
                                totalKulTirasHuman = results[0].totalKulTirasHuman;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE race = 13
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        dominantKulTirasHumanGender = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        dominantKulTirasHumanGender = `♀️`
                                    } else {
                                        dominantKulTirasHumanGender = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(class) as median_val
                                    FROM (
                                    SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 13
                                    ORDER BY class
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveClassName(results[0].median_val | 0)
                                        dominantKulTirasHumanClass = resolveClassName.className;
                                    })
                                })
                                
                                //Worgen
                                worlddb.query(`SELECT COUNT(*) as totalWorgen FROM characters WHERE race = 14`, function(err, results, fields) { 
                                    totalWorgen = results[0].totalWorgen;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 14
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantWorgenGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantWorgenGender = `♀️`
                                        } else {
                                            dominantWorgenGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 14
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantWorgenClass = resolveClassName.className;
                                        })
                                    })
    
                                //Skeleton
                                worlddb.query(`SELECT COUNT(*) as totalSkeleton FROM characters WHERE race = 15`, function(err, results, fields) { 
                                    totalSkeleton = results[0].totalSkeleton;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 15
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantSkeletonGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantSkeletonGender = `♀️`
                                        } else {
                                            dominantSkeletonGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 15
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantSkeletonClass = resolveClassName.className;
                                        })
                                    })

                                //Pandaren
                                worlddb.query(`SELECT COUNT(*) as totalPandaren FROM characters WHERE race = 16`, function(err, results, fields) { 
                                    totalPandaren = results[0].totalPandaren;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 16
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantPandarenGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantPandarenGender = `♀️`
                                        } else {
                                            dominantPandarenGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 16
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantPandarenClass = resolveClassName.className;
                                        })
                                    })

                                //Void Elf
                                worlddb.query(`SELECT COUNT(*) as totalVoidElf FROM characters WHERE race = 17`, function(err, results, fields) { 
                                    totalVoidElf = results[0].totalVoidElf;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 17
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantVoidElfGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantVoidElfGender = `♀️`
                                        } else {
                                            dominantVoidElfGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 17
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantVoidElfClass = resolveClassName.className;
                                        })
                                    })

                                //Zandalar
                                worlddb.query(`SELECT COUNT(*) as totalZandalar FROM characters WHERE race = 18`, function(err, results, fields) { 
                                    totalZandalar = results[0].totalZandalar;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 18
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantZandalarGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantZandalarGender = `♀️`
                                        } else {
                                            dominantZandalarGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 18
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantZandalarClass = resolveClassName.className;
                                        })
                                    })

                                //Light Draenei
                                worlddb.query(`SELECT COUNT(*) as totalLightDraenei FROM characters WHERE race = 19`, function(err, results, fields) { 
                                    totalLightDraenei = results[0].totalLightDraenei;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 19
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantLightDraeneiGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantLightDraeneiGender = `♀️`
                                        } else {
                                            dominantLightDraeneiGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 19
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantLightDraeneiClass = resolveClassName.className;
                                        })
                                    })

                                //High Elf
                                worlddb.query(`SELECT COUNT(*) as totalHighElf FROM characters WHERE race = 20`, function(err, results, fields) { 
                                    totalHighElf = results[0].totalHighElf;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 20
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantHighElfGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantHighElfGender = `♀️`
                                        } else {
                                            dominantHighElfGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 20
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantHighElfClass = resolveClassName.className;
                                        })
                                    })

                                //Ice Troll
                                worlddb.query(`SELECT COUNT(*) as totalIceTroll FROM characters WHERE race = 21`, function(err, results, fields) { 
                                    totalIceTroll = results[0].totalIceTroll;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE race = 21
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            dominantIceTrollGender = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            dominantIceTrollGender = `♀️`
                                        } else {
                                            dominantIceTrollGender = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(class) as median_val
                                        FROM (
                                        SELECT class, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE race = 21
                                        ORDER BY class
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveClassName(results[0].median_val | 0)
                                            dominantIceTrollClass = resolveClassName.className;
                                        })
                                    })

                                //Warrior
                                worlddb.query(`SELECT COUNT(*) as totalWarrior FROM characters WHERE class = 1`, function(err, results, fields) { 
                                    totalWarrior = results[0].totalWarrior;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 1
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderWarrior = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderWarrior = `♀️`
                                        } else {
                                            modeGenderWarrior = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 1
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRaceWarrior = resolveRaceName.raceName;
                                        })
                                    })

                                //Paladin
                                worlddb.query(`SELECT COUNT(*) as totalPaladin FROM characters WHERE class = 2`, function(err, results, fields) { 
                                    totalPaladin = results[0].totalPaladin;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 2
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderPaladin = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderPaladin = `♀️`
                                        } else {
                                            modeGenderPaladin = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 2
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRacePaladin = resolveRaceName.raceName;
                                        })
                                    })

                                //Hunter
                                worlddb.query(`SELECT COUNT(*) as totalHunter FROM characters WHERE class = 3`, function(err, results, fields) { 
                                    totalHunter = results[0].totalHunter;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 3
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderHunter = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderHunter = `♀️`
                                        } else {
                                            modeGenderHunter = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 3
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRaceHunter = resolveRaceName.raceName;
                                        })
                                    })
                                //Rogue
                                worlddb.query(`SELECT COUNT(*) as totalRogue FROM characters WHERE class = 4`, function(err, results, fields) { 
                                    totalRogue = results[0].totalRogue;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 4
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderRogue = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderRogue = `♀️`
                                        } else {
                                            modeGenderRogue = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 4
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRaceRogue = resolveRaceName.raceName;
                                        })
                                    })
                                //Priest
                                worlddb.query(`SELECT COUNT(*) as totalPriest FROM characters WHERE class = 5`, function(err, results, fields) { 
                                    totalPriest = results[0].totalPriest;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 5
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderPriest = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderPriest = `♀️`
                                        } else {
                                            modeGenderPriest = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 5
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRacePriest = resolveRaceName.raceName;
                                        })
                                    })
                                //DK
                                worlddb.query(`SELECT COUNT(*) as totalDK FROM characters WHERE class = 6`, function(err, results, fields) { 
                                    totalDK = results[0].totalDK;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 6
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderDK = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderDK = `♀️`
                                        } else {
                                            modeGenderDK = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 6
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRaceDK = resolveRaceName.raceName;
                                        })
                                    })
                                //Shaman
                                worlddb.query(`SELECT COUNT(*) as totalShaman FROM characters WHERE class = 7`, function(err, results, fields) { 
                                    totalShaman = results[0].totalShaman;
    
                                    worlddb.query(`SELECT AVG(gender) as median_val
                                    FROM (
                                    SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 7
                                    ORDER BY gender
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        if(results[0].median_val == 0) {
                                            modeGenderShaman = `♂️`
                                        } else if (results[0].median_val == 1)  {
                                            modeGenderShaman = `♀️`
                                        } else {
                                            modeGenderShaman = `❓`
                                        }
                                    })
    
                                        worlddb.query(`SELECT AVG(race) as median_val
                                        FROM (
                                        SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                        FROM characters, (SELECT @rownum:=0) r
                                        WHERE class = 7
                                        ORDER BY race
                                        ) as dd
                                        WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                            resolveRaceName(results[0].median_val | 0)
                                            modeRaceShaman = resolveRaceName.raceName;
                                        })
                                    })
                               //Mage
                               worlddb.query(`SELECT COUNT(*) as totalMage FROM characters WHERE class = 8`, function(err, results, fields) { 
                                totalMage = results[0].totalMage;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE class = 8
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        modeGenderMage = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        modeGenderMage = `♀️`
                                    } else {
                                        modeGenderMage = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(race) as median_val
                                    FROM (
                                    SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 8
                                    ORDER BY race
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveRaceName(results[0].median_val | 0)
                                        modeRaceMage = resolveRaceName.raceName;
                                    })
                                })
                              //Warlock
                              worlddb.query(`SELECT COUNT(*) as totalWarlock FROM characters WHERE class = 9`, function(err, results, fields) { 
                                totalWarlock = results[0].totalWarlock;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE class = 9
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        modeGenderWarlock = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        modeGenderWarlock = `♀️`
                                    } else {
                                        modeGenderWarlock = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(race) as median_val
                                    FROM (
                                    SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 9
                                    ORDER BY race
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveRaceName(results[0].median_val | 0)
                                        modeRaceWarlock = resolveRaceName.raceName;
                                    })
                                })
                              //Druid
                              worlddb.query(`SELECT COUNT(*) as totalDruid FROM characters WHERE class = 11`, function(err, results, fields) { 
                                totalDruid = results[0].totalDruid;

                                worlddb.query(`SELECT AVG(gender) as median_val
                                FROM (
                                SELECT gender, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                FROM characters, (SELECT @rownum:=0) r
                                WHERE class = 11
                                ORDER BY gender
                                ) as dd
                                WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                    if(results[0].median_val == 0) {
                                        modeGenderDruid = `♂️`
                                    } else if (results[0].median_val == 1)  {
                                        modeGenderDruid = `♀️`
                                    } else {
                                        modeGenderDruid = `❓`
                                    }
                                })

                                    worlddb.query(`SELECT AVG(race) as median_val
                                    FROM (
                                    SELECT race, @rownum:=@rownum+1 as 'row_number', @total_rows:=@rownum
                                    FROM characters, (SELECT @rownum:=0) r
                                    WHERE class = 11
                                    ORDER BY race
                                    ) as dd
                                    WHERE dd.row_number IN ( FLOOR((@total_rows+1)/2), FLOOR((@total_rows+2)/2) );`, function(err, results, fields) { 
                                        resolveRaceName(results[0].median_val | 0)
                                        modeRaceDruid = resolveRaceName.raceName;
                                    })
                                })
                                //total time
                                worlddb.query(`SELECT SUM(totaltime) as totalTime FROM characters`, function(err, results, fields) { 
                                    function secToTime(d) {
                                        d = Number(results[0].totalTime);
                                        var h = Math.floor(d / 3600);
                                        var m = Math.floor(d % 3600 / 60);
                                        var s = Math.floor(d % 3600 % 60);
                                        return `${h}ч ${m}мин ${s}сек`;
                                    }
                                    playersTotalTime = `${secToTime()}`

                                })

                                //total kills
                                worlddb.query(`SELECT SUM(totalKills) as totalKills FROM characters`, function(err, results, fields) { 

                                    playerTotalKills = `${results[0].totalKills}`

                                })

                                //total wealtj
                                worlddb.query(`SELECT SUM(money) as totalWealth FROM characters`, function(err, results, fields) { 
                                    var playerTotalMoney = results[0].totalWealth;
                                    var playerGold = playerTotalMoney / 10000
                                    playerTotalMoney = playerTotalMoney % 10000
                                    var playerSilver = playerTotalMoney / 100;
                                    var playerCopper = playerTotalMoney % 100;
                                    playerTotalWealth = `${Math.round(playerGold)}з ${Math.round(playerSilver)}с ${Math.round(playerCopper)}м`



                                })

                                //top5 kills
                                worlddb.query(`SELECT name, totalKills FROM characters ORDER BY totalKills DESC`, function(err, results, fields) { 
                                    killsTop1 = results[0].name
                                    killsTop1Total = results[0].totalKills

                                    killsTop2 = results[1].name
                                    killsTop2Total = results[1].totalKills

                                    killsTop3 = results[2].name
                                    killsTop3Total = results[2].totalKills
                                   
                                    killsTop4 = results[3].name
                                    killsTop4Total = results[3].totalKills
                                   
                                    killsTop5 = results[4].name
                                    killsTop5Total = results[4].totalKills


                                })

                                //top5 wealth
                                worlddb.query(`SELECT name, money FROM characters ORDER BY money DESC`, function(err, results, fields) { 
                                    //1
                                    wealthTop1 = results[0].name

                                    convertWealth(results[0].money)
                                    wealthTop1Total = convertWealth.converted;

                                    //2
                                    wealthTop2 = results[1].name

                                    convertWealth(results[1].money)
                                    wealthTop2Total = convertWealth.converted;

                                    //3
                                    wealthTop3 = results[2].name

                                    convertWealth(results[2].money)
                                    wealthTop3Total = convertWealth.converted;
                                   
                                    //4
                                    wealthTop4 = results[3].name

                                    convertWealth(results[3].money)
                                    wealthTop4Total = convertWealth.converted;
                                   
                                    //5
                                    wealthTop5 = results[4].name

                                    convertWealth(results[4].money)
                                    wealthTop5Total = convertWealth.converted;
                                })

                                //top5 time
                                worlddb.query(`SELECT name, totaltime FROM characters ORDER BY totaltime DESC`, function(err, results, fields) { 
                                    //1
                                    timeTop1 = results[0].name

                                    convertTime(results[0].totaltime)
                                    timeTop1Total = convertTime.converted;

                                    //2
                                    timeTop2 = results[1].name

                                    convertTime(results[1].totaltime)
                                    timeTop2Total = convertTime.converted;

                                    //3
                                    timeTop3 = results[2].name

                                    convertTime(results[2].totaltime)
                                    timeTop3Total = convertTime.converted;
                                   
                                    //4
                                    timeTop4 = results[3].name

                                    convertTime(results[3].totaltime)
                                    timeTop4Total = convertTime.converted;
                                   
                                    //5
                                    timeTop5 = results[4].name

                                    convertTime(results[4].totaltime)
                                    timeTop5Total = convertTime.converted;
                                })

                                setTimeout(() => resolve(`Timeout`), 2000);
                                return;
                            })

                            
                            
                        }

                        function resolveClassName(x) {
                            return new Promise(resolve => {
                                setTimeout(() => resolve(`Timeout`), 200);

                                if (x == 1) {
                                    return resolveClassName.className = `Воин`
                                } else if (x == 2) {
                                    return resolveClassName.className = `Паладин`
                                } else if (x == 3) {
                                    return resolveClassName.className = `Охотник`
                                } else if (x == 4) {
                                    return resolveClassName.className = `Разбойник`
                                } else if (x == 5) {
                                    return resolveClassName.className = `Жрец`
                                } else if (x == 6) {
                                    return resolveClassName.className = `Рыцарь Смерти`
                                } else if (x == 7) {
                                    return resolveClassName.className = `Шаман`
                                } else if (x == 8) {
                                    return resolveClassName.className = `Маг`
                                } else if (x == 9) {
                                    return resolveClassName.className = `Чернокнижник`
                                } else if (x == 11) {
                                    return resolveClassName.className = `Друид`
                                } else {
                                    return resolveClassName.className = `Неизвестно`
                                }
                            })
                        }

                        function resolveRaceName(x) {
                            return new Promise(resolve => {
                                setTimeout(() => resolve(`Timeout`), 200);

                                if (x == 1) {
                                    resolveRaceName.raceName = `Человек`
                                } else if (x == 2) {
                                    resolveRaceName.raceName = `Орк`
                                } else if (x == 3) {
                                    resolveRaceName.raceName = `Дворф`
                                } else if (x == 4) {
                                    resolveRaceName.raceName = `Ночной эльф`
                                } else if (x == 5) {
                                    resolveRaceName.raceName = `Отрекшийся`
                                } else if (x == 6) {
                                    resolveRaceName.raceName = `Таурен`
                                } else if (x == 7) {
                                    resolveRaceName.raceName = `Гном`
                                } else if (x == 8) {
                                    resolveRaceName.raceName = `Тролль`
                                } else if (x == 9) {
                                    resolveRaceName.raceName = `Гоблин`
                                } else if (x == 10) {
                                    resolveRaceName.raceName = `Эльф`
                                } else if (x == 11) {
                                    resolveRaceName.raceName = `Дреней`
                                } else if (x == 12) {
                                    resolveRaceName.raceName = `Ночнорожденный`
                                } else if (x == 13) {
                                    resolveRaceName.raceName = `Человек`
                                } else if (x == 14) {
                                    resolveRaceName.raceName = `Ворген`
                                } else if (x == 15) {
                                    resolveRaceName.raceName = `Скелет`
                                } else if (x == 16) {
                                    resolveRaceName.raceName = `Пандарен`
                                } else if (x == 17) {
                                    resolveRaceName.raceName = `Эльф Бездны`
                                } else if (x == 18) {
                                    resolveRaceName.raceName = `Зандалар`
                                } else if (x == 19) {
                                    resolveRaceName.raceName = `Светозарный Дреней`
                                } else if (x == 20) {
                                    resolveRaceName.raceName = `Высший эльф`
                                } else if (x == 21) {
                                    resolveRaceName.raceName = `Ледяной Тролль`
                                } else {
                                    resolveRaceName.raceName = `Неизвестно`
                                }
                            })
                        }

                        function convertWealth(x) {
                            return new Promise(resolve => {
                                setTimeout(() => resolve(`Timeout`), 200);

                                var playerTotalMoney = x;
                                var playerGold = playerTotalMoney / 10000
                                playerTotalMoney = playerTotalMoney % 10000
                                var playerSilver = playerTotalMoney / 100;
                                var playerCopper = playerTotalMoney % 100;
                                return convertWealth.converted = `${Math.round(playerGold)}з ${Math.round(playerSilver)}с ${Math.round(playerCopper)}м`
                            })
                        }

                        function convertTime(d) {
                            return new Promise(resolve => {
                                setTimeout(() => resolve(`Timeout`), 200);

                                d = Number(d);
                                var h = Math.floor(d / 3600);
                                var m = Math.floor(d % 3600 / 60);
                                var s = Math.floor(d % 3600 % 60);
                                return convertTime.converted = `${h}ч ${m}мин ${s}сек`;

                            })
                        }

                        resolveStats().then(x => {

                            commandoMsg.author.send({
                                embed: {
                                    "url": "https://discordapp.com",
                                    "color": 15105570,
                                    "footer": {
                                        "icon_url": "https://charscrolls.com/cot/img/logo.png",
                                        "text": "Актуально на момент получения сообщения"
                                    },
                                    "thumbnail": {
                                        "url": "https://charscrolls.com/cot/img/logo.png"
                                    },
                                    "author": {
                                        "name": "Статистика сервера"
                                    },
                                    "fields": [
                                        {
                                        "name": "Персонажи",
                                        "value": `Всего: ${totalCharacters}, из них: \n... мужчин: ${totalMale}\n... женщин: ${totalFemale}`
                                        },
                                        {
                                            "name": "Прочее",
                                            "value": `Наиграно часов суммарно: ${playersTotalTime} \nВсего убийств: ${playerTotalKills}\nВсего золота: ${playerTotalWealth}`
                                        }
                                    ]
                                }
                            });

                            commandoMsg.author.send({
                                embed: {
                                    "url": "https://discordapp.com",
                                    "color": 15105570,
                                    "footer": {
                                        "icon_url": "https://charscrolls.com/cot/img/logo.png",
                                        "text": "Актуально на момент получения сообщения"
                                    },
                                    "thumbnail": {
                                        "url": "https://charscrolls.com/cot/img/logo.png"
                                    },
                                    "author": {
                                        "name": "Статистика сервера"
                                    },
                                    "fields": [
                                        {
                                            "name": "Расы - 1/2",
                                            "value": `Человек: ${totalHuman} (мода: ${dominantHumanGender}, ${dominantHumanClass})\nОрк: ${totalOrc} (мода: ${dominantOrcGender}, ${dominantOrcClass})\nДворф: ${totalDwarf} (мода: ${dominantDwarfGender}, ${dominantDwarfClass})\nНочной эльф: ${totalNightelf} (мода: ${dominantNightelfGender}, ${dominantNightelfClass})\nОтрекшийся: ${totalUndead} (мода: ${dominantUndeadGender}, ${dominantUndeadClass})\nТаурен: ${totalTauren} (мода: ${dominantTaurenGender}, ${dominantTaurenClass})\nГном: ${totalGnome} (мода: ${dominantGnomeGender}, ${dominantGnomeClass})\nТролль: ${totalTroll} (мода: ${dominantTrollGender}, ${dominantTrollClass})\nГоблин: ${totalGoblin} (мода: ${dominantGoblinGender}, ${dominantGoblinClass})\nЭльф: ${totalElf} (мода: ${dominantElfGender}, ${dominantElfClass})\nДреней: ${totalDraenei} (мода: ${dominantDraeneiGender}, ${dominantDraeneiClass})`
                                        }
                                    ]
                                }
                            });

                            commandoMsg.author.send({
                                embed: {
                                    "url": "https://discordapp.com",
                                    "color": 15105570,
                                    "footer": {
                                        "icon_url": "https://charscrolls.com/cot/img/logo.png",
                                        "text": "Актуально на момент получения сообщения"
                                    },
                                    "thumbnail": {
                                        "url": "https://charscrolls.com/cot/img/logo.png"
                                    },
                                    "author": {
                                        "name": "Статистика сервера"
                                    },
                                    "fields": [
                                        {
                                            "name": "Расы - 2/2",
                                            "value": `Ночнорожденный: ${totalNightborn} (мода: ${dominantNightbornGender}, ${dominantNightbornClass})\nЧеловек (Кул Тирас): ${totalKulTirasHuman} (мода: ${dominantKulTirasHumanGender}, ${dominantKulTirasHumanClass})\nВорген: ${totalWorgen} (мода: ${dominantWorgenGender}, ${dominantWorgenClass})\nСкелет: ${totalSkeleton} (мода: ${dominantSkeletonGender}, ${dominantSkeletonClass})\nПандарен: ${totalPandaren} (мода: ${dominantPandarenGender}, ${dominantPandarenClass})\nЭльф Бездны: ${totalVoidElf} (мода: ${dominantVoidElfGender}, ${dominantVoidElfClass})\nЗандалар: ${totalZandalar} (мода: ${dominantZandalarGender}, ${dominantZandalarClass})\nСветозарный Дреней: ${totalLightDraenei} (мода: ${dominantLightDraeneiGender}, ${dominantLightDraeneiClass})\nВысший Эльф: ${totalHighElf} (мода: ${dominantHighElfGender}, ${dominantHighElfClass})\nЛедяной Тролль: ${totalIceTroll} (мода: ${dominantIceTrollGender}, ${dominantIceTrollClass})\n`
                                        }
                                    ]
                                }
                            });

                            commandoMsg.author.send({
                                embed: {
                                    "url": "https://discordapp.com",
                                    "color": 15105570,
                                    "footer": {
                                        "icon_url": "https://charscrolls.com/cot/img/logo.png",
                                        "text": "Актуально на момент получения сообщения"
                                    },
                                    "thumbnail": {
                                        "url": "https://charscrolls.com/cot/img/logo.png"
                                    },
                                    "author": {
                                        "name": "Статистика сервера"
                                    },
                                    "fields": [
                                        {
                                            "name": "Классы",
                                            "value": `Воин: ${totalWarrior} (мода: ${modeGenderWarrior}, ${modeRaceWarrior})\nПаладин: ${totalPaladin} (мода: ${modeGenderPaladin}, ${modeRacePaladin})\nОхотник: ${totalHunter} (мода: ${modeGenderHunter}, ${modeRaceHunter})\nРазбойник: ${totalRogue} (мода: ${modeGenderRogue}, ${modeRaceRogue})\nЖрец: ${totalPriest} (мода: ${modeGenderPriest}, ${modeRacePriest})\nРыцарь Смерти: ${totalDK} (мода: ${modeGenderDK}, ${modeRaceDK})\nШаман: ${totalShaman} (мода: ${modeGenderShaman}, ${modeRaceShaman})\nМаг: ${totalMage} (мода: ${modeGenderMage}, ${modeRaceMage})\nЧернокнижник: ${totalWarlock} (мода: ${modeGenderWarlock}, ${modeRaceWarlock})\nДруид: ${totalDruid} (мода: ${modeGenderDruid}, ${modeRaceDruid})\n`
                                        }
                                    ]
                                }
                            });
                            
                            getUserPermissionId().then(x => {
                                if (resolvedAccess == 1) {
                                    commandoMsg.author.send({
                                        embed: {
                                            "url": "https://discordapp.com",
                                            "color": 15158332,
                                            "footer": {
                                                "icon_url": "https://charscrolls.com/cot/img/logo.png",
                                                "text": "Актуально на момент получения сообщения"
                                            },
                                            "thumbnail": {
                                                "url": "https://charscrolls.com/cot/img/logo.png"
                                            },
                                            "author": {
                                                "name": "Топ сервера"
                                            },
                                            "fields": [
                                                {
                                                    "name": "Топ-5 убийц",
                                                    "value": `1. ${killsTop1} (${killsTop1Total} уб.)\n2. ${killsTop2} (${killsTop2Total} уб.)\n3. ${killsTop3} (${killsTop3Total} уб.)\n4. ${killsTop4} (${killsTop4Total} уб.)\n5. ${killsTop5} (${killsTop5Total} уб.)`
                                                },
                                                {
                                                    "name": "Топ-5 по состоянию",
                                                    "value": `1. ${wealthTop1} (${wealthTop1Total})\n2. ${wealthTop2} (${wealthTop2Total})\n3. ${wealthTop3} (${wealthTop3Total})\n4. ${wealthTop4} (${wealthTop4Total})\n5. ${wealthTop5} (${wealthTop5Total})\n`
                                                },
                                                {
                                                    "name": "Топ-5 по времени в игре",
                                                    "value": `1. ${timeTop1} (${timeTop1Total})\n2. ${timeTop2} (${timeTop2Total})\n3. ${timeTop3} (${timeTop3Total})\n4. ${timeTop4} (${timeTop4Total})\n5. ${timeTop5} (${timeTop5Total})\n`
                                                }
                                            ]
                                        }
                                    });
                                }
                            }).catch(error => {
                                console.log(error)
                            });
                        })
                    } else {
                        return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                    }
                } else {
                    return commandoMsg.author.send(`Вы не можете использовать эту команду.`)
                }
            } else {
                return commandoMsg.author.send(`Эту команду нельзя использовать в общем чате. Пожалуйста, пришлите команду в личные сообщения со мной.`)
            }
        })
        
    }
}