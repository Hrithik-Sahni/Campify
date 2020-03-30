var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds")

// CREATE : Add new campground to the DB
router.post("/" , function(req , res){
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
router.get("/new" , function(req , res){
    res.render("campgrounds/new");
});

//SHOW - show the campground with a particular ID
router.get("/:id" , function(req , res){
    Campground.findById(req.params.id).populate("comments").exec(function(err , foundCamp){
        if(err){
            console.log(err)
        }else{
            console.log(foundCamp);
            res.render("campgrounds/show" , {campground : foundCamp})
        }
    });
});

module.exports = router;