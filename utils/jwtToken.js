// -----------create token and save in  cookies 
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTtoken();
    //-------------   options for cookie

    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
           path: "/", // cookie path
        //   Domain: ".onrender.com", // domain for the cookie
          secure: true, // accessible through HTTP
          httpOnly: true, // only server can access the cookie
          sameSite: "none", // enforcement type
          partitioned: false, // store using partitioned storage
        };
    res.status(statusCode)
    // .cookie('token',token,option)
    .json({
        success:true,
        token,
        user,
    })
}

module.exports = sendToken;