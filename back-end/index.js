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

        app.get('/users', async (req, res) => {
            try {
                const items = await db.collection('Users').find({}).toArray();
                res.json(items);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Server Error' });
            }
        });

        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            try {
                const user = await db.collection('Users').findOne({ name: username, password });
                if (user) {
                    req.session.user = { username: username };
                    req.session.save(err => {
                        if (err) {
                            console.error('Session save error:', err);
                            return res.status(500).json({ success: false, message: 'Session save error' });
                        }
                        res.json({ success: true, message: 'User successfully logged in' });
                    });
                } else {
                    res.json({ success: false, message: 'Incorrect password or username' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Server Error' });
            }
        });

        function isAuthenticated(req, res, next) {
            if (req.session && req.session.user) {
                return next();
            } else {
                res.json({ success: false, message: 'User is not authenticated' });
            }
        }

        app.get('/check-login', isAuthenticated, (req, res) => {
            res.json({ success: true, username: req.session.user.username });
        });

        app.post('/log-out', (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error ending session:', err);
                    return res.status(500).json({ success: false, message: 'Failed to logout' });
                }

                res.clearCookie('connect.sid');
                res.json({ success: true, message: 'Logged out successfully' });
            });
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