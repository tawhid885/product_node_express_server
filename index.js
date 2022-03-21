// Title : express and mongodb simple server 
// Author : Md. Shakil Hossen
// Data : 3 March 2022

// dependency 
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// port number 
const port = process.env.PORT || 4000;

// database
// user : my_user
// password : aJ8afq5JzDcNuB16


// database connection ----------------------
const uri = "mongodb+srv://my_user:aJ8afq5JzDcNuB16@cluster0.79qqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// client setup 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("E-Commerce");
        const productsCollections = database.collection("products");

        // create a document 
        app.post("/products", async (req, res) => {
            const addProduct = req.body;
            const result = await productsCollections.insertOne(addProduct);
            console.log("got new product ,", result);
            res.send("server post method running");
        })

        // display all data 
        app.get("/products", async (req, res) => {
            console.log("get data gitted");
            const cursor = productsCollections.find({});
            const allProducts = await cursor.toArray();
            console.log(allProducts);
            res.json(allProducts);
        })

        //display single data 
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const product = await productsCollections.findOne(query);
            res.json(product);
        })

        // delete single data 
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await productsCollections.deleteOne(query);
            console.log("deleted successfull", result);
            res.json(result);
        })

        //update single data 
        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: product.name,
                    des: product.des,
                    price: product.price
                }
            }

            const result = await productsCollections.updateOne(filter, updateDoc);
            console.log("detail is, ", req.body);
            res.json(result);
        })


    } finally {

    }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})