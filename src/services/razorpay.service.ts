// --- razorpay.service.ts ---
import axios from "axios";

const RAZORPAY_API = "https://api.razorpay.com/v1/payout-links";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export const createPayoutLink = async ({
  amountInRupees,
  userName,
  upiId,
}: {
  amountInRupees: number;
  userName: string;
  upiId: string;
}) => {
  const auth = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    RAZORPAY_API,
    {
      amount: amountInRupees * 100, // in paise
      currency: "INR",
      purpose: "Withdrawal Payout",
      method: "upi",
      receiver: {
        upi: {
          vpa: upiId,
        },
        name: userName,
      },
      send_sms: false,
      send_email: false,
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // includes payout_link_id and status
};
