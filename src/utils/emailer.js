import nodemailer from "nodemailer";

export default function emailer() {
  const createTrans = () => {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "fe9b8fceb9432a",
        pass: "c1eec84f149b54",
      },
    });
    return transport;
  };

  const sendMail = async (userEmail, subject, message) => {
    const transporter = createTrans();
    const info = await transporter.sendMail({
      from: `"Nataly eCommerce"<martinkremi@gmail.com>`,
      to: userEmail,
      subject,
      html: message,
    });
    console.log("Message sent: %s", info.messageId);
    return;
  };
  return { sendMail };
}
