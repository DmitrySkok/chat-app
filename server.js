const express = require('express');
const path = require('path');
const db = require('./db.js');
const messages = db.messages;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('<h1>404 not found...</h1>');
})

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});