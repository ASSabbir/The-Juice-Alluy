const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://juice_alluy:0IkRHBBp1ZuH2pGh@cluster0.ohjfkao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//  MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    const database = client.db("JuiceAlluy")
    const coffeesCollections = database.collection("coffees")
    const usersCollections = database.collection("users");
    app.get('/coffee', async (req, res) => {
      const coffee = await coffeesCollections.find().toArray();
      console.log(coffee)
      res.send(coffee)
    })

    app.get('/users', async (req, res) => {
      const result = await usersCollections.find().toArray()
      res.send(result)
    })
    app.post('/users', async (req, res) => {
      const user = req.body
      const query = { email: user.email }
      const exgestingUser = await usersCollections.findOne(query)
      if (exgestingUser) {
        return res.send({ message: 'user already here' })
      }
      const result = await usersCollections.insertOne(user)
      res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send("This Is server of The Juice Alluy")
})

app.listen(port, () => {
  console.log('server is running')
})