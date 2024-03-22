import { connectDB } from "@/db";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs"
import { sendMail } from "@/helpers/mailer";

connectDB();


export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { username, email, password } = reqBody;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        };

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = new User({ username, email, password: hashedPassword });

        const savedUser = await user.save();
        console.log(savedUser);

        await sendMail({ email, emailType: "verification", userId: user._id });

        return NextResponse.json({ message: "User created successfully", success: true, user: savedUser }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
