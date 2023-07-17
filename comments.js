// Create web server application
// http://localhost:3000

// Import modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const comments = require('./comments.json');
const fs = require('fs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes
app.get('/', (req, res) => {
    res.send('Welcome to my comments app!');
});

// Get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Get a comment by ID
app.get('/comments/:id', (req, res) => {
    const comment = comments.find(comment => comment.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found.');
    res.json(comment);
});

// Create a new comment
app.post('/comments', (req, res) => {
    const comment = {
        id: comments.length + 1,
        name: req.body.name,
        comment: req.body.comment
    };
    comments.push(comment);
    fs.writeFile('./comments.json', JSON.stringify(comments), () => {
        console.log('New comment added.');
    });
    res.json(comment);
});

// Update a comment
app.put('/comments/:id', (req, res) => {
    const comment = comments.find(comment => comment.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found.');
    comment.name = req.body.name;
    comment.comment = req.body.comment;
    fs.writeFile('./comments.json', JSON.stringify(comments), () => {
        console.log('Comment updated.');
    });
    res.json(comment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const comment = comments.find(comment => comment.id === parseInt(req.params.id));
    if (!comment) res.status(404).send('The comment with the given ID was not found.');
    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    fs.writeFile('./comments.json', JSON.stringify(comments), () => {
        console.log('Comment deleted.');
    });
    res.json(comment);
});

// Start server
app.listen(3000, () => {
    console.log('Listening on port 3000...');
});