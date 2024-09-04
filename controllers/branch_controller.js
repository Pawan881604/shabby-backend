const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const branch_model = require("../models/branch_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");
const user_model = require("../models/user_model");

exports.add_branch = catchAsyncError(async (req, res, next) => {
  const { branch_data, uuid } = req.body;

  const random_id = generateRandomString(8);
  if (!branch_data || !uuid) {
    return next(new ErrorHandler("All data are required", 400));
  }

  const { link, branch, status } = branch_data;

  // Ensure link and branch are provided
  if (!link || !branch) {
    return next(new ErrorHandler("Branch link and name are required", 400));
  }
  const user = req.user._id;
  if (!user) {
    return next(new ErrorHandler("Authentication is required", 401));
  }

  const isexist = await branch_model.findOne({ link: link });

  if (isexist) {
    return next(
      new ErrorHandler("Branch link already exists, try another link", 400)
    );
  }
  const data = {
    link: link,
    branch: branch,
    branch_id: `bnh_${random_id}${uuid}`,
    user,
    status,
  };
  const branch_ = await branch_model.create(data);
  if (!branch_) {
    return next(new ErrorHandler("Data not added", 400));
  }
  res.status(200).json({
    success: true,
  });
});

exports.get_all_branch = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const count_branch = await branch_model.countDocuments();
  const active_count = await branch_model.countDocuments({ status: "Active" });
  const inactive_count = await branch_model.countDocuments({
    status: "Inactive",
  });

  const apiFetures = new ApiFetures(branch_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const branch = await apiFetures.query
    .populate([
      {
        path: "user",
        model: "User",
      }
    ])
    .sort({ updated_at: -1 });
  res.status(200).json({
    success: true,
    branch,
    count_branch,
    resultPerpage,
    active_count,
    inactive_count,
  });
});

exports.update_branch = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { branch_data } = req.body;
  if (!branch_data) {
    return next(new ErrorHandler("All data are required", 400));
  }
  const { link, branch, status } = branch_data;
  if (!link || !branch) {
    return next(new ErrorHandler("Branch link and name are required", 400));
  }
  const user = req.user._id;
  if (!user) {
    return next(new ErrorHandler("Authentication is required", 401));
  }
  const isexist = await branch_model.findOne({
    link: link,
    branch_id: { $ne: id },
  });
  if (isexist) {
    return next(
      new ErrorHandler("Branch link already exists, try another link", 400)
    );
  }
  const data = {
    link: link,
    branch: branch,
    update_at: new Date(),
    user,
    status,
  };
  const branch_ = await branch_model.findOneAndUpdate({ branch_id: id }, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!branch_) {
    return next(new ErrorHandler("Data not added", 400));
  }
  res.status(200).json({
    success: true,
  });
});

//------------------users

exports.get_branch = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 10;
  const user_id = req.user._id;
  const user = await user_model.findById(user_id);
  const user_branch = user.branch;
  const apiFetures = new ApiFetures(
    branch_model.find({ branch_id: { $in: user_branch } }),
    req.query
  ).filter();

  const branch = await apiFetures.query.sort({ updated_at: -1 });
  const count_branch = await branch_model.countDocuments();
  res.status(200).json({
    success: true,
    branch,
    count_branch,
    resultPerpage,
  });
});
