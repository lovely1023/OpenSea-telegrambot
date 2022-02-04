# React application with Express server

This project send message to telegram if there is new event in openSEA site.

1. monitor specified openSea Account
2. If there is new activity, send message to telegram via telegram bot
3. Telegram message will need to structured
   <pre>
   username 
   event_type 
   NFT name 
   price (ETH/USD) 
   URL
   </pre>
4. Don't need a notification when they list something for sale or when they cancel something
Just success, transfer, and mint to begin

## How to get telegram token
  https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token
## Using this project

1. install the dependencies.

   ```bash
   npm install
   ```

2. Create a `.env` file for environment variables in your server.

   ```bash
   touch .env
   ```

3. Start the server

   You can start the server on its own with the command:

   ```bash
   npm run server
   ```

   Run the React application on its own with the command:

   ```bash
   npm start
   ```

   Run both applications together with the command:

   ```bash
   npm run dev
   ```

   The React application will run on port 3000 and the server port 3001.
