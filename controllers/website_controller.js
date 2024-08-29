const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const website_model = require("../models/website_model");
const { generateRandomString } = require("../utils/generateRandomString");
const ApiFetures = require("../utils/apiFeatuers");

exports.add_website = catchAsyncError(async (req, res, next) => {
  const { title, description, link, image, uuid } = req.body;
  const user = req.user._id;
  const image_data = req.file;
  const random_id = generateRandomString(8);
  const isexist = await website_model.findOne({ link: link });

  if (isexist) {
    return next(new ErrorHandler("Try with another link", 400));
  }

  const data = {
    link: link,
    title,
    discription: description,
    image: image_data ? image_data.path : image,
    uuid,
    website_id: `web_${random_id}${uuid}`,
    user,
  };

  const web_data = await website_model.create(data);
  const all_web_data = await website_model.find();
  const data_rev = all_web_data.reverse();

  res.status(200).json({
    success: true,
    all_web_data: data_rev,
  });
});

exports.get_all_websites = catchAsyncError(async (req, res, next) => {
  const resultPerpage = 10;
  const count_website = await website_model.countDocuments();

  const apiFetures = new ApiFetures(website_model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerpage);

  const web_data = await apiFetures.query;
  res.status(200).json({
    success: true,
    web_data,
    count_website,
    resultPerpage,
  });
});

exports.update_website = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, link, image, uuid } = req.body;
  console.log(req.body)
  // console.log(req.file)
  const data = {
    link: link,
    title,
    discription: description,
    image,
    uuid,
    website_id: `web_${random_id}${uuid}`,
    update_at: new Date(),
  };
  // const website_ = await website_model.findOneAndUpdate(
  //   { website_id: id },
  //   data,
  //   {
  //     new: true,
  //     runValidators: true,
  //     useFindAndModify: false,
  //   }
  // );

  const all_web = await website_model.find();
  const all_data = all_web.reverse();
  res.status(200).json({
    success: true,
    web_data: all_data,
  });
});
