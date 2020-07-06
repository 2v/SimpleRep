<img alt="SimpleRep" src="https://i.imgur.com/S508wNe.png"/>

**An easy to use and highly-customizable bot for managing reputation**

# Using SimpleRep

**Just one [click](https://discordapp.com/oauth2/authorize?client_id=722844046145356161&scope=bot&permissions=269741120) and you can add SimpleRep to your own server and enjoy its full feature set!**

This bot is hosted on a powerful DigitalOcean VPS and has 24/7 uptime. You can self-host if you would like but it is not necessary. Permissions have been scoped very carefully to avoid any possible abuse.

# Building your own SimpleRep

## ⚠ **Read before attempting**
It is not recommended to host this bot yourself. The official version has been batch-tested thoroughly and ensures the best level of support. This is also the version that we support on our official discord help server.

**We will not provide any support whatsoever in selfhosting or building the bot by yourself.**
The reason for this is because not only can the builds in here be highly unstable, but also there are very few people who could actually help with questions regarding this, most of which are busy and not available to answer said questions.

## Building the Bot

### Prerequisite:

You will need the following to utilize all of SimpleRep's features (items marked with a star are optional):
* Node Version 12.13.0 (LTS) and above
* npm 6.0.1 and above
* A config.json file containing your bot's secret token

**We will not provide any support whatsoever in obtaining any of the above.**

### Editing Code:
If you want to change any core features, this bot can be easily modified. Commands have been organized as simply as possible and can be modified in the source easily, although this will require self-hosting. The bot is not modular, but it allows the tuning of parameters for most commands.

### Steps for building:
<sub>Please do note that you will not receive any help whatsoever while trying to build your own Mantaro.</sub>
1. Make sure you have the prerequisites installed and running.
2. Run `npm install`
3. Run `node dbInit.js` with the optional `--force` flag to generate the databases.
4. Start the bot using `node index.js` or `pm2 start index.js`


## License

Copyright (C) 2020 **Thomas Buckley**

>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License
>as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. 
>                                                   
>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
>without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
>                                                   
>See the GNU General Public License for more details. 
>You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/

[The full license can be found here.](https://github.com/2v/SimpleRep/blob/master/LICENSE)