// Install dependencies using the following command:
// npm install express mongoose cors dotenv ejs

// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;;
const MONGO_URI = process.env.MONGO_URI ||'mongodb://host.docker.internal:27017/yourDatabaseName';

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Connection
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define a Mongoose Schema for your form data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index');  // Render the form
});

app.post('/submit', async (req, res) => {
    const { name, email, contact } = req.body;

    if (!name || !email || !contact) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const newUser = new User({ name, email, contact });
        await newUser.save();
        res.status(200).json({ message: 'User saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save user' });
    }
});


// Serve HTML using EJS templates
app.get("/", (req, res) => {
    res.render("index");
  });
  
  app.get("/product", (req, res) => {
    res.render("product");
  });
  
  // Navigation update in EJS
  app.locals.navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612" width="50" height="50">
                    <g sodipodi:docname="psa_logo.svg" inkscape:version="0.48.1 r9760" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape">
                        <path fill="#563D7C" d="M612 510c0 56.1-45.9 102-102 102H102C45.9 612 0 566.1 0 510V102C0 45.9 45.9 0 102 0h408c56.1 0 102 45.9 102 102v408z"/>
                        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="200" fill="white" text-anchor="middle" alignment-baseline="middle">PSA</text>
                    </g>
                </svg>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/product">Product</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
})
