const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

app.use(cors());
app.use(express.json());

const datas = require("./Data/spatiolData.json")

// fozlerabbishuvo
// bhSiq2ymprfYfAbs
// KidsLand
// 2kMDcm0RtuViiUH1



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://KidsLand:2kMDcm0RtuViiUH1@kidsland.c47qxlr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const kidsSpecialCollection = client.db("kedsCollection").collection("spacialCollection");


    app.get("/specialDats/:gender", async (req, res) => {
      const gender = req.params.gender;
      if (gender === "all") {
        const result = await kidsSpecialCollection.find().toArray();
        res.send(result)
      }
      else {
        const query = { gender: gender }
        const result = await kidsSpecialCollection.find(query).toArray();
        res.send(result)
      }

    })









    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





// app.get("/specialDats", async (req, res) => {
//   res.send(datas)
// })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})