var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description: String
});

var Campground = mongoose.model("Campground" , campgroundSchema);



app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));

// var campgrounds = [
//     {name : "Mount Abu", image:"https://www.outlookindia.com/outlooktraveller/public/uploads/2017/02/mount-abu3-1024x683.jpg"},
//     {name : "Kasol" ,  image : "https://static2.tripoto.com/media/filter/tst/img/375011/TripDocument/1521799065_1521799062132.jpg"},
//     {name : "Triund" , image : "https://static2.tripoto.com/media/filter/tst/img/294328/TripDocument/1498109303_11403493_10205805061838518_9141468675078132726_n.jpg"},
//     {name : "Nainital" , image :"https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/02/Nainital-Winters-October-February.jpg"}
// ]

// Campground.create({name : "Mount Abu" , image : "https://www.outlookindia.com/outlooktraveller/public/uploads/2017/02/mount-abu3-1024x683.jpg" , descption : "This a beutiful campground however ypu will have to face some challenges"} , 
// function(err , camp){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(camp)
//     }
// });

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
            res.render("index" , {campgrounds : campgrounds})      
        }
    })
});

// NEW - show form to create new campground
app.get("/campgrounds/new" , function(req , res){
    res.render("new");
});

//SHOW - show the campground with a particular ID
app.get("/campgrounds/:id" , function(req , res){
    Campground.findById(req.params.id , function(err , foundCamp){
        if(err){
            console.log(err)
        }else{
            res.render("show" , {campground : foundCamp})
        }
    })
});

app.listen(process.env.PORT || 3000 , process.env.IP , function(){
    console.log("Yelp Server has started");
})