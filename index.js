const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndxdp2s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const assignmentCollection = client.db("online-study-group").collection("assignment");
    

   
      app.get("/myAssignments", async (req, res) => {
        // console.log(req.query);
        const query = { sellerEmail: req.query.email };
        const result = await assignmentCollection.find(query).toArray();
        res.send(result);
        // console.log(result);
      });

      app.get("/assignment/home/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await assignmentCollection.findOne(query);
        res.send(result);
      });
      app.patch("/assignment/:id", async (req, res) => {
        const id = req.params.id;
        const updateToy = req.body;
        // console.log(updateToy);
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
  
        const updateDoc = {
          $set: {
            toyName:updateToy.toyName,
            description: updateToy.description,
            price: updateToy.price,
            quantity: updateToy.quantity,
          },
        };
        const result = await assignmentCollection.updateOne(filter, updateDoc, option);
        res.send(result);
      });


      app.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await assignmentCollection.deleteOne(query);
        res.send(result);
      });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Online Study group server is running on port ${port}`);
});
