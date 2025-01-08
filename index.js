import express from 'express';
import mongodb, { ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 2000;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const { MongoClient, ServerApiVersion } = mongodb;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${username}:${password}@cluster0.6zld8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    //? database collections ----------------------------------------------------->
    const marathon_collection = client.db('raceflow').collection('marathons');

    //? marathons apis ----------------------------------------------------------->
    app.get('/marathons', async(req, res) => {
        const marathons_data = marathon_collection.find();
        const marathons = await marathons_data.toArray();
        res.send(marathons);
    });

    
    app.post('/marathon', async(req, res) => {
        const marathon_data = req.body;
        const marathon = await marathon_collection.insertOne(marathon_data);
        res.send(marathon);
    });

    app.put('/marathon_update/:id', async(req, res) => {
        const marathon_update_id = req.params.id;
        const marathon_data = req.body;

        const marathon_filter = {_id: new ObjectId(marathon_update_id)};
        const marathon_options = {upsert: true};
        const marathon_update = {
            $set: {
                marathonTitle: marathon_data.marathonTitle,
                marathonImage: marathon_data.marathonImage,
                registrationStartDate: marathon_data.registrationStartDate,
                registrationEndDate: marathon_data.registrationEndDate,
                marathonStartDate: marathon_data.marathonStartDate,
                location: marathon_data.location,
                runningDistance: marathon_data.runningDistance,
                description: marathon_data.description,
                username: marathon_data.username,
                email: marathon_data.email,
                regCount: marathon_data.regCount
            },
        };

        const marathon_updated = await marathon_collection.updateOne(marathon_filter, marathon_update, marathon_options);
        res.send(marathon_updated);
    });

    app.delete('/marathon_delete/:id', async(req, res) => {
        const marathon_delete_id = req.params.id
        const marathon_query = {_id: new ObjectId(marathon_delete_id)};
        const remaining_marathon = await marathon_collection.deleteOne(marathon_query);
        res.send(remaining_marathon);
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


app.get('/', (req, res) => {
    res.send('server running on 2000');
});

app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`);
});