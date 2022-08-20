//
// CRUD Operations
//

const { MongoClient, ObjectId } = require('mongodb')
const connectionURL = 'mongodb+srv://ahmdyassr:0109105349@todoa-app.lrnbe.mongodb.net/?retryWrites=true&w=majority';
const databaseName= 'tasks-app';

MongoClient.connect(connectionURL, {useNewUrlParser: true},(e, client) => {
  if (e) {
    return console.log('Error connecting to db!')
  }

  const db = client.db(databaseName)

  db.collection('tasks').deleteMany({
    completed: false
  }).then( (r) => {
    console.log(r)
  }).catch( (e) => {
    console.log(e)
  })
})






