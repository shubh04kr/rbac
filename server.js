// MAKE ADD GUEST TO USER AND MAKE PROJECTS
//PROBLEM IN PROJECT INDEX DUE TO SCOPEDPROJECT
//PROBLEM IN ADD GUEST IN PUSH LINE

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");
// const Project = require("./models/projects");
const User = require("./models/users");
const LocalStrategy = require("passport-local");
// const { authUser } = require("./basicAuth");webdev video
const { urlencoded } = require("express");

const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const { isLoggedIn } = require("./permissions/permissions");

mongoose.connect("mongodb://localhost:27017/rbac", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this should come after passport
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.urlencoded({ extended: true }));

app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

app.get("/dashboard", (req, res) => {
  res.send("DAshboard");
});

app.listen(3000);

// app.get("/user", async (req, res) => {
//   // const { name, isAdmin } = req.body;
//   // const user = new User({ name: "Shubham", isAdmin: false });
//   const user = new User({ name: "Abhinav" });
//   // const user = new User({ name: "Shubham", isAdmin: false });
//   await user.save();
//   res.send(user);
// });

// app.get("/project", async (req, res) => {
//   // const { title } = req.body;
//   const project = new Project({});
//   await project.save();
//   res.send(project);
// });

// User.insertMany([
//   { name: "Sahil", isAdmin: true },
//   { name: "Vishal", developer_in: "606ede66185842136c14fe67" },
//   { name: "Meghna", developer_in: "606ede66185842136c14fe67" },
// ]);
// Project.insertMany([
//   { title: "Sahil's Project", pm: "606ee074419f871e40bfe1ea" },
//   { title: "Vishal's Project", pm: "606ee09256c0681e90eaaf9c" },
//   { title: "Meghna's Project", pm: "606ee09256c0681e90eaaf9d" },
// ]);

// app.get('/registerUser', async (req, res) => {

//     const user = new User({ name: 'Aman', balance: 1000, acc_number: '0100101' })
//     // const user = new User({ name: 'Rahul', balance: 1000, acc_number: '0100102' })
//     // const user = new User({ name: 'Vikas', balance: 1000, acc_number: '0100103' })
//     // const user = new User({ name: 'Babloo', balance: 1000, acc_number: '0100104' })
//     await user.save()
//     res.send(user)
// })

// app.use(express.json());
// app.use(setUser);
// app.use("/projects", projectRouter);

// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// app.get("/dashboard", (req, res) => {
//   res.send("Dashboard Page");
// });

// app.get("/admin", (req, res) => {
//   res.send("Admin Page");
// });

// function setUser(req, res, next) {
//   const userId = req.body.userId;
//   if (userId) {
//     req.user = users.find((user) => user.id === userId);
//   }
//   next();
// }
