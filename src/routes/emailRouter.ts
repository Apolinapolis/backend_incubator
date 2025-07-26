import express, { Request, Response } from 'express'


export const emailRouter = express.Router()


emailRouter.post('/send', async (req: Request, res: Response) => {

    const nodemailer = require("nodemailer");

    // Create a transporter for SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'apolinapolis@gmail.com',
            pass: 'pass',
        },
    });

    (async () => {
        try {
            const info = await transporter.sendMail({
                from: '"Example Team" <team@example.com>', // sender address
                to: "alice@example.com, bob@example.com", // list of receivers
                subject: "Hello", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.error("Error while sending mail", err);
        }
    })();

    res.send({
        'email': req.body.mail,
        'message': req.body.message,
        'subject': req.body.subject
    })
})