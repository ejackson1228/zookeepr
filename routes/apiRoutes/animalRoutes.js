const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();


router.get('/animals', (req, res) => { // GET request for animals by query parameters
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

router.get('/animals/:id', (req, res) => { // GET request for animals by id parameter
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
  });

router.post('/animals', (req, res) => { // POST request to upload new aniimals from client-side
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
    
        res.json(animal);
    }
});

module.exports = router;