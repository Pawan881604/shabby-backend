require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Load Twilio phone number from .env

if (!accountSid || !authToken || !fromPhoneNumber) {
  throw new Error('ACCOUNT_SID, AUTH_TOKEN, and TWILIO_PHONE_NUMBER must be set');
}

exports.mobile_otp = async (phone_no, msg) => {
  try {
    const message = await client.messages.create({
      body: `${msg}`,
      from: fromPhoneNumber, // Use the Twilio phone number from the environment variables
      to: phone_no, // Use the dynamic phone number passed to the function
    });
    console.log('Message sent successfully:', message.sid);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error; // Optionally re-throw the error if you want it to be handled elsewhere
  }
};
