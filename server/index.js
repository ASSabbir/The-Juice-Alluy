const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://juice_alluy:0IkRHBBp1ZuH2pGh@cluster0.ohjfkao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("JuiceAlluy");
    const coffeesCollections = database.collection("coffees");
    const usersCollections = database.collection("users");
    const cartCollections = database.collection("carts");

    //Get all coffees
    app.get('/coffee', async (req, res) => {
      const coffee = await coffeesCollections.find().toArray();
      res.send(coffee);
    });

    //Get single coffee by ID
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const coffee = await coffeesCollections.findOne(query);
      res.send(coffee);
    });

    //Get all users
    app.get('/users', async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result);
    });

    //Add new user (with duplicate check)
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollections.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already here' });
      }
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    // Add item to cart
    app.post('/cart', async (req, res) => {
      try {
        const cartItem = req.body;
        if (cartItem._id) {
          delete cartItem._id;
        }
        const result = await cartCollections.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send({ error: "Failed to add item to cart" });
      }
    });

    // Get all cart items
    app.get('/cart', async (req, res) => {
      const result = await cartCollections.find().toArray();
      res.send(result);
    });

    // Get cart items by user email
    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollections.find(query).toArray();
      res.send(result);
    });

    // Delete item from cart
    app.delete("/cart/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartCollections.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting from cart:", error);
        res.status(500).send({ error: "Failed to delete item from cart" });
      }
    });


    app.get("/best_products", async (req, res) => {
      const result = await coffeesCollections.find({}).limit(4).toArray()
      console.log(result)
      res.send(result);
    })








    console.log("Connected to MongoDB successfully!");


  } finally {
    // await client.close(); // keep connection open for server
  }
}
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send("This is the server of The Juice Alluy");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
