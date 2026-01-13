const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// ضبط Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// تحميل البيانات
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, "data/companies.json")));

// دالة لحساب الأيام بين تاريخ اليوم وتاريخ الانتهاء
function calculateDaysRemaining(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // فرق بالأيام
}

// تجهيز بيانات إضافية لكل مستند لكل موظف
companies.forEach(company => {
  company.employees.forEach(emp => {
    emp.documents.forEach(doc => {
      doc.daysRemaining = calculateDaysRemaining(doc.expiryDate);
      doc.expiringSoon = doc.daysRemaining <= 30 && doc.daysRemaining >= 0;
    });
  });
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.render("index", { companies });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
