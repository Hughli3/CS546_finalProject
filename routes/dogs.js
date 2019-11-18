const express = require('express');
const router = express.Router();
const data = require('../data');
const animalData = data.animals;

router.get('/', async (req, res) => {
    try {
        const animalList = await animalData.getAll();
        res.json(animalList);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    let animalInfo = req.body;

    if (!animalInfo) {
        res.status(400).json({error: 'You must provide data to create an animal'});
        return;
    }
  
    if (!animalInfo.name) {
        res.status(400).json({error: 'You must provide an animal name'});
        return;
    }
  
    if (!animalInfo.animalType) {
        res.status(400).json({error: 'You must provide an animal type'});
        return;
    }

    try {
        const animal = await animalData.add(animalInfo.name, animalInfo.animalType);
        res.json(animal);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const animal = await animalData.getById(req.params.id);
        res.json(animal);
    } catch (e) {
        res.status(404).json({error: 'Animal not found'});
    }
});

router.put('/:id', async (req, res) => {
    let animalInfo = req.body;

    if (!animalInfo) {
      res.status(400).json({error: 'You must provide data to update an animal'});
      return;
    }
  
    if (!animalInfo.newName && !animalInfo.newType) {
      res.status(400).json({error: 'You must provide a name or a type or both'});
      return;
    }
  
    try {
        await animalData.getById(req.params.id);
    } catch (e) {
        res.status(404).json({error: "animal not found"});
        return;
    }

    try {
        const animal = await animalData.update(req.params.id, animalInfo.newName, animalInfo.newType);
        res.json(animal);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await animalData.getById(req.params.id);
    } catch (e) {
        res.status(404).json({error: "animal not found"});
        return;
    }
    try {
        const animal = await animalData.delete(req.params.id);
        res.json(animal);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
