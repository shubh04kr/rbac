const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/users");

const projectSchema = new Schema({
  title: String,
  team: [{ type: Schema.Types.ObjectId, ref: "User" }],
  pm: { type: Schema.Types.ObjectId, ref: "User" },
  guests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  subproject: {
    title: String,
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pm: { type: Schema.Types.ObjectId, ref: "User" },
  },
});

module.exports = mongoose.model("Project", projectSchema);
