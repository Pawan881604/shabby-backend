exports.valid_email_or_no = async (email,phone_number) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const indianMobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  let id = ""; // Changed from const to let

  if (emailRegex.test(email)) {
    id = "email";
  } else if (indianMobileRegex.test(phone_number)) {
    id = "Phone_no";
  } else {
    id = "invalid";
  }

  return id;
};

exports.valid_login_email_or_no = async (user_id) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const indianMobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
  let id = ""; // Changed from const to let

  if (emailRegex.test(user_id)) {
    id = "email";
  } else if (indianMobileRegex.test(user_id)) {
    id = "phone_number";
  } else {
    id = "invalid";
  }

  return id;
};

