var     express       = require("express"),
        seedDB        = require("./seeds"),
        mongoose      = require("mongoose"),
        methodOverride = require("method-override")
        bodyParser    = require("body-parser"),
        LocalStrategy = require("passport-local"),
        passport      = require("passport"),
        User          = require("./models/user"),
        Comment       = require("./models/comment"),
        Campground    = require("./models/campgrounds")

//requring routes
var     commentRoutes     = require("./routes/comments"),
        campgroundRoutes  = require("./routes/campgrounds"),
        indexRoutes       = require("./routes/index")


//SEED THE DATABASE
// seedDB();

var app = express();

app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//MONGOOSE CONFIG
mongoose.connect("mongodb://localhost/yelp_camp");


//PASSPORT CONFIG
app.use(require("express-session")({
    secret : "secretCode",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//MIDDLEWARE FOR USER LOGIN
app.use(function(req , res , next){
    res.locals.currentUser = req.user;
    next();
});


//ROUTES
app.use("/" , indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000 , process.env.IP , function(){
    console.log("Yelp Server has started");
});