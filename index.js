const express =require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ot66xwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const postCollection =client.db("SoicalDB").collection("post")
        const commentCollection =client.db("SoicalDB").collection("comment")

        app.post('/post',async(req,res)=>{
            const data =req.body;
            const result =await postCollection.insertOne(data);
            res.send(result);
        })

        app.get('/post',async(req,res)=>{

            const posts =await postCollection.find().toArray();
            res.send(posts)
         
        })

        app.get('/post/:id',async(req,res)=>{
            const {id} =req.params;
            const post =await postCollection.findOne({_id : new ObjectId(id)})
            res.send(post)
        })
     
        app.post('/post/:postId/like', async (req, res) => {
            const { postId } = req.params;
            const { likeCount } = req.body;

            try {
                const result = await postCollection.updateOne(
                    { _id: new ObjectId(postId) },
                    { $set: { likeCount } }
                );
                res.send(result);
                console.log("hellow result ",result);
            } catch (error) {
                console.error("Error updating like count:", error);
                res.status(500).send("Error updating like count");
            }
        });

        app.post('/comment',async(req,res)=>{
            const data =req.body;
            const result =await commentCollection.insertOne(data);
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Social Media is Running")
})

app.listen(port,()=>{
    console.log(`Socila media is Running On port ${port}`);
})