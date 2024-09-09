const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const offers_model = require("../models/offers_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");
const isValidURL = require("../utils/checkValidUrl");
const { image_uploader } = require("../utils/image_uploader");

exports.add_offers = catchAsyncError(async (req, res, next) => {
  const { data_, ids, uuid } = req.body;
  const { title, discription, status, valid_date } = data_;

  const user = req.user._id;
  const image_data = req.file;
  const random_id = generateRandomString(8);

  // Check if title and description are provided
  if (!title || !discription) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  // Upload the image
  const image_status = await image_uploader(image_data, user);
  if (!image_status) {
    return next(new ErrorHandler("Image not added", 400));
  }

  const data = {
    title,
    discription,
    image: image_status._id,
    uuid,
    status,
    valid_date: new Date(valid_date),
    applicable_users: ids,
    offer_id: `offer_${random_id}${uuid}`,
    user,
  };

  const offer_data = await offers_model.create(data);
  if (!offer_data) {
    return next(new ErrorHandler("Data not added", 404));
  }
  console.log(offer_data);
  res.status(200).json({
    success: true,
  });
});

exports.get_all_offers = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const count_ = await offers_model.countDocuments();
  const active_count = await offers_model.countDocuments({ status: "Active" });
  const inactive_count = await offers_model.countDocuments({
    status: "Inactive",
  });
  const apiFetures = new ApiFetures(offers_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const offer_data = await apiFetures.query
    .populate([
      {
        path: "image",
        model: "Images",
      },
      {
        path: "applicable_users",
        model: "User",
      },
    ])
    .sort({ updated_at: -1 });

  res.status(200).json({
    success: true,
    offer_data,
    count_,
    resultPerpage,
    active_count,
    inactive_count,
  });
});

exports.update_offer = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const { data_, image, ids } = req.body;
  const { title, discription, status, valid_date } = data_;
  const image_data = req.file;
  const user = req.user._id;
  // Check if the website ID is valid
  if (!id) {
    return next(new ErrorHandler("Offer ID is required", 400));
  }
  
  if (!title || !discription || !valid_date || !status) {
    return next(new ErrorHandler("All field are required", 400));
  }

  let image_ids;
  if (image_data) {
    const image_status = await image_uploader(image_data, user);
    if (!image_status) {
      return next(new ErrorHandler("Image not added", 400));
    }
    image_ids = image_status._id;
  } else {
    image_ids = image;
  }


  // Prepare data for update
  const data = {
    title,
    discription,
    image: image_ids,
    status,
    valid_date: new Date(valid_date),
    applicable_users: ids,
    update_at: new Date(),
    user,
  };

  const offer_ = await offers_model.findOneAndUpdate(
    { _id: id },
    data,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  // // Check if the website was found and updated
  if (!offer_) {
    return next(new ErrorHandler("Data not Updated", 404));
  }

console.log(offer_)
  res.status(200).json({
    success: true,
  });
});


exports.get_app_offers = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 25;
  const userId = req.user._id;
  console.log(req.query)
  let query = offers_model.find();
  if (userId) {
    // For a logged-in user, show applicable special offers or general offers
    query = query.find({
      $or: [
        { applicable_users: { $in: [userId] } }, // Special offers for this user
        { applicable_users: { $exists: false } }, // General offers for all users
        { applicable_users: { $size: 0 } }, // Offers with an empty applicable_users array
      ],
    });
  } else {
    // For non-logged-in users (or normal users), show only general offers
    query = query.find({
      $or: [
        { applicable_users: { $exists: false } }, // Offers for all users
        { applicable_users: { $size: 0 } }, // Offers with an empty applicable_users array
      ],
    });
  }

  const apiFetures = new ApiFetures(query, req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const offer_data = await apiFetures.query
    // .populate([
    //   {
    //     path: "image",
    //     model: "Images",
    //   },
    //   {
    //     path: "applicable_users",
    //     model: "User",
    //   },
    // ])
    // .sort({ updated_at: -1 });
    // console.log(offer_data)

  res.status(200).json({
    success: true,
    offer_data,
  });
});