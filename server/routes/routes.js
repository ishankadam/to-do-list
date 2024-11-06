var _ = require("lodash");
require("dotenv").config();
const { createJSONToken, validateJSONToken } = require("../auth");
const md5 = require("md5");
const router = require("express").Router();
const User = require("../schema/user");
const checkLoginInput = (password) => {
  const hashPassword = md5(password);
  return hashPassword;
};

const checkLoginCredentials = async (req, res) => {
  let userEmail = req.body.email;
  let password = req.body.password;

  try {
    const employees = await User.aggregate([
      { $match: { email: userEmail } },
      { $project: { _id: 0 } },
    ]);
    if (employees.length > 0) {
      const hashPassword = checkLoginInput(password);
      if (_.isEqual(employees[0].password, hashPassword)) {
        const token = createJSONToken(userEmail);
        res.send({
          isValid: true,
          token,
          employeeDetails: employees[0],
        });
        res.end();
      } else {
        res.status(404);
        res.send({
          isPasswordInvalid: true,
        });
      }
    } else {
      res.status(404);
      res.send({
        isEmailInvalid: true,
      });
      res.end();
    }
  } catch (error) {
    console.log(error);
    res.json(error);
    res.end();
  }
};

const create_user = async (req, res) => {
  try {
    const newCreatedUser = new User({
      userId: Math.floor(Math.random() * 9000000000) + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: md5(req.body.password),
      role: req.body.role || "emp",
      department: req.body.department,
    });
    await newCreatedUser.save();
    const userDetails = await User.aggregate([
      { $match: { userId: newCreatedUser.userId } },
      { $project: { _id: 0 } },
    ]);

    res.send(userDetails);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    res.end();
  }
};

const get_user = async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    const userDetails = await User.aggregate([
      { $match: { userId: userId } },
      { $project: { _id: 0 } },
    ]);
    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).send("Error fetching User");
  }
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.params.token;
    const payload = validateJSONToken(token);
    if (payload) {
      res.status(200);
      res.send("Authenticated.");
      res.end();
    } else {
      res.status(401);
      res.send("Not Authenticated.");
      res.end();
    }
  } catch (e) {
    next();
  }
};

router.post("/login", checkLoginCredentials);
router.post("/createUser", create_user);
router.get("/user/:userId", get_user);
router.get("/verifyToken/:token", verifyToken);

module.exports = router;
