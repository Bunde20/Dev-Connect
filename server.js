const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false })); // Allows us to get data from req.body

app.get('/', (req, res) => res.send('API is Running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));