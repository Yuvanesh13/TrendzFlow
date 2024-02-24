const express=require("express");
const bodyParser=require("body-parser");
const bcrypt=require("bcryptjs");
const saltRounds = 10;
const mongoose=require("mongoose");
const ejs=require("ejs");
require('dotenv').config()
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect(process.env.KEY,{useNewURLParser:true});

const shopUserSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  password:String
});

const buyerSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  emailid:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  mobile:{
    type:Number,
    required:true
  }
});

const shopUser=new mongoose.model("Shop",shopUserSchema);

const productUser=new mongoose.model("Product",buyerSchema);

app.get("/",function(req,res){
  res.render("home");
})

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
// Store hash in your password DB.
const newShopUser=new shopUser({
  email:req.body.username,
  password:hash
});
newShopUser.save(function(err){
  if(err){
    console.log(err);
    res.send(err);
  }
  else{

    res.render("shop");
  }
});
});
});


app.post("/login",function(req,res){
  const username=req.body.username;
  // const password=md5(req.body.password);
  const password=req.body.password;
  shopUser.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
    if(result==true){
      res.render("shop")
    }
});

      }
    }
  })
});

app.get("/product",function(req,res){
  res.render("product");
});
app.post("/product",function(req,res){
  const newuser=new productUser({
    name:req.body.name,
    address:req.body.address,
    emailid:req.body.emailid,
    location:req.body.location,
    mobile:req.body.mobile
  });
  newuser.save(function(err){
    if(!err){
        res.render("order",{orderID:newuser.id});
    }
    else{
      res.send(err);
    }
  })
})

let port=process.env.PORT;
app.listen(port || 3000, function() {
  console.log("Server started on port 3000");
});
