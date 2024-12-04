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

        app.post('/post',async(req,res)=>{
            const data =req.body;
            const result =await postCollection.insertOne(data);
            res.send(result);
        })

        app.get('/post',async(req,res)=>{

            const posts =await postCollection.find().toArray();
            res.send(posts)
         
        })
        app.patch('/post/:id/like', async (req, res) => {
            const { id } = req.params;
            try {
                const post = await postCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $inc: { likeCount: 1 } },
                    { returnDocument: 'after' }
                );
                console.log('Updated Post:', post.value); // নিশ্চিত করুন যে এখানে likeCount ফিল্ডটি আছে
                if (post.value) {
                    res.send(post.value); // সঠিক রেসপন্স পাঠান
                } else {
                    res.status(404).send({ error: 'Post not found' });
                }
            } catch (error) {
                console.error("Error updating like:", error);
                res.status(500).send({ error: 'Failed to like the post' });
            }
        });




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