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



        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });

        const mailOptions = {
            from: 'demo@gmail.com',
            to: email,
            subject: emailType === "verification" ? "Verify your email" : "Reset your password",
            html: `
            <p>Click<a href="${process.env.DOMAIN}/verifyemail?token=${hashed}">here</a>to ${emailType === "verification" ? "Verify your email" : "Reset your password"}
                or copy and paste this link in your browser:
                <br />
                ${process.env.DOMAIN}/verifyemail?token=${hashed}
            </p>`
        };


        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};