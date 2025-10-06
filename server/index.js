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
    const cartCollections = database.collection("carts");
    const orderCollections = database.collection("orders");
    const pendingOrdersCollection = database.collection("pendingOrders");
    const usersCollection = database.collection("users");
    const progressOrdersCollections = database.collection("progressOrders");




    //Get all coffees
    app.get('/coffee', async (req, res) => {
      const coffee = await coffeesCollections.find().toArray();
      res.send(coffee);
    });


    // Products add and get api

    app.post('/coffee', async (req, res) => {
      const data = req.body
      console.log(data)
      const result = await coffeesCollections.insertOne(data)
      res.send(result)
    })




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

    // Update user's display name
app.put("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const { displayName } = req.body;

    const result = await usersCollection.updateOne(
      { email },
      { $set: { displayName } }
    );

    res.send({
      success: true,
      message: "Name updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error updating name:", error);
    res.status(500).send({ error: "Failed to update name" });
  }
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
    app.get("/cart/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { userEmail: email };
    const cartItems = await cartCollections.find(query).toArray();
    res.send(cartItems);
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).send({ error: "Failed to fetch user cart" });
  }
});

    // Delete item from cart
    app.delete("/cart/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollections.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).send({ error: "Failed to delete cart item" });
  }
});

//Clear all cart items for a specific user
app.delete("/cart/clear/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { userEmail: email };
    const result = await cartCollections.deleteMany(query);
    res.send(result);
  } catch (error) {
    console.error("Error clearing user cart:", error);
    res.status(500).send({ error: "Failed to clear user cart" });
  }
});


// Add new pending order
app.post("/pending-orders", async (req, res) => {
  try {
    console.log("Incoming Pending Order:", req.body);

    const order = req.body;

    if (!order || !order.items || order.items.length === 0) {
      return res.status(400).send({ error: "Order data is invalid" });
    }

    const result = await pendingOrdersCollection.insertOne(order);
    res.status(201).send({
      success: true,
      message: "Pending order placed successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating pending order:", error);
    res.status(500).send({ error: "Failed to create pending order" });
  }
});

// Get user orders by email (searches across all collections)
app.get('/user/orders/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const query = { customerEmail: email }; // or userEmail - match your field name

    // Search all three collections
    const [pendingOrders, progressOrders, completedOrders] = await Promise.all([
      pendingOrdersCollection.find(query).toArray(),
      progressOrdersCollections.find(query).toArray(),
      orderCollections.find(query).toArray()
    ]);

    // Combine all orders
    const allUserOrders = [
      ...pendingOrders,
      ...progressOrders,
      ...completedOrders
    ];

    // Sort by date (newest first)
    allUserOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    res.send(allUserOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});




//Add new order
app.post("/orders", async (req, res) => {
  try {
    console.log("Incoming Order:", req.body);

    const order = req.body;

    if (!order || !order.items || order.items.length === 0) {
      return res.status(400).send({ error: "Order data is invalid" });
    }

    const result = await orderCollections.insertOne(order);
    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Failed to create order" });
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
