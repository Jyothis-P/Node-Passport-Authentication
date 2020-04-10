const flash = require("connect-flash");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local');


const User = require("./models/user")
const middleware = require("./utils/middleware");
const userController = require("./controllers/user");

mongoose.connect("mongodb://localhost/authDemo")
    .then(() => console.log("Connected to MongoDB."))
    .catch(err => console.error("Could not connect to MongoDB."));

const app = express();


app.set('view engine', 'ejs');
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use(cookieParser());

//passport configuration
app.use(session({
	secret: process.env.SESSIONSECRET || "node_app_secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser to all routes
app.use((req, res, next) => {
	res.locals.currentUser = req.user; // req.user is an authenticated user
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

userController(app);

app.get('/', function(req, res){
    res.render('home');
});

app.get('/home', middleware.isLoggedIn, function(req, res){
    res.render('home');
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
    console.log("listening to port", PORT);
});