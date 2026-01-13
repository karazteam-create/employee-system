const fs = require("fs");
require("dotenv").config();
const { Resend } = require("@resend/resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// تحميل البيانات
const companies = JSON.parse(fs.readFileSync("./data/companies.json"));

// دالة لحساب الأيام
function calculateDaysRemaining(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// دالة إرسال البريد
async function sendExpiryEmail(employeeName, employeeId, documentName, expiryDate) {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.FROM_EMAIL, // هنا تحط إيميل المدير أو المسؤول
      subject: `⚠ Document Expiry Alert: ${documentName}`,
      html: `<p>Dear Admin,</p>
             <p>The document <b>${documentName}</b> for employee <b>${employeeName} (${employeeId})</b> will expire on <b>${expiryDate}</b>.</p>
             <p>Please take action to renew it.</p>`
    });
    console.log(`Email sent for ${employeeName} - ${documentName}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

// فحص المستندات وإرسال البريد
async function main() {
  for (const company of companies) {
    for (const emp of company.employees) {
      for (const doc of emp.documents) {
        const daysRemaining = calculateDaysRemaining(doc.expiryDate);
        if (daysRemaining <= 30 && daysRemaining >= 0) {
          await sendExpiryEmail(emp.fullName, emp.idNumber, doc.name, doc.expiryDate);
        }
      }
    }
  }
}

main();
