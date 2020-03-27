var express    = require("express"),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser"),
    Campground = require("./models/campgrounds"),
    seedDB     = require("./seeds"),
    Comment    = require("./models/comment")
    
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

var app = express();

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));


//LANDING PAGE
app.use(express.static(__dirname + "/public"))
app.get("/" , function(req , res){
    res.render("landing");
});

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
})

})

//INDEX - show all campgrounds
app.get("/campgrounds" , function(req,res){
    Campground.find({} , function(err , campgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index" , {campgrounds : campgrounds})      
        }
    })
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


//=================
//COMMENTS ROUTES
//==================

app.get("/campgrounds/:id/comments/new", function(req , res){
    Campground.findById(req.params.id , function(err , found){
        if(err){
            console.log(err)
        }else{
    res.render("comments/new" , {campground : found});
    }
});
});

app.post("/campgrounds/:id/comments" , function(req , res){
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





app.listen(process.env.PORT || 3000 , process.env.IP , function(){
    console.log("Yelp Server has started");
})