const express = require("express");
const User = require("../models/User");
var jwt = require("jsonwebtoken");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
//console.log(process.env.REACT_APP_JWT_SECRET);
const JWT_SECRET = `${process.env.REACT_APP_NOT_SECRET_CODE}`;
var fetchuser = require("../middleware/fetchuser");
//process.env.REACT_APP_JWT_SECRET

//ROUTE 1
//create user using POST "/api/auth/createuser" no login required
router.post(
  "/createuser",
  [
    body("name", "not valid name").isLength({ min: 3 }),
    body("username"),
    body("password", "weak password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    /*obj={
        a: 'joyjit',
        number: 34
    }
    re.json(obj)*/
    /*console.log(req.body);
    const user=User(req.body);
    user.save()
    res.json(req.body);*/

    //if there is error  return the error with bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    //check whether an user with same username exists or not
    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry username is already registered" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        username: req.body.username,
        password: secPassword,
        posts: 0
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      const ret={
        authtoken , 
        "name": user.name,
        "username": user.username, 
        "posts": user.posts
      };
      //console.log({ authtoken });
      res.json(ret);
      /*.then(user=> res.json(user))
    .catch(err=>{
        console.log(err);
        res.json({
            error: 'this username is already registered'
        })
    });*/
    } catch (error) {
      //console.error(error.message);
      res.status(500).send('internal server error');
    }
  }
);

//ROUTE 2
//login user using POST "/api/auth/login" no login required
router.post(
  "/login",
  [
    body("username", "username cannot be blank").exists(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there is error  return the error with bad request
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "Wrong credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Wrong credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET);
      //console.log({ authtoken });
      const ret={
        authtoken , 
        "name": user.name, 
        "username": user.username
      };
      //console.log({ authtoken });
      res.json(ret);
    } catch (error) {
      //console.error(error.message);
      res.status(500).send("internal server error");
    }
  }
);

//ROUTE 3
//get logged in user details using POST "/api/auth/getuser" login required
router.post("/getuser", [], fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user=await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    //console.log(error.message);
    res.status(500).send("internal server error")
  }
});
module.exports = router;