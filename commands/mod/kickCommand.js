//const commando = require('discord.js-commando');
/*
module.exports = class kickCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: `kick`,
            group: `mod`,
            memberName: `kick`,
            description: `Исключает пользователя из Discord-сервера.`,
            userPermissions: [
                `KICK_MEMBERS`
            ],
            clientPermissions: [
                `KICK_MEMBERS`
            ],
            argsType: `single`,

        })
    }
    async run(commandoMsg, userId) {        
        let user = commandoMsg.guild.members.get(userId);
        if(user) {
            user.kick(`Разработать причину`)
            .then(member => console.log(`(${commandoMsg.content}): ${member.user.tag} (${member.user.id}) исключен из Discord-сервера.`)) //technical log
            .catch(err => console.log(err)); //technical log

            console.log(`${commandoMsg.content}`); //technical log
        } else {
            console.log(`(${commandoMsg.content}): Неизвестный пользователь.`); //technical log
        }
    }
}*/