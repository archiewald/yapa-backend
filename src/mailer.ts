import * as nodemailer from "nodemailer";
import * as mgTransport from "nodemailer-mailgun-transport";
import Mail from "nodemailer/lib/mailer";

let transporter: Mail;

export async function initMailer() {
  if (process.env.NODE_ENV === "production") {
    const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;
    transporter = nodemailer.createTransport(
      mgTransport({
        auth: {
          domain: MAILGUN_DOMAIN!,
          api_key: MAILGUN_API_KEY!,
        },
        host: "api.eu.mailgun.net",
      })
    );

    return;
  }

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
    from: "Yet Another Pomodoro App <artur@kozubek.dev>", // sender address
  });

  console.debug("Message sent: %s", info.messageId);
  console.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
