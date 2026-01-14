// ====== Dependencies ======
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

// ====== View Engine ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// ====== Body Parser ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ====== Load Companies Data ======
const dataPath = path.join(__dirname, "data", "companies.json");
let companies = [];
if (fs.existsSync(dataPath)) {
  companies = JSON.parse(fs.readFileSync(dataPath));
} else {
  fs.writeFileSync(dataPath, JSON.stringify(companies, null, 2));
}

// ====== Helper Function ======
function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(companies, null, 2));
}

// ====== Routes ======

// Home Page - Show Table
app.get("/", (req, res) => {
  res.render("index", { companies });
});

// Admin Panel
app.get("/admin", (req, res) => {
  res.render("admin", { companies });
});

// Add Company
app.post("/admin/addCompany", (req, res) => {
  const { name } = req.body;
  if (!name) return res.send("Company name is required!");
  companies.push({ name, employees: [] });
  saveData();
  res.send(`Company "${name}" added successfully!`);
});

// Add Employee
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

// Add Document
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

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
