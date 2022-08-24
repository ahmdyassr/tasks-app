//
// User Model
//

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// Reference the user to the tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'author'
})

// Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!email) {
    throw new Error('Unable to login!')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Passowrd and Email don\'t match')
  }

  return user;
} 

// Generate Auth token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id:user._id.toString() }, 'thisismynewcourse');

  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token;
}

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}


// Hash passwords
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    user.password =  await bcrypt.hash(user.password, 8)
  }
  
  next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;

  await Task.deleteMany({
    author: user._id
  })

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User