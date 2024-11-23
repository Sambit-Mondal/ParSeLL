import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: `"ParSeLL" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};