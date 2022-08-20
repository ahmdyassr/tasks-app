const express = require('express');
require('./db/mongoose');
const User = require('./models/user')
const Task = require('./models/task')
const app = express();
const port = process.env.PORT || 3000;

// Auto parse incoming JSON to objects
app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save().then((u) => {
    res.status(201).send(u)
  }).catch((e) => {
    res.status(400).send(e)
  })
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.status(200).send(users)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/users/:id', (req, res) => {
  const _id = req.params.id;

  User.findById(_id).then((user) => {
    if (!user) {
      return res.status(404).send()
    }

    res.status(200).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save().then((t) => {
    res.status(201).send(t)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/tasks', (req, res) => {
  Task.find().then((t) => {
    res.status(200).send(t)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;

  Task.findById(_id).then((t) => {
    res.status(200).send(t)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})




