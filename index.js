const express = require("express");
const app = express();
const srvPort = 3010;
const bcrypt = require("bcrypt");
const session = require("express-session");

const path = require("path");

const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/bcrypt-test", {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to DB:"));
db.once("open", () => {
    console.log("Connect to DB.");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(express.urlencoded({ extended: true }));

const requireLogin = async function (req, res, next) {
    if (!req.session.user_id) {
        res.redirect("/login");
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    account_id = await User.authenticateUser(username, password);
    if (account_id) {
        req.session.user_id = account_id;
        res.redirect("/dashboard");
    } else {
        res.send("Login failed");
    }
});

app.post("/user", async (req, res) => {
    const { username, password } = req.body;
    //const hash = await bcrypt.hash(password, 12); //handling this with mongoose middleware
    const user = await new User({ username, password });
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/dashboard");
});

app.post("/logout", (req, res) => {
    req.session.user_id = null;
    // req.session.destroy(); //Also an option to destroy the whole session
    res.redirect("/");
});

app.get("/dashboard", requireLogin, async (req, res) => {
    const user = await User.findById(req.session.user_id);
    res.render("dashboard", { username: user.username });
});

app.listen(srvPort, () => {
    console.log(`App started on port: ${srvPort}`);
});
