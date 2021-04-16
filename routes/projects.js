const express = require("express");
const {
  isLoggedIn,
  isAdmin,
  isManager,
} = require("../permissions/permissions");
const router = express.Router();
const Project = require("../models/projects");
const User = require("../models/users");
// const { canViewProject } = require("../permissions/project");
const { scopedProjects } = require("../permissions/project");
// const { isAdmin } = require("../permissions/permissions");
// const { authUser } = require("../basicAuth");
// const {
// canViewProject,
//   canDeleteProject,
//   scopedProjects,
// } = require("../permissions/project");

//Show all projects
//ADD ISLOGGEDIN ISADMIN
router.get("/", async (req, res) => {
  const projects = await Project.find().populate("pm");
  // const pro = scopedProjects(req.user, projects).populate("pm");
  res.render("projects/index", { projects });
});

// Show New Project form
router.get("/new", (req, res) => {
  res.render("projects/new");
});

//Make Project
router.post("/new", async (req, res) => {
  const { title, username, mem1, mem2, mem3 } = req.body;
  const user = await User.findOne({ username });
  const members = await User.find({ username: { $in: [mem1, mem2, mem3] } });
  const project = await new Project({ pm: user._id, title, user });
  User.updateOne({ username: username }, { $set: { pm_of: project._id } }); //updating pm field of respective user
  for (let i = 0; i < members.length; i++) {
    //updating developer field of respective user
    members[i].developer_in.push(project._id);
    project.team.push(members[i]);
  }

  await project.save();
  user.pm_of.push(project._id);
  await user.save();

  res.redirect("/projects");
});

// SHow Project Details
//ADD IS LOGGED IN
router.get("/:id", isManager, async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("team")
    .populate("pm")
    .populate("guests");

  res.render("projects/show", { project });
});

// Delete Project
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  //deleting pm entry from respective pm
  const pm = await User.findById(project.pm);
  await User.findByIdAndUpdate(pm._id, { $pull: { pm_of: id } });
  // remove developers
  const mem = [];
  for (let i = 0; i < project.team.length; i++) {
    mem[i] = await User.findById(project.team[i]);
    console.log(mem[i]);
    await User.findByIdAndUpdate(mem[i], { $pull: { developer_in: id } });
  }
  await Project.findByIdAndDelete(id);
  res.redirect("/projects");
});

// Add guest
router.post("/:id/guest", async (req, res) => {
  const username = req.body.username;
  const id = req.params.id;
  console.log(id, username);
  const project = await Project.findById(id);
  const user = await User.find({ username: username });
  console.log("8888888888888888888");
  console.log(project, user[0]);
  project.guests.push(user._id);
  user[0].guest_in.push(project._id);
  console.log(project, user);
  res.redirect("/projects");
});

// Add sub-project
router.patch("/:id/subproject", async (req, res) => {
  const project = await Project.findById(req.params.id);
  const { title, pm_username, mem1, mem2, mem3 } = req.body;
  const user = await User.findOne({ pm_username });
  const members = await User.find({ username: { $in: [mem1, mem2, mem3] } });
  const project = await new Project({ pm: user._id, title, user });
  User.updateOne({ username: username }, { $set: { pm_of: project._id } }); //updating pm field of respective user
  for (let i = 0; i < members.length; i++) {
    //updating developer field of respective user
    members[i].developer_in.push(project._id);
    project.team.push(members[i]);
  }

  await project.save();
  user.pm_of.push(project._id);
  await user.save();

  res.redirect("/projects");

  res.send(project);
});

// router.get('/:projectId', setProject, authUser, authGetProject, (req, res) => {
//   res.json(req.project)
// })

// router.delete('/:projectId', setProject, authUser, authDeleteProject, (req, res) => {
//   res.send('Deleted Project')
// })

// function setProject(req, res, next) {
//   const projectId = parseInt(req.params.projectId)
//   req.project = projects.find(project => project.id === projectId)

//   if (req.project == null) {
//     res.status(404)
//     return res.send('Project not found')
//   }
//   next()
// }

// function authGetProject(req, res, next) {
//   if (!canViewProject(req.user, req.project)) {
//     res.status(401);
//     return res.send("Not Allowed");
//   }

//   next();
// }

// function authDeleteProject(req, res, next) {
//   if (!canDeleteProject(req.user, req.project)) {
//     res.status(401);
//     return res.send("Not Allowed");
//   }

//   next();
// }

module.exports = router;
