import * as nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

let transporter: Mail;

export async function initMailer() {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

export async function sendMail(options: Omit<Mail.Options, "from">) {
  const info = await transporter.sendMail({
    ...options,
    from: '"🍅 Yet Another Pomodoro App" <yapa@kozubek.dev>', // sender address
  });

  console.debug("Message sent: %s", info.messageId);
  console.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
