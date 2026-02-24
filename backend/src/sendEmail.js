import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASS   
            }
        });


        const info = await transporter.sendMail({
            from: `"CreatorConnect" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                     <h2>${subject}</h2>
                     <p>${text}</p>
                   </div>`
        });

        console.log("Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};


export const sendOtpEmail = async (email, otp) => {
    const subject = "Your OTP for CreatorConnect";
    const text = `Your OTP is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`;
    
    return await sendEmail(email, subject, text);
};
