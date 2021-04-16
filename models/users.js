const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("../models/projects");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  name: String,
  username: String,
  email: { type: String, required: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  guest_in: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  pm_of: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  developer_in: [{ type: Schema.Types.ObjectId, ref: "Project" }], //list of Project ids
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
