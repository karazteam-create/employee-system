const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load companies data
const companiesFile = path.join(__dirname, 'data', 'companies.json');
let companies = [];
if (fs.existsSync(companiesFile)) {
    companies = JSON.parse(fs.readFileSync(companiesFile, 'utf8'));
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { companies });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
