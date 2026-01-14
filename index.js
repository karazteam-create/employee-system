const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load companies data
const dataPath = path.join(__dirname, "data", "companies.json");
let companies = [];
if (fs.existsSync(dataPath)) {
  companies = JSON.parse(fs.readFileSync(dataPath));
} else {
  fs.writeFileSync(dataPath, JSON.stringify(companies, null, 2));
}

// Helper function
function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(companies, null, 2));
}

// Home page
app.get("/", (req, res) => {
  res.render("index", { companies });
});

// Admin panel
app.get("/admin", (req, res) => {
  res.render("admin", { companies });
});

// Add company
app.post("/admin/addCompany", (req, res) => {
  const { name } = req.body;
  if (!name) return res.send("Company name is required!");
  companies.push({ name, employees: [] });
  saveData();
  res.send(`Company "${name}" added successfully!`);
});

// Add employee
app.post("/admin/addEmployee", (req, res) => {
  const { company, fullName, idNumber, passportNumber, workCardNumber, personalNumber, unifiedNumber, visaNumber } = req.body;
  const comp = companies.find(c => c.name === company);
  if (!comp) return res.send("Company not found!");
  comp.employees.push({
    fullName,
    idNumber,
    passportNumber,
    workCardNumber,
    personalNumber,
    unifiedNumber,
    visaNumber,
    documents: []
  });
  saveData();
  res.send(`Employee "${fullName}" added successfully!`);
});

// Add document
app.post("/admin/addDocument", (req, res) => {
  const { company, employee, name, issueDate, expiryDate } = req.body;
  const comp = companies.find(c => c.name === company);
  if (!comp) return res.send("Company not found!");
  const emp = comp.employees.find(e => e.fullName === employee);
  if (!emp) return res.send("Employee not found!");
  emp.documents.push({ name, issueDate, expiryDate });
  saveData();
  res.send(`Document "${name}" added to employee "${employee}" successfully!`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
