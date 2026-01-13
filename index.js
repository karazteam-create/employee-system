const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// حفظ البيانات على companies.json
function saveData() {
  fs.writeFileSync("./data/companies.json", JSON.stringify(companies, null, 2));
}

// صفحة الإدارة
app.get("/admin", (req, res) => {
  res.render("admin", { companies });
});

// إضافة شركة
app.post("/admin/addCompany", (req, res) => {
  const { name } = req.body;
  companies.push({ name, employees: [] });
  saveData();
  res.send(`Company "${name}" added successfully!`);
});

// إضافة موظف
app.post("/admin/addEmployee", (req, res) => {
  const { company, fullName, idNumber, passportNumber, workCardNumber, personalNumber, unifiedNumber, visaNumber } = req.body;
  const comp = companies.find(c => c.name === company);
  if (!comp) return res.send("Company not found!");
  comp.employees.push({ fullName, idNumber, passportNumber, workCardNumber, personalNumber, unifiedNumber, visaNumber, documents: [] });
  saveData();
  res.send(`Employee "${fullName}" added successfully!`);
});

// إضافة مستند
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
