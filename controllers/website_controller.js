const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const website_model = require("../models/website_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");
const isValidURL = require("../utils/checkValidUrl");
const { image_uploader } = require("../utils/image_uploader");

exports.add_website = catchAsyncError(async (req, res, next) => {
  const { title, description, link, status, uuid } = req.body;
  const user = req.user._id;
  const image_data = req.file;
  const random_id = generateRandomString(8);
  if (!isValidURL(link)) {
    return next(new ErrorHandler("Invalid website link", 400));
  }

  // Check if title and description are provided
  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required", 400));
  }
  const isexist = await website_model.findOne({ link: link });
  if (isexist) {
    return next(new ErrorHandler("Try with another link", 400));
  }
  // Upload the image
  const image_status = await image_uploader(image_data, user);
  if (!image_status) {
    return next(new ErrorHandler("Image not added", 400));
  }
  const data = {
    link: link,
    title,
    discription: description,
    image: image_status._id,
    uuid,
    status,
    website_id: `web_${random_id}${uuid}`,
    user,
  };

  const web_data = await website_model.create(data);
  if (!web_data) {
    return next(new ErrorHandler("Data not added", 404));
  }
  const all_web_data = await website_model.find();
  const data_rev = all_web_data.reverse();

  res.status(200).json({
    success: true,
    all_web_data: data_rev,
  });
});

exports.get_all_websites = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const count_website = await website_model.countDocuments();
  const active_count = await website_model.countDocuments({ status: "Active" });
  const inactive_count = await website_model.countDocuments({
    status: "Inactive",
  });
  
  const apiFetures = new ApiFetures(website_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const web_data = await apiFetures.query
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
    web_data,
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
  const isExist = await website_model.findOne({
    link: link,
    website_id: { $ne: id },
  });
  if (isExist) {
    return next(new ErrorHandler("Link already in use. Try another one.", 400));
  }

  // Upload the image
  let image_url;
  if (image_data) {
    const image_status = await image_uploader(image_data, user);
    if (!image_status) {
      return next(new ErrorHandler("Image not added", 400));
    }
    image_url = image_status._id;
  } else {
    image_url = image;
  }

  // Prepare data for update
  const data = {
    title: title.trim(),
    discription: description.trim(),
    link: link.trim(),
    image: image_url,
    update_at: new Date(),
    status,
    user,
  };

  // Update the website entry
  const website_ = await website_model.findOneAndUpdate(
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
  const all_web = await website_model.find().sort({ updated_at: -1 });

  res.status(200).json({
    success: true,
    message: "Website updated successfully",
    web_data: all_web,
  });
});
