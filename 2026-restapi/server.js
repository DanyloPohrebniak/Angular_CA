import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()

app.use(cors())

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gaanfl2026'
});

connection.connect(function (err) {
  if (err) {
    console.error('Connection error: ' + err.stack);
    return;
  }

  console.log('Connected with id ' + connection.threadId);
});

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/fixtures', (req, res) => {
  connection.query('SELECT * FROM fixtures WHERE round > 5 ORDER BY division, round, hteam', (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})

app.get('/results', (req, res) => {
  connection.query('SELECT * FROM fixtures WHERE round < 6 ORDER BY division, round, hteam', (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})

app.get('/managers', (req, res) => {
  connection.query('SELECT * FROM managers ORDER BY name', (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})

app.get('/players', (req, res) => {
  connection.query('SELECT * FROM players', (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})

app.get('/teams', (req, res) => {
  connection.query('SELECT * FROM teams ORDER BY r DESC', (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})


app.listen(4200, () => {
  console.log('Server is running on http://localhost:4200')
})