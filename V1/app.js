var express = require("express");
var app = express();
var bodyParser = require("body-parser")

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));

var campgrounds = [
    {name : "Mount Abu", image:"https://www.outlookindia.com/outlooktraveller/public/uploads/2017/02/mount-abu3-1024x683.jpg"},
    {name : "Kasol" ,  image : "https://static2.tripoto.com/media/filter/tst/img/375011/TripDocument/1521799065_1521799062132.jpg"},
    {name : "Triund" , image : "https://static2.tripoto.com/media/filter/tst/img/294328/TripDocument/1498109303_11403493_10205805061838518_9141468675078132726_n.jpg"},
    {name : "Nainital" , image :"https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/02/Nainital-Winters-October-February.jpg"}
]

app.get("/" , function(req , res){
    res.render("landing");
});

app.post("/campgrounds" , function(req , res){
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name , image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");  //redirect it to get request
})

app.get("/campgrounds" , function(req,res){
    res.render("campgrounds" , {campgrounds : campgrounds})
});

app.get("/campgrounds/new" , function(req , res){
    res.render("new");
});

app.listen(process.env.PORT || 3000 , process.env.IP , function(){
    console.log("Yelp Server has started");
})