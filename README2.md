SimpleRep is an easy to use and versatile bot for keeping track of reputation for marketplace-style servers. It allows users to simply give other users reputation for good work or negative reputation for poor or mismanaged products or services. This information can then be retrieved in a highly readable table.

Features include
`!rep <user>` command
* Get a detailed view of all of a user's reputation in one server
* Each rep has a unique ID so that administrators can remove or modify rep if necessary
![!rep](https://i.imgur.com/G1NkSbx.jpg)

`!addrep <user> <reason>` and `negrep <user> <reason>`
* Give a user positive or negative reputation respectively.
* Includes a minimum reason length of 12 characters and a maximum of 80 to ensure that detailed reasoning for reputation is included.
![!addrep](https://i.imgur.com/ZaBVKgu.jpg)

`!countrep <user>`
* Get a user's total amount of positive and negative reputation
![!countrep](https://i.imgur.com/xFqHQDl.jpg)

The bot also includes three pre-made roles: trader, reputable, and trusted. Once a user gets a certain amount of reputation, they can promote themselves to a role using the `!promote <role>` command. The threshold for each role can be modified using the admin-only command `!setrep` and it can be checked using `!requirements`.

In addition to this, each role: default, trader, reputable, and trusted has its own cooldown for how long a user must wait before they can give reputation again. This cooldown is fully customizable and can be changed using the command `!setcooldown <role> <time in seconds>`. These cooldowns can be checked for each server using `!cooldowns`

Admins can remove reputation by ID using `!purgerep <id>`

Please also note that the prefix of this bot is fully customizable and can be changed using `!rep_prefix <new prefix>`

If you need any help, please join our support server or contact me directly.