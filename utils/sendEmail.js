const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
// const { mobile_otp } = require("./mobile_sms");

function createTransporter() {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_MAIL_HOST,
    port: 587,
    service: process.env.SMTP_MAIL_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL_USER,
      pass: process.env.SMTP_MAIL_PASS,
    },
  });

  return transporter;
}
exports.sendOtpMail = async (otp, email) => {
  try {
   
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_MAIL_USER,
      to: email,
      subject: "Gurez",
      text: `${otp} is your OTP to vaerify Gurez.com.For security reasons, DO NOT share this OTP with anyone.`,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

//--------forget password

exports.forget_password_mail = async (email, is_valid_user, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_MAIL_USER,
      to: email,
      subject: "Gurez",
      text: `${otp} is your OTP to vaerify Gurez.com.For security reasons, DO NOT share this OTP with anyone.`,
    };
    // const msg = `your otp is ${otp}`;

    // if (is_valid_user === "Phone_no") {
    //   await mobile_otp(user.user_id, msg);
    // }
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

exports.sendOrderEmail = async (order) => {
  const { shippingInfo, orderItem, mode } = order;
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_MAIL_USER,
      to: email,
      subject: "Gurez",
      html: `
      <html>
        <body>
          <p>Dear ${shippingInfo.fullName},</p>
          <p>Thank you for your order!</p>
          
          <h2>Shipping Information:</h2>
          <p>Name: ${shippingInfo.fullName}</p>
          <p>Phone: ${shippingInfo.phoneNo}</p>
          <p>Email: ${shippingInfo.email}</p>
          <p>Address: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}</p>
          
          <h2>Order Details:</h2>
          <p>Product Name: ${orderItem[0].name}</p>
          <p>Price: ${orderItem[0].price}</p>
          <p>Quantity: ${orderItem[0].quantity}</p>
          
          <h2>Payment Mode:</h2>
          <p>${mode}</p>
          
     
        </body>
      </html>
    `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

exports.sendOrderStatusEmail = async (orderStatus) => {
 
  const { status, orderItem, text } = orderStatus;
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_MAIL_USER,
      to: email,
      subject: "Order Dispatched: Track Your Shipment",
      html: `
      <html>
        <body>
        <h2>Shipping Status: ${status}</h2>
        <p>your Traking is #0000000</p>
        <p>${text}</p>
    
        <h2>Return Status:</h2>
        <p>If you need to return any items, please contact our customer support with your order details.</p>
        
          
     
        </body>
      </html>
    `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
