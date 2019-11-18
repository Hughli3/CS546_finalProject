const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;

router.get('/', async (req, res) => {
    try {
        const postList = await postData.getAll();
        res.json(postList);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.post('/', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({error: 'You must provide data to create a post'});
        return;
    }
  
    if (!postInfo.title) {
        res.status(400).json({error: 'You must provide a title'});
        return;
    }
  
    if (!postInfo.author) {
        res.status(400).json({error: 'You must provide an author'});
        return;
    }

    if (!postInfo.content) {
        res.status(400).json({error: 'You must provide content'});
        return;
    }

    try {
        const post = await postData.add(postInfo.title, postInfo.content, postInfo.author);
        res.json(post);
    } catch (e) {
        // res.sendStatus(500);
        res.status(500).json({error: e});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await postData.getById(req.params.id);
        res.json(post);
    } catch (e) {
        res.status(404).json({error: 'Post not found'});
    }
});

router.put('/:id', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
      res.status(400).json({error: 'You must provide data to update a post'});
      return;
    }
  
    if (!postInfo.newTitle && !postInfo.newContent) {
      res.status(400).json({error: 'You must provide either newTitle, newContent, or both'});
      return;
    }
  
    try {
        await postData.getById(req.params.id);
    } catch (e) {
        res.status(404).json({error: "post not found"});
        return;
    }

    try {
        const post = await postData.update(req.params.id, postInfo.newTitle, postInfo.newContent);
        res.json(post);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await postData.getById(req.params.id);
    } catch (e) {
        res.status(404).json({error: "post not found"});
        return;
    }
    try {
        const post = await postData.delete(req.params.id);
        res.json(post);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
