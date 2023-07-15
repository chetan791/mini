const validator = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    next();
  } else {
    res.status(400).send("You dont have access");
  }
};

module.exports = validator;
