// implement your posts router here
// Bring in express server
const express = require('express');
// Use express.Router method to make a router 
const router = express.Router();
// Pull in helper functions to help make HTTP requests
const Posts = require('./posts-model');

router.get('/', async (req, res) => {
    // pull in necessary data - n/a
    // conditionals to handle proper data format - try/catch
    // call Posts methods to help with request - .find()
    try  {
        const posts = await Posts.find()
        res.json(posts);
    } catch(err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get('/:id', async (req, res) => {
    // extract necessary data - id
    const {id} = req.params;
    // Conditionals to handle all proper data
    try {
        const postAtID = await Posts.findById(id);
        if(!postAtID) {
            res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
            res.json(postAtID);
        }
    } catch(err) {
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
})

router.post('/', async (req, res) => {
    // pull in data
    // conditionals
    // use methods from model
    try {
        const newPost = req.body;
        if(!newPost.title || !newPost.contents) {
            // Err 400 = BAD REQUEST
            // I think Code 422 is better for this scenario
            // 422 = Unprocessable Entity
            res.status(422).json({ message: "Please provide title and contents for the post" });
        } else {
            const updatedPosts = await Posts.insert(newPost);
            // Code 201, because something new was created!
            res.status(201).json(updatedPosts);
        }
    } catch(err) {
        res.status(500).json({ message: "There was an error while saving the post to the database" });
    }
})

router.put('/:id', (req, res) => {
    // pull in data
    const {id} = req.params;
    const updates = req.body;
    // conditionals
    // use methods
    if(!updates.title || !updates.contents) {
        res.status(422).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.update(id, updates)
          .then(response => {
            !response ? res.status(404).json({ message: "The post with the specified ID does not exist" }) : res.json(response);
          })
          .catch(err => {
              res.status(500).json({ message: err.message });
          })
    }
})

router.delete('/:id', async (req, res) => {
    // Pull in Data
    // Conditionals
    // Methods
    try {
        const {id} = req.params;
        const deletedPost = await Posts.remove(id);
        !deletedPost ? res.status(404).json({ message: "The post with the specified ID does not exist" }) : res.json(deletedPost);
    } catch(err) {
        res.status(500).json({ message: "The post could not be removed" });
    }
})

router.get('/:id/comments', async (req, res) => {
    // pull in data
    // conditionals
    // methods
    try {
        const {id} = req.params;
        const postComments = await Posts.findPostComments(id);
        !postComments ? res.status(404).json({ message: "The post with the specified ID does not exist" }) : res.json(postComments);
    } catch(err) {
        res.status(500).json({ message: "The comments information could not be retrieved" });
    }

})


module.exports = router;
