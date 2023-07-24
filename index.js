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


    //==============================================>>>>>> users data collection Api from register
    app.post("/users", async (req, res) => {
      const usersData = req.body;
      console.log(usersData);
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


    //==================================================>>>>>>>>>> this dynamic API for spacial collention section
    app.get("/specialDats/:gender", async (req, res) => {
      const gender = req.params.gender;
      if (gender === "all") {
        const result = await kidsSpecialCollection.find().toArray();
        res.send(result)
        return
      }
      else {
        const query = { gender: gender }
        const result = await kidsSpecialCollection.find(query).toArray();
        res.send(result)
      }

    })

    // ===================================================>>>>>>>>>>>>>>>>>>>> this API ADD favourite data coluction
    app.post("/favouriteProducts", async (req, res) => {
      const favouriteData = req.body;
      const result = await FavouriteCollection.insertOne(favouriteData)
      res.send(result)
    });


    // ======================================================>>>>>>>>>>>>>>>>>>>> this API GET favourite data coluction
    app.get("/favouriteProducts", async (req, res) => {
      const email = req?.query?.email;
      const query = {email : email};
      const result = await FavouriteCollection.find(query).toArray();
      res.send(result)
    })

    // ============================>>>>>>>>>>>>>>just for practice,,,,,,,,,,,,,,,,,,,,  ======= এক cullection থেকে Id এনে অন্য cullection এ filter করে , তার সাথে  index number add করে তার পর data পাঠান হয়েছে,,,
    // app.get("/favouriteProducts", async (req, res) => {
    //   const FavouriteCollectionData = await FavouriteCollection.find().toArray();
    //   const query = { _id: { $in: FavouriteCollectionData.map(id => new ObjectId(id.productId)) } };
    //   const indexNumber = FavouriteCollectionData.map(imgIndex => imgIndex.imageIndexNumber)

    //   const kidsSpecialCollectionData = await kidsSpecialCollection.find(query).toArray();
    //   const updatedKidsSpecialCollectionData = kidsSpecialCollectionData.map((doc, index) => ({
    //     ...doc,
    //     indexNumber: indexNumber[index]
    //   }));
    //   res.send(updatedKidsSpecialCollectionData)
    // })



    //=================================================>>>>>>>>>> This Api cunnect to NAV and delete favourite itemes 
    app.delete("/favouriteProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await FavouriteCollection.deleteOne(query);
      res.send(result)
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