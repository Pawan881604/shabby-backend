// const master_otp_model = require("../models/master_otp_model");

const otp_model = require("../models/otp_model");
const { generateRandomString } = require("./generateRandomString");

exports.generate_Otp = async (limit, user) => {
  const random_id = generateRandomString(8)
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  const existingOTPs = await otp_model.find({
    user_id:user.user_id,
    otp_status: "Active",
  });

  for (let otp of existingOTPs) {
    otp.otp_status = "Inactive";
    await otp.save();
  }
  let existingOTP = await otp_model.findOne({ user_id: [user.user_id] });

  // if (existingOTP) {
  //   existingOTP.otp = OTP;
  //   existingOTP.update_at = Date.now();

  //   await existingOTP.save();
  // } else {
    const modifiedOtp = OTP.length === 5 ? OTP + "1" : OTP;
  const otp_data_length = await otp_model.countDocuments();
  const otp_data = await otp_model.create({
    otp_id: `otp_${random_id}${otp_data_length}`,
    otp: modifiedOtp,
    user_id:user.user_id,
    update_at: Date.now(),
  });
  // }

  return OTP;
};


exports.verify_otp = async (otp, user_id) => {
  try {
    // Find the OTP details using a single query
    const otp_details = await otp_model.findOne({
      user_id: user_id,
      otp: Number(otp),
    });

    // Check if OTP details were found
    if (!otp_details) {
      throw new Error("OTP is invalid");
    }

    // Check if OTP status is inactive
    if (otp_details.otp_status === "Inactive") {
      throw new Error("OTP is invalid");
    }

    // Calculate the time difference in minutes
    const otp_modifed_date = new Date(otp_details.update_at);
    const currentTime = new Date();
    const time_Difference = (currentTime - otp_modifed_date) / (1000 * 60);

    // Check if OTP has expired
    if (time_Difference > 5) {
      throw new Error("OTP is expired");
    }

    // If OTP is valid, mark it as inactive and save
    otp_details.otp_status = "Inactive";
    await otp_details.save();

    // Return true indicating the OTP is valid
    return true;
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    throw error;
  }
};
