const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.GENIUS_CAR_USER}:${process.env.GENIUS_CAR_PASSWORD}@cluster0.dwmt3ch.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('genius-car').collection('service');
        const orderCollection = client.db('genius-car').collection('orders');

        //find all data from database
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //find one data from database
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //post order to database
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);

        })

        // get all orders from database
        // app.get('/orders', async(req, res) => {
        //     const query = {};
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders)
        // })

        // get orders from database by their email in query
        app.get('/orders', async(req, res)=>{
            let query = {};
            if(req.query.email){
                // request er bitor query pawa jay and tar modde ja diba tai thakbe
                query = { email : req.query.email};
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })


        // update states ordered from database
        app.patch('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const states = req.body.states;
            const query = { _id: ObjectId(id)};
            const updateDoc = {
                $set:{
                    states: states
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        })


        // delete orders from database
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

    } 
    catch (error) {
        console.log(error);
    }
}
run();

app.get('/', (req, res) => {
    res.send("Genius car server is running ")
})

app.listen(port, () => { });