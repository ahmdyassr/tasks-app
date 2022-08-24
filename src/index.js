const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json()) // Auto parse incoming JSON to objects
app.use(userRouter)
app.use(taskRouter)

// Start Server
app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})



