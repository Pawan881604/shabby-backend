const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const offers_slider_model = require("../models/offers_slider_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");
const { image_uploader } = require("../utils/image_uploader");

exports.add_slider = catchAsyncError(async (req, res, next) => {
  const { data_, uuid } = req.body;
  const { title, status } = data_;
  const random_id = generateRandomString(8);
  const user = req.user._id;
  const image_data = req.file;

  // Check if the required fields are present
  if (!title || !image_data) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Upload the image
  const image_status = await image_uploader(image_data, user);
  if (!image_status) {
    return next(new ErrorHandler("Image not added", 400));
  }

  // Prepare the data for the slider
  const data = {
    title: title.trim(),
    image: image_status._id,
    uuid,
    status,
    slider_id: `slide_${random_id}${uuid}`,
    user,
  };

  // Save the slider data
  const slide_data = await offers_slider_model.create(data);
  if (!slide_data) {
    return next(new ErrorHandler("Data is not added", 404));
  }

  res.status(200).json({
    success: true,
  });
});

exports.get_all_offer_slider = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const count_ = await offers_slider_model.countDocuments();
  const active_count = await offers_slider_model.countDocuments({
    status: "Active",
  });
  const inactive_count = await offers_slider_model.countDocuments({
    status: "Inactive",
  });
  const apiFetures = new ApiFetures(offers_slider_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const slide_data = await apiFetures.query
    .populate([
      {
        path: "image",
        model: "Images",
      },
      {
        path: "user",
        model: "User",
      },
    ])
    .sort({ updated_at: -1 });
  res.status(200).json({
    success: true,
    slide_data,
    count_,
    resultPerpage,
    active_count,
    inactive_count,
  });
});

exports.update_offer_slider = catchAsyncError(async (req, res, next) => {
  const { status, id } = req.body;
  console.log(req.body);
  const user = req.user._id;
  if (!id) {
    return next(new ErrorHandler("Offer slider ID is required", 400));
  }
  const data = {
    status: status === "Active" ? "Inactive" : "Active",
    update_at: new Date(),
    user,
  };
  const silder_data = await offers_slider_model.findOneAndUpdate(
    { slider_id: id },
    data,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!silder_data) {
    return next(new ErrorHandler("Data is not Updated", 404));
  }

  res.status(200).json({
    success: true,
  });
});
