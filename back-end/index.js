const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const { ObjectId } = require('mongodb');
const socketIo = require('socket.io');

const app = express();
const port = 3000;
const mongoURL = 'mongodb+srv://ryanvankriekinge:fastquiz123@cluster0.2mict.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = "FlashQuiz";
const server = http.createServer(app);
const io = socketIo(server);

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:8080', 'http://127.0.0.1:5500'],
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
            cookie: { secure: false,
                path: '/',
                maxAge: 1000 * 60 * 60 * 24
            }
        }));

        //Unauthenticated endpoints
        app.post('/addUser', async (req, res) => {
            const { username, email, password } = req.body;

            try {
                const existingName = await db.collection('Users').findOne({ username });
                const existingEmail = await db.collection('Users').findOne({ email });
                if (existingName) {
                    return res.status(400).json({ success: false, message: 'Username already exists' });
                }
                if (existingEmail) {
                    return res.status(400).json({ success: false, message: 'Email address already in use' });
                }
                const newUser = {
                    username,
                    email,
                    password
                };
                const result = await db.collection('Users').insertOne(newUser);
                res.json({ success: true, userId: result.insertedId.toString(), _id: result.insertedId });
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

        app.get('/lobby/:code', async (req, res) => {
            const lobbyCode = req.params.code;
            try {
                const lobby = await db.collection('Lobbies').findOne({ code: lobbyCode });
                if (!lobby) {
                    return res.status(404).json({ error: 'Lobby not found' });
                }
                const { _id, quizId, hostId, players } = lobby;
                res.json({
                    id: _id,
                    quizId,
                    hostId,
                    players,
                    lobbyCode
                });
            } catch (error) {
                console.error('Error fetching lobby:', error);
                res.status(500).json({ error: 'Server Error' });
            }
        });

        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            try {
                const user = await db.collection('Users').findOne({ username: username, password });
                if (user) {
                    req.session.user = {
                        userId: user._id,
                        username: username,
                        email: user.email
                    };
                    req.session.save(err => {
                        if (err) {
                            console.error('Session save error:', err);
                            return res.status(500).json({ success: false, message: 'Session save error' });
                        }
                        console.log('Session after login:', req.session);
                        res.json({ success: true, message: 'User successfully logged in', userId: user._id });
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
            console.log('Session in isAuthenticated:', req.session);
            if (req.session && req.session.user) {
                return next();
            } else {
                res.json({ success: false, message: 'User is not authenticated' });
            }
        }

        app.get('/check-login', isAuthenticated, (req, res) => {
            console.log('Checking login session:', req.session);
            res.json({ success: true,
                username: req.session.user.username,
                email: req.session.user.email,
                userId: req.session.user.userId,
            });
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

        // Authenticated endpoints

        app.post('/add-quiz',isAuthenticated, async (req, res) => {
            console.log('Session Data:', req.session);
            try {
                const username = req.session.user?.username;
                if (!username) {
                    return res.status(401).send({ message: 'User is not authenticated' });
                }
                const newQuiz = {
                    title: req.body.title,
                    userName: username,
                    questions: req.body.questions.map(question => ({
                        text: question.text,
                        answers: question.answers,
                        correctAnswer: question.correctAnswer
                    })),
                };

                const result = await db.collection('Quizzes').insertOne(newQuiz);
                res.status(201).send({ insertedId: result.insertedId });
            } catch (error) {
                console.error('Error inserting quiz into database:', error);
                res.status(400).send(error);
            }
        });

        app.get('/user-quizzes', isAuthenticated, async (req, res) => {
            const username = req.session.user.username;
            try {
                const items = await db.collection('Quizzes').find({ userName: username }).toArray();
                res.json({ success: true, quizzes: items });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Server Error' });
            }
        });

        //Socket.io
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            function generateCode(length) {
                const characterString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let code = '';
                for (let i = 0; i < length; i++) {
                    code += characterString.charAt(Math.floor(Math.random() * characterString.length));
                }
                return code;
            }

            socket.on('create-lobby', async (data) => {
                const { quizId, userId } = data;

                if (!userId) {
                    console.error('UserId is null. Cannot create lobby.');
                    return socket.emit('lobby-error', { message: 'UserId cannot be null' });
                }
                try {
                    let lobbyCode;
                    let exists = true;
                    while (exists) {
                        lobbyCode = generateCode(4);
                        const existingLobby = await db.collection('Lobbies').findOne({ code: lobbyCode });
                        exists = existingLobby !== null;
                    }
                    const lobby = {
                        quizId,
                        hostId: userId,
                        code: lobbyCode,
                        isStarted: false,
                        players: [userId]
                    };

                    const result = await db.collection('Lobbies').insertOne(lobby);
                    console.log('Lobby created and inserted into DB:', result.insertedId);

                    socket.emit('lobby-created', {
                        lobbyId: result.insertedId,
                        lobbyCode: lobbyCode,
                        players: lobby.players.length
                    });
                } catch (error) {
                    console.error('Error inserting lobby into DB:', error);
                    socket.emit('lobby-error', { message: 'Failed to create lobby' });
                }
            });



            socket.on('join-lobby', async (data) => {
                const { lobbyCode, userId } = data;
                if (!userId) {
                    console.error('No UserId provided');
                    return socket.emit('lobby-error', { message: 'UserId cannot be null' });
                }
                try {
                    const lobby = await db.collection('Lobbies').findOne({ code: lobbyCode });

                    if (!lobby) {
                        return socket.emit('lobby-error', { message: 'Lobby not found' });
                    }
                    if (!lobby.players.includes(userId)) {
                        await db.collection('Lobbies').updateOne(
                            { code: lobbyCode },
                            { $push: { players: userId } }
                        );
                    }
                    const updatedLobby = await db.collection('Lobbies').findOne({ code: lobbyCode });
                    const updatedPlayerCount = updatedLobby.players.length;
                    socket.join(lobbyCode);
                    io.to(lobbyCode).emit('player-joined', { playerCount: updatedPlayerCount });
                    console.log('Emitting lobby-joined for lobby:', lobbyCode);
                    socket.emit('lobby-joined', {
                        lobbyCode: lobbyCode,
                        players: updatedLobby.players
                    });

                } catch (error) {
                    console.error('Error joining lobby:', error);
                    socket.emit('lobby-error', { message: 'Failed to join lobby' });
                }
            });

            socket.on('start-quiz', async (data) => {
                console.log('start-quiz accessed in back-end');
                const { lobbyCode, userId } = data;

                try {
                    const lobby = await db.collection('Lobbies').findOne({ code: lobbyCode });
                    console.log('Lobby fetched:', lobby);

                    if (lobby) {
                        console.log('UserId:', userId, 'HostId:', lobby.hostId);
                        const quiz = await db.collection('Quizzes').findOne({ _id: new ObjectId(lobby.quizId) });
                        console.log('Questions available:', quiz.questions);
                        io.to(lobbyCode).emit('quiz-starting', {
                            title: quiz.title,
                            questions: quiz.questions
                        });
                        console.log('quiz-starting emitted');
                        setTimeout(() => {
                            const firstQuestion = quiz.questions[0];
                            io.to(lobbyCode).emit('next-question', firstQuestion);
                        }, 3000);
                    } else {
                        console.log('Lobby not found.');
                    }
                } catch (error) {
                    console.error('Error in start-quiz handler:', error);
                }
            });



            socket.on('next-question', async (data) => {
                const { lobbyCode, questionId } = data;

                try {
                    const lobby = await db.collection('Lobbies').findOne({ code: lobbyCode });
                    console.log('Lobby fetched:', lobby);
                    const quiz = await db.collection('Quizzes').findOne({ _id: new ObjectId(lobby.quizId) });
                    console.log('Quiz fetched:', quiz);
                    io.to(lobbyCode).emit('next-question', question);
                } catch (error) {
                    console.error('Error in next-question handler:', error);
                    socket.emit('quiz-error', { message: 'Error retrieving next question.' });
                }
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        // Start the server
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
