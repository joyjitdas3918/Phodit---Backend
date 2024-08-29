const axios = require('axios');
const connectToMongo=require('./db');

const express = require('express')

var cors=require('cors')

connectToMongo();

const app = express()
const port = 5000
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/images',require('./routes/images'))

app.listen(port, () => {
  console.log(`Phodit backend listening on port ${port}`)
})

const url = `https://backend-6abz.onrender.com/`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

//Reloader Function
function reloadWebsite() {
  axios.get(url)
    .then(response => {
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

setInterval(reloadWebsite, interval);
