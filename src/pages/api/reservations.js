export default async function handler(req, res) {
  console.log(req.body);
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "no_reply@paz.co.cr", // Change to your recipient
    from: "roberto@paz.co.cr", // Change to your verified sender
    subject: "New Reservations",
    text: JSON.stringify(req.body),
    html: JSON.stringify(req.body),
  };
  const rest = await sgMail.send(msg);

  res.status(200).json({ result: rest.statusCode, msg: rest.body });
}
