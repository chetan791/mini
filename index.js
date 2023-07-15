const express = require("express");
const jwt = require("jsonwebtoken");
const { connection } = require("./db");
const userModel = require("./model/user.model");
const passCheck = require("./middleware/pass.middleware");
const validator = require("./middleware/validator.middleware");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
app.use(cors());

dotenv.config();
app.use(express.json());

//endpoint for signup
app.post("/signup", passCheck, async (req, res) => {
  try {
    const email = await userModel.findOne(req.email);
    if (email) {
      res.status(400).send("email already exist");
    } else {
      const user = await userModel.create(req.body);
      user.save();
    }
  } catch (error) {
    console.log({ err: error });
  }
});

// endpoint for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne(email);
    if (email) {
      if (req.password == password) {
        if (user.role == "Admin") {
          const token = jwt.sign("miniProject");
          res.status(200).send("Welcome Admin", token);
        } else {
          res.status(200).send("Welcome Explorer");
        }
      } else {
        res.status(400).send("Wrong Password");
      }
    } else {
      res.status(400).send("email already exist");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const list = await userModel.find();
    res.status(200).send(list);
  } catch (error) {
    console.log({ err: error });
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const list = await userModel.findOne({ _id: id });
    if (list) {
      res.status(200).send(list);
    } else {
      res.status(400).send("user Doesn't Exist");
    }
  } catch (error) {
    console.log({ err: error });
  }
});

app.patch("/update/:id", validator, async (req, res) => {
  const id = req.params;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decode = jwt.verify(token, "miniProject");
    if (decode) {
      userModel.findByIdAndUpdate(id, req.body);
      res.status(200).send("user updated successfully");
    }
  } catch (error) {
    console.log({ err: error });
  }
});

app.put("/replace/:id", validator, async (req, res) => {
  const id = req.params;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decode = jwt.verify(token, "miniProject");
    if (decode) {
      userModel.findOneAndReplace({ _id: id }, req.body);
      res.status(200).send("user replaced successfully");
    }
  } catch (error) {
    console.log({ err: error });
  }
});

app.put("/delete/:id", validator, async (req, res) => {
  const id = req.params;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decode = jwt.verify(token, "miniProject");
    if (decode) {
      userModel.findByIdAndDelete(id, req.body);
      res.status(200).send("user deleted successfully");
    }
  } catch (error) {
    console.log({ err: error });
  }
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
    console.log("something went wrong");
  }
});
