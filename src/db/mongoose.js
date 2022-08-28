const mongoose = require('mongoose')
const connectionURL = process.env.MONGO_URI;
mongoose.connect(connectionURL);