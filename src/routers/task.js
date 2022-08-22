const express = require('express')
const Task = require('../models/task')
const router = express.Router()

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save();
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every( (update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Not a valid operation'})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id);
    updates.forEach( (update) => task[update] = req.body[update])
    await task.save()

    if (!task) {
      return res.status(404).send('Task not found')
    }

    res.status(200).send(task)
  } catch(e) {
    console.log(e)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send('Not found')
    }

    res.status(200).send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

module.exports = router