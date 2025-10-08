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
        const usersCollection = database.collection("users");
        const progressOrderCollections = database.collection("progressOrders");
        const juiceCollection = database.collection("juice");
        const rejectedOrderCollections = database.collection("rejectedOrders");

        // -------------users api--------------

        //Get all users
        app.get('/users', async (req, res) => {
            try {
                const result = await usersCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        });

        //Add new user (with duplicate check)
        app.post('/users', async (req, res) => {
            try {
                const user = req.body;
                const query = { email: user.email };
                const existingUser = await usersCollection.findOne(query);
                if (existingUser) {
                    return res.send({ message: 'user already here' });
                }
                const result = await usersCollection.insertOne(user);
                res.send(result);
            } catch (error) {
                console.error("Error adding user:", error);

            }
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

        // ----------------users api end--------------

        // ----------------juice api--------------

        // get all juice items
        app.get('/juice', async (req, res) => {
            try {
                const juices = await juiceCollection.find().toArray();
                res.send(juices);
            } catch (error) {
                console.error("Error fetching juice items:", error);
                res.status(500).send({ message: "Failed to fetch juice items", error });
            }
        });

        // ----------------juice api end--------------

        // -------------------Cooffee api-------------------

        //Get all coffees
        app.get('/coffee', async (req, res) => {
            try {
                const coffee = await coffeesCollections.find().toArray();
                res.send(coffee);
            } catch (error) {
                console.error("Error fetching coffee items:", error);
            }
        });

        // Get all coffees
        app.get("/coffees", async (req, res) => {
            try {
                const coffees = await coffeesCollections.find().toArray();
                res.send(coffees);
            } catch (error) {
                console.error("Error fetching coffees:", error);
                res.status(500).send({ message: "Failed to fetch coffees" });
            }
        });

        //Get single coffee by ID
        app.get('/coffee/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const coffee = await coffeesCollections.findOne(query);
                if (!coffee) {
                    return res.status(404).send({ message: 'Coffee not found' });
                }
                res.send(coffee);
            } catch (error) {
                console.error('Error fetching coffee:', error);
                res.status(500).send({ message: 'Internal server error' });
            }
        });

        // Products add and get api
        app.post('/coffee', async (req, res) => {
            try {
                const data = req.body
                console.log(data)
                const result = await coffeesCollections.insertOne(data)
                res.send(result)
            } catch (error) {
                console.error('Error adding coffee:', error);

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

        app.get("/best_products", async (req, res) => {
            try {
                const result = await coffeesCollections.find({}).limit(4).toArray()
                console.log(result)
                res.send(result);
            } catch (error) {
                console.error("Error fetching best products:", error);
            }
        })

        // -------------------Cooffee api end-------------------

        // -------------------Cart api-------------------

        // Get all cart items
        app.get('/cart', async (req, res) => {
            try {
                const result = await cartCollections.find().toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
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

        // -------------------Cart api end-------------------

        // -------------------Order api-------------------

        // get orders
        app.get('/orders', async (req, res) => {
            try {
                const orders = await orderCollections.find().toArray();
                res.send(orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        })

        // Get user orders by email (searches across all collections)
        app.get('/user/orders/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const query = { customerEmail: email };

                // Search all three collections
                const [
                    pendingOrders,
                    progressOrders,
                    rejectedOrders,
                    completedOrders
                ] = await Promise.all([
                    pendingOrderCollections.find(query).toArray(),
                    progressOrderCollections.find(query).toArray(),
                    rejectedOrderCollections.find(query).toArray(),
                    orderCollections.find(query).toArray()
                ]);

                const allUserOrders = [
                    ...pendingOrders,
                    ...progressOrders,
                    ...rejectedOrders,
                    ...completedOrders
                ];

                allUserOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

                res.send(allUserOrders);
            } catch (error) {
                console.error("Error fetching user orders:", error);
                res.status(500).json({ error: "Failed to fetch user orders" });
            }
        });

        // Get orders by collection
        app.get('/orders/:collection', async (req, res) => {
            try {
                const collection = req.params.collection;
                let targetCollection;

                if (collection === "pending") targetCollection = pendingOrderCollections;
                else if (collection === "progress") targetCollection = progressOrderCollections;
                else if (collection === "completed") targetCollection = orderCollections;
                else if (collection === "rejected") targetCollection = rejectedOrderCollections;
                else return res.status(400).json({ error: "Invalid collection" });

                const orders = await targetCollection.find().toArray();
                res.send(orders);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch orders" });
            }
        });

        //Add new order
        app.post("/orders", async (req, res) => {
            try {
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


        // Add new pending order
        app.post("/pending-orders", async (req, res) => {
            try {
                console.log("Incoming Pending Order:", req.body);

                const order = req.body;

                if (!order || !order.items || order.items.length === 0) {
                    return res.status(400).send({ error: "Order data is invalid" });
                }

                const result = await pendingOrderCollections.insertOne(order);
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


        // Add new pending order
        app.post("/progress-orders", async (req, res) => {
            try {
                console.log("Incoming Progress Order:", req.body);

                const order = req.body;

                if (!order || !order.items || order.items.length === 0) {
                    return res.status(400).send({ error: "Order data is invalid" });
                }

                const result = await progressOrderCollections.insertOne(order);
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







        app.get("/best_products", async (req, res) => {
            const result = await coffeesCollections.find({}).limit(4).toArray()
            console.log(result)
            res.send(result);
        })



        // -------------------Experimental Routes-------------------



        // Update order status (moves between collections)
        app.patch('/orders/:id/status', async (req, res) => {
            try {
                const id = req.params.id;
                const { status, currentCollection } = req.body;

                // Validate ObjectId
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ error: "Invalid order ID" });
                }

                const query = { _id: new ObjectId(id) };

                // Determine source collection based on currentCollection parameter
                let sourceCollection;
                switch (currentCollection) {
                    case "pending":
                        sourceCollection = pendingOrderCollections;
                        break;
                    case "progress":
                        sourceCollection = progressOrderCollections;
                        break;
                    case "rejected":
                        sourceCollection = rejectedOrderCollections;
                        break;
                    case "completed":
                        sourceCollection = orderCollections;
                        break;
                    default:
                        return res.status(400).json({ error: "Invalid current collection" });
                }

                // Get order from source
                const order = await sourceCollection.findOne(query);
                if (!order) {
                    return res.status(404).json({
                        error: "Order not found",
                        details: `No order found with ID ${id} in ${currentCollection} collection`
                    });
                }

                // Update status and timestamp
                order.status = status;
                order.updatedAt = new Date().toISOString();

                // Determine destination collection based on new status
                let destinationCollection;
                switch (status) {
                    case "pending":
                        destinationCollection = pendingOrderCollections;
                        break;
                    case "progress":
                        destinationCollection = progressOrderCollections;
                        break;
                    case "completed":
                        destinationCollection = orderCollections;
                        break;
                    case "rejected":
                        destinationCollection = rejectedOrderCollections;
                        break;
                    default:
                        return res.status(400).json({ error: "Invalid status" });
                }

                // If source and destination are the same, just update
                if (sourceCollection === destinationCollection) {
                    await sourceCollection.updateOne(query, {
                        $set: {
                            status: status,
                            updatedAt: order.updatedAt
                        }
                    });
                } else {
                    // Move to destination collection
                    await destinationCollection.insertOne(order);
                    await sourceCollection.deleteOne(query);
                }

                res.json({
                    success: true,
                    message: "Order status updated successfully",
                    order: {
                        _id: order._id,
                        status: order.status,
                        updatedAt: order.updatedAt
                    }
                });
            } catch (error) {
                console.error("Error updating order status:", error);
                res.status(500).json({
                    error: "Failed to update order status",
                    details: error.message
                });
            }
        });


      

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