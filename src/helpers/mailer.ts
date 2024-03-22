import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import nodemailer from "nodemailer";


export const sendMail = async ({ email, emailType, userId }: any) => {
    try {
        const hashed = await bcryptjs.hash(userId.toString(), 10);


        if (emailType === "verification") {
            await User.findByIdAndUpdate(userId,
                {
                    verificationToken: hashed,
                    verificationTokenExpires: Date.now() + 3600000
                })
        } else if (emailType === "forgotPassword") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashed,
                    forgotPasswordTokenExpires: Date.now() + 3600000
                })
        }


        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });


        const mailOptions = {
            from: 'demo@gmail.com',
            to: email,
            subject: emailType === "verification" ? "Email Verification" : "forgotPassword",
            html: "<b>Hello world?</b>", // html body
        };


        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};