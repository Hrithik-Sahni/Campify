var express       = require("express"),
    seedDB        = require("./seeds"),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passport      = require("passport"),
    User          = require("./models/user"),
    Comment       = require("./models/comment"),
    Campground    = require("./models/campgrounds")

    
seedDB();
var app = express();

app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));


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
    res.locals.currentUser = req.User;
    next();
});


//LANDING PAGE

app.get("/" , function(req , res){
    res.render("landing");
});

//==================
//      ROUTES
//==================

// CREATE : Add new campground to the DB
app.post("/campgrounds" , function(req , res){
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var desc = req.body.description;
    var image = req.body.image;
    var newCampground = {name: name , image: image , description: desc};
    Campground.create(newCampground, function(err , newCamp){
    if(err){
        console.log(err);
    }
    else{
        console.log(newCamp);
        res.redirect("/campgrounds");  //redirect it to get request
    }
    });
});

//INDEX - show all campgrounds
app.get("/campgrounds" , function(req,res){
    Campground.find({} , function(err , campgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index" , {campgrounds : campgrounds})      
        }
    });
});

// NEW - show form to create new campground
app.get("/campgrounds/new" , function(req , res){
    res.render("campgrounds/new");
});

//SHOW - show the campground with a particular ID
app.get("/campgrounds/:id" , function(req , res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
        if(err){
            console.log(err)
        }else{
            console.log(foundCamp);
            res.render("campgrounds/show" , {campground : foundCamp})
        }
    });
});


//=========================
//      COMMENTS ROUTES
//=========================

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new" , {campground : found});
        }
    });
});

app.post("/campgrounds/:id/comments" , isLoggedIn, function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment , function(err , comment){
                if(err){
                    console.log(err)
                }else{
                    found.comments.push(comment);
                    found.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
});

//=======================
//      AUTH ROUTES
//=======================

//get the form to register
app.get("/register" , function(req , res){
    res.render("register")
})

app.post("/register" , function(req , res){
    User.register(new User({username : req.body.username}) , req.body.password , function(err , user){
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req , res , function(){
            res.redirect("/campgrounds")
        });
    });
});

//get the login form
app.get("/login" , function(req , res){
    res.render("login");
});


//handle the login logic
app.post("/login" , passport.authenticate("local" ,
    {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
    }), 
    function(req , res){
});

app.get("/logout" , function(req , res){
    req.logout();
    res.redirect("/campgrounds")
});

function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

app.listen(process.env.PORT || 3000 , process.env.IP , function(){
    console.log("Yelp Server has started");
});