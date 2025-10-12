import nodemailer from "nodemailer";

const OTP_STORE = new Map<string, { otp: string; expiresAt: number }>();

export const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

export const storeOtp = (email: string, otp: string) => {
  OTP_STORE.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
};

export const verifyOtp = (email: string, otp: string): boolean => {
  const record = OTP_STORE.get(email);
  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;
  return record.otp === otp;
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // e.g. noreply@gmail.com
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Silent Voice Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Admin Login OTP",
    html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Expires in 5 minutes</p>`,
  });
};
