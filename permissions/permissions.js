const Project = require("../models/projects");
const User = require("../models/users");

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "Sign in");
    return res.redirect("/users/login");
  }
  next();
}

function isAdmin(req, res, next) {
  const user = req.user;
  if (!(user.isAdmin === true)) {
    res.redirect("/");
  }
  next();
}

function isManager(req, res, next) {
  // console.log("from is manager");
  const user = req.user;
  const projectId = req.path.substring(1);
  const project = Project.findById(projectId);
  // console.log(project);
  // console.log(req.user);
  // console.log(req.project);
  next();
  // if(!req.user.pm_of === )
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isManager,
};
