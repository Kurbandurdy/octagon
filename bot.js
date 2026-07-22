import { Bot } from 'node-telegram-bot-api';
import { run } from 'node-telegram-bot-api/node';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('Ошибка: BOT_TOKEN не найден в файле .env');
  process.exit(1);
}

const bot = new Bot(token);

bot.command('start', (ctx) => {
  ctx.reply('Привет, октагон!');
});

bot.command('help', (ctx) => {
  const helpText = 'Доступные команды:\n' +
                   '/start - Приветственное сообщение\n' +
                   '/help - Список команд\n' +
                   '/site - Ссылка на сайт Октагона\n' +
                   '/creator - Информация о создателе';
  ctx.reply(helpText);
});

bot.command('site', (ctx) => {
  ctx.reply('https://octagon-students.ru');
});

bot.command('creator', (ctx) => {
  ctx.reply('Kurbandurdy Suleymankulyyev');
});

console.log('Бот запущен и ожидает сообщений...');
await run(bot);