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
    const today = new Date();
    const companiesWithDays = companies.map(company => {
        const employees = company.employees.map(emp => {
            const documents = emp.documents.map(doc => {
                const expiry = new Date(doc.expiry_date);
                const issue = new Date(doc.issue_date);
                const timeDiff = expiry - today;
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                const daysAfterExpiry = daysRemaining < 0 ? daysRemaining : 0;
                return { ...doc, daysRemaining, daysAfterExpiry, issue_date: doc.issue_date, expiry_date: doc.expiry_date };
            });
            return { ...emp, documents };
        });
        return { ...company, employees };
    });
    res.render('index', { companies: companiesWithDays });
});
