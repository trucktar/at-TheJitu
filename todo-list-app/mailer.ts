import nodemailer from "nodemailer";

export default async function sendMail(to: string, message: { subject: string; html: string }) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.verify();
    await transporter.sendMail({ from: process.env.EMAIL, to: to, ...message });
}
