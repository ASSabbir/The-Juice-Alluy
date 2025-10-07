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
    const pendingOrderCollections = database.collection("pendingOrders");
    const progressOrderCollections = database.collection("progressOrders");



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

    // Update user by email
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email;
      const updatedUser = req.body;
      const filter = { email: email };
      const updateDoc = {
        $set: {
          displayName: updatedUser.displayName,
          photoURL: updatedUser.photoURL,
          role: updatedUser.role,
        },
      };
      const result = await usersCollections.updateOne(filter, updateDoc, {
        upsert: true,
      });
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








    /*


// -------------------!Important-------------------






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

    */





    app.get("/best_products", async (req, res) => {
      const result = await coffeesCollections.find({}).limit(4).toArray()
      console.log(result)
      res.send(result);
    })


    // -------------------Admin Routes-------------------





    //create orders
    app.post('/order', async (req, res) => {
      try {
        const order = req.body;
        const result = await orderCollections.insertOne(order);
        res.send(result);
      } catch (error) {
        console.error("Error fetching coffees:", error);
        res.status(500).json({ error: error.message });
      }
    });





    // get orders
    app.get('/orders', async (req, res) => {
      try {
        const orders = await orderCollections.find().toArray();
        res.send(orders);

      } catch (error) {
        console.error("Error fetching orders:", error);

      }
    })

    // Update coffee by ID
    app.put('/coffee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedProduct = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: updatedProduct
        };
        const result = await coffeesCollections.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error updating coffee:", error);
        res.status(500).json({ error: "Failed to update coffee" });
      }
    });

    // delete coffee
    app.delete('/coffees/:id', async (req, res) => {
      try {

        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeesCollections.deleteOne(query);
        res.send(result);
        console.log("✅ Delete route ready!");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });



    // -------------------Experimental Routes-------------------


    app.post('/orders', async (req, res) => {
      try {
        const orderData = req.body;
        const result = await pendingOrderCollections.insertOne(orderData);
        res.status(201).json({
          message: "Order placed successfully",
          orderId: result.insertedId
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
      }
    });

    // Update order status (moves between collections)
    app.patch('/orders/:id/status', async (req, res) => {
      try {
        const id = req.params.id;
        const { status, currentCollection } = req.body;
        const query = { _id: new ObjectId(id) };

        // Determine source collection
        let sourceCollection;
        if (currentCollection === "pending") sourceCollection = pendingOrderCollections;
        else if (currentCollection === "progress") sourceCollection = progressOrderCollections;
        else sourceCollection = orderCollections;

        // Get order from source
        const order = await sourceCollection.findOne(query);
        if (!order) return res.status(404).json({ error: "Order not found" });

        // Update status
        order.status = status;
        order.updatedAt = new Date().toISOString();

        // Determine destination collection
        let destinationCollection;
        if (status === "progress") destinationCollection = progressOrderCollections;
        else if (status === "completed") destinationCollection = orderCollections;
        else destinationCollection = pendingOrderCollections;

        // Move to destination
        await destinationCollection.insertOne(order);
        await sourceCollection.deleteOne(query);

        res.send({ message: "Order status updated successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
      }
    });

    // Get orders by collection
    app.get('/orders/:collection', async (req, res) => {
      try {
        const collection = req.params.collection;
        let targetCollection;

        if (collection === "pending") targetCollection = pendingOrderCollections;
        else if (collection === "progress") targetCollection = progressOrderCollections;
        else if (collection === "completed") targetCollection = orderCollections; // ✅ Add explicit check
        else return res.status(400).json({ error: "Invalid collection" }); // ✅ Handle invalid requests

        const orders = await targetCollection.find().toArray();
        res.send(orders);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
      }
    });







    // ----------------------Experimental Routes End-------------------



    // ----------------------Admin Routes End-------------------


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
