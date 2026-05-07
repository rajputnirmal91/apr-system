// API Controller with intentional bugs for PR review testing

const express = require('express');
const router = express.Router();

// BUG 1: No input validation or sanitization
router.post('/users', (req, res) => {
  const { email, name, password } = req.body;
  
  // BUG 2: SQL Injection vulnerability - direct string concatenation
  const query = `INSERT INTO users (email, name, password) VALUES ('${email}', '${name}', '${password}')`;
  
  // BUG 3: Storing password in plain text (security issue)
  db.query(query, (err, result) => {
    if (err) {
      // BUG 4: Exposing sensitive error details to client
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.json({ success: true, userId: result.insertId });
    }
  });
});

// BUG 5: No authentication/authorization check
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // BUG 6: No validation of userId format
  const query = `DELETE FROM users WHERE id = ${userId}`;
  
  db.query(query, (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete user' });
    } else {
      res.json({ success: true });
    }
  });
});

// BUG 7: N+1 query problem
router.get('/users-with-posts', (req, res) => {
  db.query('SELECT * FROM users', (err, users) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
      return;
    }
    
    // BUG 8: Making individual query for each user (N+1 problem)
    users.forEach((user, index) => {
      db.query(`SELECT * FROM posts WHERE user_id = ${user.id}`, (err, posts) => {
        users[index].posts = posts;
      });
    });
    
    res.json(users);
  });
});

// BUG 9: Hardcoded API key and database credentials
const DB_HOST = 'localhost';
const DB_USER = 'admin';
const DB_PASSWORD = 'password123';
const API_KEY = 'sk_live_abcdef123456';

// BUG 10: No rate limiting or DDoS protection
router.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  
  // BUG 11: No input validation - vulnerable to injection
  const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Search failed' });
    } else {
      res.json(results);
    }
  });
});

// BUG 12: Missing error handling for async operations
router.post('/send-email', async (req, res) => {
  const { email, subject, body } = req.body;
  
  // BUG 13: No try-catch for async operation
  const result = await sendEmail(email, subject, body);
  
  res.json({ success: true, messageId: result.id });
});

// BUG 14: Unused variable
const deprecatedConfig = {
  oldApiVersion: 'v1',
  legacyEndpoint: '/api/v1'
};

// BUG 15: Memory leak - event listener never removed
function setupDatabaseListener() {
  const listener = (event) => {
    console.log('Database event:', event);
  };
  
  db.on('change', listener);
  // Missing: db.off('change', listener) in cleanup
}

// BUG 16: No pagination - could return massive dataset
router.get('/all-records', (req, res) => {
  db.query('SELECT * FROM large_table', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch records' });
    } else {
      // BUG 17: Returning all records without limit
      res.json(results);
    }
  });
});

// BUG 18: Inconsistent error handling
router.get('/data/:id', (req, res) => {
  const id = req.params.id;
  
  db.query(`SELECT * FROM data WHERE id = ${id}`, (err, result) => {
    // BUG 19: Sometimes returns error, sometimes doesn't handle it
    if (err) {
      console.log(err);
      // Missing proper error response
    }
    
    res.json(result);
  });
});

module.exports = router;
