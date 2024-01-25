import { sendEmail, processEmail } from "./send-email";

export const sendVerificationEmail = async function(user: any) {
    const data  = {
        username: user.username,
        token: user.verificationToken
    }

    const html = await processEmail("verification", data);
    await sendEmail(user.email, "Verify your account", html);
}