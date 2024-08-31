const image_model = require("../models/image_model");

exports.image_uploader = async (image_data, user) => {
  try {
    const data = {
      fieldname: image_data.fieldname,
      originalname: image_data.originalname,
      encoding: image_data.encoding,
      mimetype: image_data.mimetype,
      destination: image_data.destination,
      filename: image_data.filename,
      path: image_data.path,
      size: image_data.size,
      user: user,
    };

    const images = await image_model.create(data);
    return images;
  } catch (err) {
    return null; 
  }
};
