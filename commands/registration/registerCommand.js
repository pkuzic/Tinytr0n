const commando = require('discord.js-commando');

const path = require (`path`);
const config = require(path.join(__dirname, `../..` ,`config`, `config.json`));
const mysql = require(`mysql`);

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



module.exports = class registerCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `register`,
            group: `accmgmt`,
            memberName: `register`,
            description: `Регистрирует пользователя в базе данных Discord-сервера.`,
            guildOnly: true
        })
    }
    async run(commandoMsg) {     
        let newbierole = commandoMsg.guild.roles.cache.get(config.newbierole);
        if (commandoMsg.member.roles.cache.has(newbierole.id)) {
            commandoMsg.author.send(`Здравствуйте!`)
            .then(console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) has initiated registration process.`)) //technical log
            .catch(err => console.log(err)); //technical log
        
            //Проверки: 1. если пользователь НЕ зарегистрирован в БД (сверять по ид), то создать новую запись. 2. если пользователь ЗАРЕГИСТРИРОВАН в БД, то сказать, чтобы обращался к администратору.
            discorddb.query(`SELECT * FROM accounts WHERE memberid = ${commandoMsg.member.user.id}`, function (err, results, fields) {
                if (err) throw err;
                //console.log(results);//дебага ради, кидаем результаты в лог
                if(results == ``) { //если пусто, то продолжаем
                    console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) can't be found in the database, thus initiating registration.`)
                    discorddb.query(`INSERT INTO accounts (memberid, stage) VALUES (${commandoMsg.member.user.id}, 1)`)
                    
                    return commandoMsg.author.send(`Благодарим Вас за проявленный интерес к нашему проекту. Для того, чтобы создать аккаунт на сервере, а так же получить полный доступ к нашему Discord-серверу, Вам потребуется придумать логин.\nВведите логин в форме ` + "``loginname логин``" + `.\n\n**Правила подбора логина:**\n1. 0-9, A-Z, и a-z.\n2. От 3 до 12 символов.\n2. Уникальность.`)
                /* authdb.query(`INSERT INTO account (username, stage) VALUES (${commandoMsg.content}, 0)`),
                    discorddb.query(`UPDATE accounts WHERE memberid = ${commandoMsg.member.user.id} SET stage = 2`))*/
                } else { //если не пусто, НО попрежнему имеется группа нуба, то кидаем такое сообщение
                    console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) seems to be registered, thus can't initiate registration.`)
                  
                    return commandoMsg.author.send(`Судя по всему, Вы уже имеете аккаунт на сервере, потому автоматизированная регистрация через Discord недоступна для Вас. Обратитесь к одному из администраторов Discord-сервера за помощью в прохождении регистрации вручную, заранее указав то, что Ваша запись уже имеется в базе данных.`)
                }
            })
        } else { //is registered and doesn't have the newbie role
            return console.log(`(${commandoMsg.content}): ${commandoMsg.member.user.tag} (${commandoMsg.member.user.id}) tried to register, however they are already registered.`); //technical log
        }   
    }
}