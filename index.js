<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Panel</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<style>
body { padding: 20px; background: #f9f9f9; }
h1 { text-align: center; margin-bottom: 20px; }
.alert { margin-top: 10px; }
</style>
</head>
<body>
<div class="container">
<h1>Admin Panel</h1>

<!-- Alerts -->
<div id="alerts"></div>

<!-- Add Company -->
<h3>Add Company</h3>
<form id="addCompanyForm" class="mb-3">
  <input type="text" class="form-control mb-2" placeholder="Company Name" id="companyName" required>
  <button class="btn btn-primary">Add Company</button>
</form>

<!-- Add Employee -->
<h3>Add Employee</h3>
<form id="addEmployeeForm" class="mb-3">
  <select class="form-select mb-2" id="employeeCompany" required>
    <option value="">Select Company</option>
    <% companies.forEach(c => { %>
      <option value="<%= c.name %>"><%= c.name %></option>
    <% }) %>
  </select>
  <input type="text" class="form-control mb-2" placeholder="Full Name" id="empName" required>
  <input type="text" class="form-control mb-2" placeholder="ID Number" id="empID" required>
  <input type="text" class="form-control mb-2" placeholder="Passport Number" id="empPassport">
  <input type="text" class="form-control mb-2" placeholder="Work Card Number" id="empWorkCard">
  <input type="text" class="form-control mb-2" placeholder="Personal Number" id="empPersonal">
  <input type="text" class="form-control mb-2" placeholder="Unified Number" id="empUnified">
  <input type="text" class="form-control mb-2" placeholder="Visa Number" id="empVisa">
  <button class="btn btn-success">Add Employee</button>
</form>

<!-- Add Document -->
<h3>Add Document</h3>
<form id="addDocumentForm" class="mb-3">
  <select class="form-select mb-2" id="docCompany" required>
    <option value="">Select Company</option>
    <% companies.forEach(c => { %>
      <option value="<%= c.name %>"><%= c.name %></option>
    <% }) %>
  </select>
  <select class="form-select mb-2" id="docEmployee" required>
    <option value="">Select Employee</option>
  </select>
  <input type="text" class="form-control mb-2" placeholder="Document Name" id="docName" required>
  <input type="date" class="form-control mb-2" id="docIssue" required>
  <input type="date" class="form-control mb-2" id="docExpiry" required>
  <button class="btn btn-warning">Add Document</button>
</form>

<div id="message" class="mt-3"></div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
const companies = <%- JSON.stringify(companies) %>;

// Update Employee dropdown when selecting company for document
$('#docCompany').on('change', function() {
  const companyName = this.value;
  const company = companies.find(c => c.name === companyName);
  const empSelect = $('#docEmployee');
  empSelect.empty().append('<option value="">Select Employee</option>');
  if (company) company.employees.forEach(emp => empSelect.append(`<option value="${emp.fullName}">${emp.fullName}</option>`));
});

// Add Company
$('#addCompanyForm').on('submit', function(e) {
  e.preventDefault();
  const name = $('#companyName').val();
  $.post('/admin/addCompany', { name }, res => {
    $('#message').text(res);
    location.reload();
  });
});

// Add Employee
$('#addEmployeeForm').on('submit', function(e) {
  e.preventDefault();
  const data = {
    company: $('#employeeCompany').val(),
    fullName: $('#empName').val(),
    idNumber: $('#empID').val(),
    passportNumber: $('#empPassport').val(),
    workCardNumber: $('#empWorkCard').val(),
    personalNumber: $('#empPersonal').val(),
    unifiedNumber: $('#empUnified').val(),
    visaNumber: $('#empVisa').val(),
    documents: []
  };
  $.post('/admin/addEmployee', data, res => {
    $('#message').text(res);
    location.reload();
  });
});

// Add Document
$('#addDocumentForm').on('submit', function(e) {
  e.preventDefault();
  const data = {
    company: $('#docCompany').val(),
    employee: $('#docEmployee').val(),
    name: $('#docName').val(),
    issueDate: $('#docIssue').val(),
    expiryDate: $('#docExpiry').val()
  };
  $.post('/admin/addDocument', data, res => {
    $('#message').text(res);
    location.reload();
  });
});

// Check Expiry Alerts
function checkExpiryAlerts() {
  let alertsHtml = '';
  companies.forEach(c => {
    c.employees.forEach(e => {
      e.documents.forEach(d => {
        const today = new Date();
        const expiry = new Date(d.expiryDate);
        const diffDays = Math.floor((expiry - today) / (1000*60*60*24));
        if (diffDays <= 30 && diffDays >= 0) {
          alertsHtml += `<div class="alert alert-warning">
            Document "<strong>${d.name}</strong>" of employee "<strong>${e.fullName}</strong>" in company "<strong>${c.name}</strong>" expires in <strong>${diffDays} day(s)</strong>.
          </div>`;
        } else if (diffDays < 0) {
          alertsHtml += `<div class="alert alert-danger">
            Document "<strong>${d.name}</strong>" of employee "<strong>${e.fullName}</strong>" in company "<strong>${c.name}</strong>" has expired!
          </div>`;
        }
      });
    });
  });
  $('#alerts').html(alertsHtml);
}

// Call on page load
checkExpiryAlerts();
</script>
</body>
</html>
