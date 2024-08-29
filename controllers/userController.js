const catchAsyncError = require("../middleware/catchAsyncError");
const usermodel = require("../models/user_model");
const ErrorHandler = require("../utils/errorhandler");
const { generate_Otp, verify_otp } = require("../utils/generatOtp");
const sendToken = require("../utils/jwtToken");
const ApiFetures = require("../utils/apiFeatuers");

const {
  sendOtpMail,
  forgetPassOtpMail,
  forget_password_mail,
} = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const master_otp_model = require("../models/master_otp_model");
const {
  valid_email_or_no,
  valid_login_email_or_no,
} = require("../utils/validate_user");
const { generateRandomString } = require("../utils/generateRandomString");
// const { mobile_otp } = require("../utils/mobile_sms");
// const crypto = require('crypto')

exports.Login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const is_valid_user = await valid_email_or_no(email);
  if (is_valid_user === "invalid") {
    return next(new ErrorHandler("Invalid phone number", 400));
  }
  const isExist = await usermodel.findOne({ email });

  if (!isExist) {
    return next(new ErrorHandler("Please valid email and password", 400));
  }

  const isPassMatch = await bcrypt.compare(password, isExist.password);

  console.log(isPassMatch);
  if (!isPassMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(isExist, 200, res);
});

exports.create_admin_user = catchAsyncError(async (req, res, next) => {
  const { email: useremail, uuid, password } = req.body;
  const email = useremail.toLowerCase();
  const random_id = generateRandomString(8);
  const is_valid_user = await valid_email_or_no(email);
  if (is_valid_user === "invalid") {
    return next(new ErrorHandler("Invalid email id", 400));
  }

  const isExist = await usermodel.findOne({ email });

  if (isExist) {
    return next(new ErrorHandler("Email id is exist", 400));
  }
  if (password.length < 8) {
    return next(
      new ErrorHandler("Password must be at least 8 characters long", 400)
    );
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const data = {
    user_id: `user_${random_id}${uuid}`,
    uuid,
    email,
    password: hashedPassword,
    is_verified: "Activate",
    authorize: "Yes",
    role: "admin",
  };
  let new_user = await usermodel.create(data);
  const all_users = await usermodel.find();
  const user_data = all_users.reverse();
  res.status(200).json({
    success: true,
    users: user_data,
  });
});

exports.create_user = catchAsyncError(async (req, res, next) => {
  const { phone_number, branches, uuid } = req.body;
  const parse_branch = JSON.parse(branches);
  const branch_ids = parse_branch.map((item) => item.id);
  const user_id_ = req.user._id;
  const random_id = generateRandomString(8);
  const is_valid_user = await valid_email_or_no("", phone_number);
  if (is_valid_user === "invalid") {
    return next(new ErrorHandler("Invalid phone no", 400));
  }
  const isExist = await usermodel.findOne({
    phone_number: phone_number,
    _id: { $ne: user_id_ },
  });
  if (isExist) {
    return next(new ErrorHandler("Phone no is exist", 400));
  }

  const data = {
    user_id: `user_${random_id}${uuid}`,
    uuid,
    phone_number,
    branch: branch_ids,
    is_verified: "Activate",
    authorize: "Yes",
    user: user_id_,
  };
  let new_user = await usermodel.create(data);
  const all_users = await usermodel.find();
  const user_data = all_users.reverse();
  res.status(200).json({
    success: true,
    users: user_data,
  });
});

//----- get users
exports.get_user = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 10;
  const count_users = await usermodel.countDocuments();

  const apiFetures = new ApiFetures(usermodel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);
  const users = await apiFetures.query;

  res.status(200).json({
    success: true,
    users: users,
    count_users: count_users,
    resultPerpage: resultPerpage,
  });
});

exports.update_user = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { user_data, branches } = req.body;
  const { phone } = user_data;
  const user_id_ = req.user._id;
  const is_valid_user = await valid_email_or_no("", phone);
  if (is_valid_user === "invalid") {
    return next(new ErrorHandler("Invalid phone no", 400));
  }
  const isExist = await usermodel.findOne({
    phone_number: phone,
    _id: { $ne: user_id_ },
  });
  if (isExist) {
    return next(new ErrorHandler("Phone no is exist", 400));
  }
  const parse_branch = JSON.parse(branches);
  const branch_ids = parse_branch.map((item) => item.id);
  const user = await usermodel.findOneAndUpdate(
    { user_id: id },
    { phone: phone, branch: branch_ids, update_at: new Date() },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  const all_users = await usermodel.find();
  const data = all_users.reverse();
  res.status(200).json({
    success: true,
    users: data,
  });
});

exports.user_password_reset = catchAsyncError(async (req, res, next) => {
  const { email: useremail, password } = req.body;
  const email = useremail.toLowerCase();

  // Check if the user exists
  const isexist = await usermodel.findOne({ email: email });
  if (!isexist) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update the user's password
  const user = await usermodel.findOneAndUpdate(
    { user_id: isexist.user_id },
    { password: hashedPassword, updated_at: new Date() }, // updated_at should be in camelCase for consistency
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  // Check if the update was successful
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }

  console.log("User password updated:", user);

  // Send success response
  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

//_________________________________user
//-------otp veryfication

//--------------------Ragister user

exports.User = catchAsyncError(async (req, res, next) => {
  const { name, email, uuid, phone_number } = req.body;
    
  const random_id = generateRandomString(8);
  const is_valid_user = await valid_email_or_no(email, phone_number);
  if (is_valid_user === "invalid") {
    return next(new ErrorHandler("Invalid phone number", 400));
  }
  const isExist = await usermodel.findOne({ phone_number });

  let new_user;
  if (!isExist) {
    new_user = await usermodel.create({
      user_id: `user_${random_id}${uuid}`,
      uuid,
      name,
      email,
      phone_number,
    });
  }

  const otp_id = `otp_${random_id}${uuid}`;
  const user_data = isExist ? isExist : new_user;
  const otp = await generate_Otp(6, user_data);
  console.log(otp);
  const msg = `${otp} is your OTP to vaerify Gurez.com.For security reasons, DO NOT share this OTP with anyone.`;
  // if (is_valid_user === "email") {
  //   await sendOtpMail(otp, email);
  // }
  // await mobile_otp(phone_number, msg);

  res.status(200).json({
    success: true,
    user_data,
  });
});

exports.otpVerification = catchAsyncError(async (req, res, next) => {
  const { otp, user_id } = req.body;

  const isValidOTP = await verify_otp(otp, user_id);
  if (!isValidOTP) {
    return next(new ErrorHandler("Otp not valid", 400));
  }
  const User = await usermodel.findOne({ user_id });
  User.is_verified = "Active";
  await User.save();
  sendToken(User, 201, res);
});

//----------resend--otp

exports.reSendOtp = catchAsyncError(async (req, res, next) => {
  // const User = await user.findOne({ uuid: req.query.user_uuid });

  // const otp = await generate_Otp(6, req.query.user_uuid);
  // const msg = `${otp} is your OTP to vaerify Gurez.com.For security reasons, DO NOT share this OTP with anyone.`;

  // // await mobile_otp(User.phone_number, msg);

  // await sendOtpMail(otp, User.email);
  res.status(200).json({
    success: true,
    message: "Otp Send",
  });
});

//-------------------------reset password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // const token = req.params.token;

  res.status(200).json({
    success: true,
  });
});

// //------------ get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const User = await usermodel.findOne({ user_id: req.user.user_id });
  res.status(200).json({
    success: true,
    User,
  });
});
