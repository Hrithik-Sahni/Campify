var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");

//COMMENTS-----New
router.get("/new", isLoggedIn, function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new" , {campground : found});
        }
    });
});

//COMMENTS----Create
router.post("/" , isLoggedIn, function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment , function(err , comment){
                if(err){
                    console.log(err);
                }else{
                    //ADD USERNAME AND ID AND SAVE THE COMMENT
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    found.comments.push(comment);
                    found.save();
                    
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//MIDDLEWARE
function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports  = router;