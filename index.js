const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// ضبط مجلد الـ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// تحميل بيانات الشركات من ملف JSON
const companies = JSON.parse(fs.readFileSync(path.join(__dirname, "data/companies.json")));

// صفحة رئيسية
app.get("/", (req, res) => {
  res.render("index", { companies });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
