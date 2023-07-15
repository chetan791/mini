const passCheck = (req, res, next) => {
  const { password, confirm_password } = req.body;
  if (password == confirm_password) {
    next();
  } else {
    res.status(400).send("Password and confirm password didn't match");
  }
};

module.exports = passCheck;
