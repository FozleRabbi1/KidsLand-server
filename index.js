const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

app.use(cors());
app.use(express.json());

const datas = require("./Data/spatiolData.json")


app.get("/specialDats", async (req, res)=>{
    res.send(datas)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})