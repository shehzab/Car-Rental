// Placeholder function: log to console instead of sending a real email
const sendEmail = async ({ to, subject, message }) => {
  console.log(`📩 Mock email to: ${to}`);
  console.log(`📌 Subject: ${subject}`);
  console.log(`📝 Message: ${message}`);
};

export default sendEmail;
