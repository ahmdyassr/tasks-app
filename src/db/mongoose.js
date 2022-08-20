const mongoose = require('mongoose')
const validator = require('validator')
const connectionURL = 'mongodb+srv://ahmdyassr:0109105349@todoa-app.lrnbe.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionURL);

// User model

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length <= 6) {
        throw new Error('Password length mustn\'t less than 6')
      }

      if (value.includes('password')) {
        throw new Error('Choose a stronger password')
      }
    }
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!')
      }
    }
  }
})

const person = new User({
  name: 'Rock',
  age: 24,
  email: 'rock@desert.com',
  password: 'yrhgfgjsknd'
})

person
.save()
.then( (r) => {
  console.log(r)
})
.catch( (e) => {
  console.log(e)
})

// Task Model

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const randomTask = new Task({
  description: 'This is a new task',
  completed: false
})

randomTask.save()
  .then( (r) => {
    console.log(r)
  })
  .catch( (e) => {
    console.log(e)
  })