# Hardly Bot
Hardly Bot is a simple Discord bot written in Typescript and Discord.js, which responds to messages ending in '-er' with a witty "\<word\>er? I hardly know 'er!"

By default, it will only reply once every 15 seconds, but this behavior can be changed using the `!hardlytimer <seconds>` command.

### Requirements: 
Requires a file at root named '.env' with `TOKEN` set to your bot's secret (located in the Discord Developer Portal)

### Note:
When publishing, ensure timer.json is located in the same directory as your index.js file
