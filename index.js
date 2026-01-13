const express = require("express");
const app = express();
const path = require("path");

// ضبط مجلد الـ Views بدقة
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// صفحة رئيسية
app.get("/", (req, res) => {
  res.render("index", { message: "Employee System is working!" });
});

// منفذ السيرفر
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
