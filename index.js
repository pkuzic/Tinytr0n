/*const { Client  } = require(`discord.js`);
const { config } = require(`dotenv`);

const client = new Client();

config({
    path: __dirname + `/.env`
})

client.on(`ready`, () => {
    console.log(`${client.user.username}: online`)
}); 

client.on(`message`, async message => {
    const prefix = `_`;

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
});

client.login(process.env.TOKEN);*/

/*
===================GUIDE SECTION==============================================================================================================================
--------------------------------------------------------------------------------------------------------------------------------------------------------------
Stages:
1.  Newbie user/newcomer. They have to create an account, otherwise they will have a limited access to the chat and the game.

2.  Registered user. They have an access to the game, but not the chat. Once they will verify themself through the game
    using a key code, the game will make a SQL-request to our guild (Discord server) database (UPDATE accounts SET stage to 3 WHERE user_who_used_key_code)
    they will have an access to the "verifyme" command, which will give them the role with access to all the chats within the Discord server.

3.  Verified user. Verified user is a user who used the keycode in the game
*/

const commando = require(`discord.js-commando`);
const path = require (`path`);
const config = require(path.join(__dirname, `config`, `config.json`));

const mysql = require(`mysql`);
const authdb = mysql.createConnection({
    host: config.authhost,
    user: config.authuser,
    password: config.authpassword,
    database: config.authdatabase
});
  
authdb.connect(function(err) {
    if (err) throw err;
    authdb.query(`SELECT * FROM account WHERE id = 1`, function (err, result, fields) {
        if (err) throw err;
        //console.log(result); //debug log
    });
})

const client = new commando.CommandoClient({
    owner: config.clientowner,
    commandPrefix: config.botprefix
});

client.login(config.token);

client.registry.registerGroups([
    ['mod', 'Модерация'],
    ['misc', 'Прочее'],
    ['accmgmt', 'Аккаунт']
]).registerDefaults()
.registerCommandsIn(path.join(__dirname, `commands`));

client.on(`ready`, () => {
    console.log(`${client.user.username}: online`) //technical log
}); 

client.on(`guildMemberAdd`, member => {
    var newbierole = member.guild.roles.cache.get(config.newbierole)
    var newbiechannel = member.guild.channels.cache.get(config.newbiechat)

    console.log(`${member.user.tag} (${member.user.id}) has joined the server.`) //technical log
    member.roles.add(newbierole).catch(console.error);
    newbiechannel.send(`
    <@${member.user.id}>, добро пожаловать на Discord-сервер ролевого проекта ${config.realmname}.
    \nЧтобы получить доступ к Discord-серверу и игровому аккаунту, введите в этом чате команду ` + "``" + `${config.botprefix}` + "register``" +  ` и следуйте инструкциям у себя в **личных сообщениях**.
    \nЕсли у Вас возникают проблемы с регистрацией, свяжитесь с одним из администраторов (список администраторов доступен справа в окне клиента чата).
    `)
})
