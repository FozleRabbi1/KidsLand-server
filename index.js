const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const FavouriteCollection = client.db("kedsCollection").collection("FavouriteCollection");
    const usersDataCollection = client.db("kedsCollection").collection("userCollection");
    const allDressCollection = client.db("kedsCollection").collection("allDressCollection");


    //===================[connect by register]==================>>>>>> users data collection Api from register
    app.post("/users", async (req, res) => {
      const usersData = req.body;
      const query = { email: usersData.email };
      const existingUser = await usersDataCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" })
      }
      else {
        const result = await usersDataCollection.insertOne(usersData)
        res.send(result)
      }
    })


    //===================[Connect by SpatioanCatagories section ]===================>>>>>>>>>> this dynamic API for spacial collention section
    app.get("/specialDats/:gender", async (req, res) => {
      const gender = req.params.gender;
      if (gender === "all") {
        const result = await kidsSpecialCollection.find().toArray();
        res.send(result)
        return
      }
      else {
        const query = { gender: gender.toLocaleLowerCase() }
        const result = await kidsSpecialCollection.find(query).toArray();
        res.send(result)
      }
    })

    // ===============[Connect by SpatioanCatagories section]==============>>>>> this API ADD favourite data coluction
    app.post("/favouriteProducts", async (req, res) => {
      const favouriteData = req.body;
      const result = await FavouriteCollection.insertOne(favouriteData)
      res.send(result)
    });


    // =================[connect bt nav bar]=============>>>>>>>>>>>>>>>>>>>> this API GET favourite data coluction
    app.get("/favouriteProducts", async (req, res) => {
      const email = req?.query?.email;
      const query = { email: email };
      const result = await FavouriteCollection.find(query).toArray();
      res.send(result)
    })

    //==================[connect bt nav bar delete button]=================>>>>>>>>>> This Api cunnect to NAV and delete favourite itemes 
    app.delete("/favouriteProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await FavouriteCollection.deleteOne(query);
      res.send(result)
    })


    // ===================>>>>>>>>> [all producet number api ,, connect with ( AllDressCollection.jsx ) ]
    app.get("/allProductNumber", async (req, res) => {
      const totalItems = await allDressCollection.estimatedDocumentCount()
      res.send(totalItems.toString())
    })

    // ===================>>>>>>>>> [dynamic producet collection api ,, connect with ( useAllDressCollection.jsx Hook ) ]
    app.get("/allDressCollection", async (req, res) => {
      const itemOffset = parseInt(req.query.itemOffset) || 0;
      const endOffset = parseInt(req.query.endOffset) || 12;
      const gender = req.query.selectedOption;
      
      if (gender === "All") {
        const productLength = (await allDressCollection.find().toArray()).length;
        const result = await allDressCollection.find().sort({ price: 1 }).skip(itemOffset).limit(endOffset - itemOffset).toArray();
        const finalResult = { productLength, result }
        res.send(finalResult);
        return
      }
      else {
        const query = { gender: gender.toLocaleLowerCase() }
        const productLength = (await allDressCollection.find(query).toArray()).length;
        const result = await allDressCollection.find(query).sort({ price: 1 }).skip(itemOffset).limit(endOffset - itemOffset).toArray();
        const finalResult = { productLength, result }
        res.send(finalResult);
      }

    });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})