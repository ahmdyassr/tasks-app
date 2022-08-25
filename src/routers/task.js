//
// Task Router
//

const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get tasks
// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = (req.query.completed === 'true')
  } 

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        perDocumentLimit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })

    res.send(req.user.tasks)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get task 
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({
      _id, 
      author: req.user._id
    })

    if (!task) {
      res.status(404).send()
    }
    
    res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every( (update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Not a valid operation'})
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!task) {
      return res.status(404).send('Task not found')
    }

    updates.forEach( (update) => task[update] = req.body[update])
    await task.save()

    res.status(200).send(task)
  } catch(e) {
    console.log(e)
  }
})


// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    })

    if (!task) {
      return res.status(404).send('Not found')
    }

    res.status(200).send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

module.exports = router