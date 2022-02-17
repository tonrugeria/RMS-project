const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.get("/", (req, res) => {
  res.send("start na tayo")
})

app.listen(3000, () => {
  console.log(`Server is running on PORT 3000`)
})