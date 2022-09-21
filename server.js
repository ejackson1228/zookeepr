const express = require('express');
const PORT = process.env.PORT || 3001; //port method to work-around heroku's port 80 environment
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const app = express();

app.use(express.static('public')); // middleware that instructs server to make certain files readily available. i.e. style.css and js files

//parse incoming string or arrray data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use('/api', apiRoutes);

app.use('/', htmlRoutes);

app.listen(PORT, () => { //listen method to run on port 3001 on heroku (heroku runs their environment on port 80)
    console.log(`API server now on port ${PORT}!`);
  });