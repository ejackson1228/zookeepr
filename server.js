const express = require('express');
const PORT = process.env.PORT || 3001; //port method to work-around heroku's port 80 environment
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals');

const app = express();

//parse incoming string or arrray data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // note that the animals array is saved as filteredResults here
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array.
        //if personalityTraist is a string, place it into a new array and save
        if( typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered result
    return filteredResults;
}

function findById (id, animalsArray) { //function to filter animals by id number 
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    console.log(body);
    // our functions main code will go here
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'), 
        // ^we want to write to our animals.json file in the data subdirectory, so we use join to join the value of __dirname,
        // which represents the directory of the file we execute the code in, with the path to animals.json file. 
        JSON.stringify({ animals: animalsArray }, null, 2)
        //^ we need to save js array data as JSON, so we use stringify to convert it.
        // null and 2 are means of keeping our data formatted. 
        // null is to prevent editing of any exisiting data.
        // 2 indicates we want to create white space between values to make it more readable. 

    );
    // return finished code to post route for response
    return animal;
}

app.get('/api/animals', (req, res) => { // GET request for animals by query parameters
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

app.get('/api/animals/:id', (req, res) => { // GET request for animals by id parameter
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
  });

app.post('/api/animals', (req, res) => { // POST request to upload new aniimals from client-side
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    
    
    res.json(animal);
});

app.listen(PORT, () => { //listen method to run on port 3001 on heroku (heroku runs their environment on port 80)
    console.log(`API server now on port ${PORT}!`);
  });