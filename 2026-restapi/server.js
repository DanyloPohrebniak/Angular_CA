import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json());

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
  const query = `
    SELECT 
      f.*,
      ht.rgb as hrgb,
      at.rgb as argb
    FROM fixtures f
    LEFT JOIN teams ht ON f.hteam = ht.name
    LEFT JOIN teams at ON f.ateam = at.name
    WHERE f.round > 5 
    ORDER BY f.division ASC, f.round ASC, f.hteam
  `;
  
  connection.query(query, (err, rows, fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Database error');
    }

    res.json(rows)
  })
})

app.get('/results', (req, res) => {
  const query = `
    SELECT 
      f.*,
      ht.rgb as hrgb,
      at.rgb as argb
    FROM fixtures f
    LEFT JOIN teams ht ON f.hteam = ht.name
    LEFT JOIN teams at ON f.ateam = at.name
    WHERE f.round < 6 
    ORDER BY f.division ASC, f.round ASC, f.hteam
  `;
  
  connection.query(query, (err, rows, fields) => {
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

// get 2 random teams from db
app.get('/teams/random', (req, res) => {
    const query = "SELECT id, name FROM teams ORDER BY RAND() LIMIT 2";
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Team rank update
app.post('/teams/vote', (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ error: 'Team ID is required' });
    }
    const query = "UPDATE teams SET powerrank = powerrank + 1 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// Update match results
app.put('/results/:id', (req, res) => {
    const { id } = req.params;
    const { hteam, ateam, hgls, h2pts, h1pts, agls, a2pts, a1pts, hteamtotal, ateamtotal } = req.body;
    
    if (!id) {
        return res.status(400).json({ error: 'Match ID is required' });
    }

    const hTotal = hteamtotal || ((hgls || 0) * 3) + ((h2pts || 0) * 2) + (h1pts || 0);
    const aTotal = ateamtotal || ((agls || 0) * 3) + ((a2pts || 0) * 2) + (a1pts || 0);
    
    const hScore = `${hgls || 0}-${h2pts || 0}-${h1pts || 0}`;
    const aScore = `${agls || 0}-${a2pts || 0}-${a1pts || 0}`;

    const query = `
        UPDATE fixtures 
        SET hteam = ?, 
            ateam = ?, 
            hgls = ?, 
            h2pts = ?, 
            h1pts = ?, 
            agls = ?, 
            a2pts = ?, 
            a1pts = ?,
            hteamscore = ?,
            ateamscore = ?,
            hteamtotal = ?,
            ateamtotal = ?
        WHERE id = ?
    `;
    
    connection.query(query, [hteam, ateam, hgls, h2pts, h1pts, agls, a2pts, a1pts, hScore, aScore, hTotal, aTotal, id], (err, results) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Database update failed', details: err.message });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        
        res.json({ success: true, message: 'Match updated successfully' });
    });
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})