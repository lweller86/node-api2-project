// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Post.find()
        .then(found => {
            res.json(found)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.messag,
                stack: err.stack,
            })
        })
})
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const postsById = await Post.findById(id)
        if (!postsById) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            res.json(postsById)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "The posts information could not be retrieved",
            err: err.messag,
            stack: err.stack,
        })
    }
})
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(updatedPost => {
                res.status(201).json(updatedPost)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The posts information could not be retrieved",
                    err: err.messag,
                    stack: err.stack,
                })
            })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const postsById = await Post.findById(id)
        if (!postsById) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(id)
            res.json(postsById)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.messag,
            stack: err.stack,
        })
    }

})
router.put('/:id', async (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Post.findById(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The posts information could not be retrieved",
                    err: err.messag,
                    stack: err.stack,
                })
            })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    try {
        const postsById = await Post.findById(id)
        if (!postsById) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const postedComments = await Post.findPostComments(id)
            res.json(postedComments)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.messag,
            stack: err.stack,
        })
    }
}

)

module.exports = router