const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Make sure the path to user.js is correct

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/know-covid', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'a47068349b973d206dbf5820dc39985b4e8544fc335c294784401db90e5e0f7d0f19bc43989d95a2f95d94624d8c5e3a6c257c7212c7341cf6fdc5792729b707',
  resave: false,
  saveUninitialized: true
}));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Registration route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already registered.');
    }

    user = new User({ username, password });
    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering the user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.send('Login successful');
    } else {
      res.status(400).send('Invalid username or password.');
    }
  } catch (error) {
    res.status(500).send('Error logging in the user');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
