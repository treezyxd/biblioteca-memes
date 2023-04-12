import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";

// criacao servidor

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// config do banco de dados (mongodb)
let db;
const mongoClient = new MongoClient(process.env.MONGO_URL);
mongoClient.connect()
  .then(() => db = mongoClient.db())
  .catch(err => console.log(err.message));

app.post('/memes', (req, res) => {
  const { description, image, category } = req.body;

  if(!description || !image || !category) {
    return res.status(422).send('Todos os dados sao obrigatorios!');
  }

  const newMeme = { description, image, category };
  db.collection('memes').insertOne(newMeme)
    .then(() => res.status(201).send('OK'))
    .catch(err => console.log(err.message));
});

app.get('/memes', (req, res) => {
  db.collection('memes').find().toArray()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

// app rodando
app.listen(process.env.PORT, () => console.log(`server running at port ${process.env.PORT}`));