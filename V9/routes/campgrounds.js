var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

// CREATE : Add new campground to the DB
router.post("/" ,middleware.isLoggedIn, function(req , res){
    
    //get data from from and add to campgrounds array
    
    var name = req.body.name;
    var desc = req.body.description;
    var image = req.body.image;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name: name , image: image , description: desc , author : author};
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
router.get("/" , function(req,res){
    Campground.find({} , function(err , campgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index" , {campgrounds : campgrounds})      
        }
    });
});

// NEW - show form to create new campground
router.get("/new" ,middleware.isLoggedIn, function(req , res){
    res.render("campgrounds/new");
});

//SHOW - show the campground with a particular ID
router.get("/:id" , function(req , res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            console.log(foundCamp);
            res.render("campgrounds/show" , {campground : foundCamp})
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit" ,middleware.checkCampgroundOwnership, function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit" , {campground : found})
        }
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id" ,middleware.checkCampgroundOwnership, function(req , res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err , updatedCamp){
            if(err){
                res.redirect("/campgrounds")
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

//DELETE THE CAMPGROUND
router.delete("/:id" ,middleware.checkCampgroundOwnership, function(req , res){ 
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    });
});

module.exports = router;