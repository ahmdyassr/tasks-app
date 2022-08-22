const express = require('express')
const User = require('../models/user')
const router = express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch(e) {
    res.status(400).send(e)
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users)
  } catch(e) {
    res.status(500).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch(e) {
    res.status(400).send('Couldn\'t find user')
  }
})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send()
    }

    res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const _id = req.params.id;

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Not a valid operation'})
  }

  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { 
      new: true, 
      runValidators: true 
    });

    if (!user) {
      return res.status(404).send()
    }

    res.status(200).send(user)
  } catch(e) {
    res.status(400).send
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).send('Not found')
    }

    res.status(200).send(user)
  } catch(e) {
    res.status(400).send(e)
  }
})


module.exports = router