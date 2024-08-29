const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const branch_model = require("../models/branch_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");

exports.add_branch = catchAsyncError(async (req, res, next) => {
  const { branch_data, uuid } = req.body;
  const { link, branch,status } = branch_data;
  const user = req.user._id;
  const random_id = generateRandomString(8);
  if (!link || !branch) {
    return next(new ErrorHandler("Link and Branch are required", 400));
  }
  const isexist = await branch_model.findOne({ link: link });

  if (isexist) {
    return next(new ErrorHandler("Try with another link", 400));
  }
  const data = {
    link: link,
    branch: branch,
    branch_id: `bnh_${random_id}${uuid}`,
    status,
    user,
  };
  const branch_ = await branch_model.create(data);

  const all_branch = await branch_model.find().sort({ updated_at: -1 });

  res.status(200).json({
    success: true,
    branch: all_branch,
  });
});

exports.get_all_branch = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 10;
  const count_branch = await branch_model.countDocuments();

  const apiFetures = new ApiFetures(branch_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const branch = await apiFetures.query
    .populate({
      path: "user",
      model: "User",
    })
    .sort({ updated_at: -1 });
  res.status(200).json({
    success: true,
    branch,
    count_branch,
    resultPerpage,
  });
});

exports.update_branch = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { branch_data } = req.body;
  const { link, branch,status } = branch_data;
  const user = req.user._id;
  // Check if the website ID is valid
  if (!id) {
    return next(new ErrorHandler("Branch ID is required", 400));
  }

  // Check if title and description are provided
  if (!link || !branch) {
    return next(new ErrorHandler("Link and Branch are required", 400));
  }

  // Check if the link already exists for another website
  const isExist = await branch_model.findOne({
    link: link,
    branch_id: { $ne: id },
  });
  if (isExist) {
    return next(new ErrorHandler("Link already in use. Try another one.", 400));
  }

  const data = {
    link: link,
    branch: branch,
    update_at: new Date(),
    status,
    user,
  };
  const branch_ = await branch_model.findOneAndUpdate({ branch_id: id }, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!branch_) {
    return next(new ErrorHandler("Data not Updated", 404));
  }
  const all_branch = await branch_model.find().sort({ updated_at: -1 });
  res.status(200).json({
    success: true,
    branch: all_branch,
  });
});

//------------------users

exports.get_branch = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 10;

  const count_branch = await branch_model.countDocuments();

  const apiFetures = new ApiFetures(branch_model.find(), req.query).filter();

  const branch = await apiFetures.query;

  res.status(200).json({
    success: true,
    branch,
    count_branch,
    resultPerpage,
  });
});
