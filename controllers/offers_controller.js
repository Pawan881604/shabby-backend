const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const offers_model = require("../models/offers_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");
const isValidURL = require("../utils/checkValidUrl");
const { image_uploader } = require("../utils/image_uploader");

exports.add_offers = catchAsyncError(async (req, res, next) => {
  const { title, description, status, applicable_users, uuid } = req.body;
  const user = req.user._id;
  const image_data = req.file;
  const random_id = generateRandomString(8);

  // Check if title and description are provided
  if (!title || !description || !applicable_users) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  // Upload the image
  const image_status = await image_uploader(image_data, user);
  if (!image_status) {
    return next(new ErrorHandler("Image not added", 400));
  }

  const data = {
    title,
    discription: description,
    image: image_status._id,
    uuid,
    status,
    applicable_users,
    offer_id: `offer_${random_id}${uuid}`,
    user,
  };

  // const offer_data = await offers_model.create(data);
  // if (!offer_data) {
  //   return next(new ErrorHandler("Data not added", 404));
  // }

  res.status(200).json({
    success: true,
  });
});

exports.get_all_websites = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const count_website = await offers_model.countDocuments();
  const active_count = await offers_model.countDocuments({ status: "Active" });
  const inactive_count = await offers_model.countDocuments({
    status: "Inactive",
  });
  const apiFetures = new ApiFetures(offers_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const offer_data = await apiFetures.query
    .populate({
      path: "user",
      model: "User",
    })
    .sort({ updated_at: -1 });
  res.status(200).json({
    success: true,
    offer_data,
    count_website,
    resultPerpage,
    active_count,
    inactive_count,
  });
});

exports.update_website = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, status, link, image } = req.body;
  const image_data = req.file;
  const user = req.user._id;
  // Check if the website ID is valid
  if (!id) {
    return next(new ErrorHandler("Website ID is required", 400));
  }

  // Check if the link is provided and is a valid URL
  if (!isValidURL(link)) {
    return next(new ErrorHandler("Invalid website link", 400));
  }

  // Check if title and description are provided
  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required", 400));
  }

  // Check if the link already exists for another website
  const isExist = await offers_model.findOne({
    link: link,
    website_id: { $ne: id },
  });
  if (isExist) {
    return next(new ErrorHandler("Link already in use. Try another one.", 400));
  }

  // Prepare data for update
  const data = {
    title: title.trim(),
    discription: description.trim(),
    link: link.trim(),
    image: image_data ? image_data.path : image,
    update_at: new Date(),
    status,
    user,
  };

  // Update the website entry
  const website_ = await offers_model.findOneAndUpdate(
    { website_id: id },
    data,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  // Check if the website was found and updated
  if (!website_) {
    return next(new ErrorHandler("Data not Updated", 404));
  }

  // Fetch all websites after update
  const all_web = await offers_model.find().sort({ updated_at: -1 });

  res.status(200).json({
    success: true,
    message: "Website updated successfully",
    web_data: all_web,
  });
});
