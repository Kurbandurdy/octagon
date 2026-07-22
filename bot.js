import { Bot } from 'node-telegram-bot-api';
import { run } from 'node-telegram-bot-api/node';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('Ошибка: BOT_TOKEN не найден в файле .env');
  process.exit(1);
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ChatBotTests'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err.message);
    return;
  }
  console.log('Подключение к MySQL успешно установлено');
});

const bot = new Bot(token);

bot.command('start', (ctx) => {
  ctx.reply('Привет, октагон!');
});

bot.command('help', (ctx) => {
  const helpText = 'Доступные команды:\n' +
                   '/start - Приветственное сообщение\n' +
                   '/help - Список команд\n' +
                   '/site - Ссылка на сайт Октагона\n' +
                   '/creator - Информация о создателе\n' +
                   '/randomItem - Случайный предмет из БД\n' +
                   '/getItemByID {id} - Предмет по ID\n' +
                   '/deleteItem {id} - Удалить предмет по ID';
  ctx.reply(helpText);
});

bot.command('site', (ctx) => {
  ctx.reply('https://octagon-students.ru');
});

bot.command('creator', (ctx) => {
  ctx.reply('Kurbandurdy Suleymankulyyev');
});

bot.command('randomItem', (ctx) => {
  connection.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1', (err, results) => {
    if (err) {
      ctx.reply('Ошибка при получении случайного предмета');
      return;
    }
    
    if (results.length === 0) {
      ctx.reply('В базе данных нет предметов');
      return;
    }
    
    const item = results[0];
    const message = `(${item.id}) - ${item.name}: ${item.desc}`;
    ctx.reply(message);
  });
});

bot.command('getItemByID', (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  
  if (parts.length < 2) {
    ctx.reply('Ошибка: укажите ID. Пример: /getItemByID 1');
    return;
  }
  
  const id = parts[1];
  
  if (isNaN(Number(id))) {
    ctx.reply('Ошибка: ID должен быть числом');
    return;
  }
  
  connection.query('SELECT * FROM Items WHERE id = ?', [id], (err, results) => {
    if (err) {
      ctx.reply('Ошибка при получении предмета');
      return;
    }
    
    if (results.length === 0) {
      ctx.reply('Ошибка: предмет с таким ID не найден');
      return;
    }
    
    const item = results[0];
    const message = `(${item.id}) - ${item.name}: ${item.desc}`;
    ctx.reply(message);
  });
});

bot.command('deleteItem', (ctx) => {
  const text = ctx.message.text;
  const parts = text.split(' ');
  
  if (parts.length < 2) {
    ctx.reply('Ошибка: укажите ID. Пример: /deleteItem 1');
    return;
  }
  
  const id = parts[1];
  
  if (isNaN(Number(id))) {
    ctx.reply('Ошибка: ID должен быть числом');
    return;
  }
  
  connection.query('DELETE FROM Items WHERE id = ?', [id], (err, result) => {
    if (err) {
      ctx.reply('Ошибка при удалении предмета');
      return;
    }
    
    if (result.affectedRows === 0) {
      ctx.reply('Ошибка: предмет с таким ID не найден');
      return;
    }
    
    ctx.reply('Удачно');
  });
});

console.log('Бот запущен и ожидает сообщений...');
await run(bot);