const User = require("../models/users");
const Project = require("../models/projects");

// function canViewProject(user, project) {
//   return user.role === ROLE.ADMIN || project.userId === user.id;
// }

function scopedProjects(user, projects) {
  console.log("ddddddddddddddd");
  // const pm_id = user._id;
  // console.log(projects);
  // console.log(pm_id);

  if (user.isAdmin === true) return projects;

  // const pro_pm = projects.map(function (a) {
  //   return a.pm._id;
  // });
  // const pro = pro_pm.map(function (id) {
  //   if(id === pm_id)
  // });
  // console.log(pro_pm);
  return projects.filter((project) => project.pm === user._id);
}

function canDeleteProject(user, project) {
  return project.userId === user.id;
}

module.exports = {
  // canViewProject,
  scopedProjects,
  // canDeleteProject,
};
