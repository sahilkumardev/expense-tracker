import { Resend } from "resend";

const resend = new Resend(process.env.RESNED_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  await resend.emails.send({
    from: "verification@resend.sahilkumardev.com",
    to,
    subject,
    text,
  });
}
