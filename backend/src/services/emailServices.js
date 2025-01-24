const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (to, subject, text) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY_EMAIL,
  });

  const sentFrom = new Sender(
  `noreply@${process.env.EMAIL_SENDER}`,
  'noreply'
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setText(text);

  await mailerSend.email.send(emailParams);
 
};

module.exports = { sendEmail };
