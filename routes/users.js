const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/users");
const Project = require("../models/projects");
const {
  isManager,
  isAdmin,
  isLoggedIn,
} = require("../permissions/permissions");

// display a list of all users
router.get("/", async (req, res) => {
  const users = await User.find({});
  res.render("users/index", { users });
});

// display register user form
router.get("/new", (req, res) => {
  res.render("users/new");
});

// registers a user after a form is filled
// currently breaks when a non admin user tries to access
//access from non admin should lead to home page
router.post("/", async (req, res) => {
  try {
    const { name, email, username, password, isAdmin } = req.body;
    // console.log(name, email, username, password);
    // console.log(email, username)
    const user = new User({ name, email, username, isAdmin });
    const registeredUser = await User.register(user, password);
    await registeredUser.save();
    res.redirect("/users");
  } catch (e) {
    console.log(e);
    res.redirect("/users/new");
  }
});

// display login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// logs in user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    //failureFlash: true,
    req.flash("success", "Logged In Successfully");
    res.redirect("/");
  }
);
// Logs Out User
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Logged Out Successfully");
  res.redirect("/");
});

// Delete User will do later if asked
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   await Project.updateMany({ pm: { $in: [id] } }, { $set: { pm: "" } });
//   // await User.findByIdAndDelete(id);
//   res.redirect("/users");
// });

// display user details
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("pm_of")
    .populate("developer_in");
  console.log(user);
  res.render("users/show", { user });
});

module.exports = router;
