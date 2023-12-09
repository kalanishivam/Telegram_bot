import TelegramBot from 'node-telegram-bot-api';


// const token = process.env.TOKEN;
export const createBot = (token)=>{
    return new TelegramBot(token, {polling: true});
};

