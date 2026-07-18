const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

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

app.get('/', (req, res) => {
  res.send('<h1>Привет, Октагон!</h1>');
});

app.get('/static', (req, res) => {
  res.json({
    header: "Hello",
    body: "Octagon NodeJS Test"
  });
});

app.get('/dynamic', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = req.query.c;

  if (a === undefined || b === undefined || c === undefined) {
    return res.json({ header: "Error" });
  }

  const numA = Number(a);
  const numB = Number(b);
  const numC = Number(c);

  if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
    return res.json({ header: "Error" });
  }

  const result = (numA * numB * numC) / 3;

  res.json({
    header: "Calculated",
    body: String(result)
  });
});

app.get('/getAllItems', (req, res) => {
  connection.query('SELECT * FROM Items', (err, results) => {
    if (err) {
      console.error('Ошибка запроса:', err.message);
      return res.json(null);
    }
    res.json(results);
  });
});

app.post('/addItem', (req, res) => {
  const name = req.query.name;
  const desc = req.query.desc;

  if (!name || !desc || name.trim() === '' || desc.trim() === '') {
    return res.json(null);
  }

  connection.query(
    'INSERT INTO Items (name, `desc`) VALUES (?, ?)',
    [name, desc],
    (err, result) => {
      if (err) {
        console.error('Ошибка вставки:', err.message);
        return res.json(null);
      }
      
      res.json({
        id: result.insertId,
        name: name,
        desc: desc
      });
    }
  );
});

app.post('/deleteItem', (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.json(null);
  }

  if (isNaN(Number(id))) {
    return res.json(null);
  }

  connection.query(
    'DELETE FROM Items WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Ошибка удаления:', err.message);
        return res.json(null);
      }
      
      if (result.affectedRows === 0) {
        return res.json({});
      }
      
      res.json({});
    }
  );
});

app.post('/updateItem', (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  const desc = req.query.desc;

  if (!id || !name || !desc || name.trim() === '' || desc.trim() === '') {
    return res.json(null);
  }

  if (isNaN(Number(id))) {
    return res.json(null);
  }

  connection.query(
    'UPDATE Items SET name = ?, `desc` = ? WHERE id = ?',
    [name, desc, id],
    (err, result) => {
      if (err) {
        console.error('Ошибка обновления:', err.message);
        return res.json(null);
      }
      
      if (result.affectedRows === 0) {
        return res.json({});
      }
      
      res.json({
        id: Number(id),
        name: name,
        desc: desc
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});