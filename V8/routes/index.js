var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//LANDING PAGE
router.get("/" , function(req , res){
    res.render("landing");
});


//get the form to register
router.get("/register" , function(req , res){
    res.render("register")
});

router.post("/register" , function(req , res){
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
router.get("/login" , function(req , res){
    res.render("login");
});

//handle the login logic
router.post("/login" , passport.authenticate("local" ,
    {
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
    }), 
    function(req , res){
});

//Logout
router.get("/logout" , function(req , res){
    req.logout();
    res.redirect("/campgrounds")
});

//MIDDLEWARE
function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports = router;