const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

// Create new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch(e) {
    res.status(400).send(e)
  }
});

// Read my profile
router.get('/users/me', auth, async (req, res) => {
 res.send(req.user)
})

// Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user , token })
  } catch(e) { 
    res.status(400).send('Couldn\'t find user')
  }
})

// Logout from existing session
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter( (token) => {
      return token.token !== req.token
    })

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Logout from all sessions 
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Update user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Not a valid operation'})
  }

  try {
    updates.forEach( (update) => req.user[update] = req.user[update] )
    await req.user.save()
    res.status(200).send(req.user)
  } catch(e) {
    res.status(400).send
  }
})

// Remove profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch(e) {
    res.status(500).send(e)
  }
})


module.exports = router