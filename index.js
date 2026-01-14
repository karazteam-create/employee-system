const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Load companies data
const dataPath = path.join(__dirname, 'data', 'companies.json');

function loadData() {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
}

// Routes
app.get('/', (req, res) => {
    const companies = loadData();
    res.render('index', { companies });
});

app.get('/admin', (req, res) => {
    const companies = loadData();
    res.render('admin', { companies });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
