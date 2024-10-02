const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const app = express();
const port = 3000;
const mongoURL = 'mongodb+srv://ryanvankriekinge:fastquiz123@cluster0.2mict.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = "FlashQuiz";

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        // Session configuration
        app.use(session({
            secret: 'setsecrethere',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false, path: '/' }
        }));

        //Unauthenticated endpoints
        app.post('/addUser', async (req, res) => {
            const { name, email, password } = req.body;

            try {
                const existingName = await db.collection('Users').findOne({ name });
                const existingEmail = await db.collection('Users').findOne({ email });
                if (existingName) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }
                if (existingEmail) {
                    return res.status(400).json({ success: false, message: 'Email address already in use' });
                }
                const newUser = {
                    name,
                    email,
                    password
                };
                const result = await db.collection('Users').insertOne(newUser);
                res.json({ success: true, userId: result.insertedId.toString() });
            } catch (error) {
                console.error('Error adding user:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        });
        //Authenticated Endpoints

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
