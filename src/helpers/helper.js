const nodemailer = require('nodemailer');
const config = require('config');


async function sendEmail(to, subject='', text='', html=''){
    const smtpOptions = config.get('smtpOptions');
    const from = smtpOptions.auth.user;
    const transporter = nodemailer.createTransport(smtpOptions);

    let mailOptions = {
        from: `Não Responda <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    }

    return await transporter.sendMail(mailOptions);
}

module.exports = {
    sendEmail
}