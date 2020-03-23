var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var bcrypt = require('bcryptjs');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About'});
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

//GET /register
router.get('/register',function(req,res,next){
  return res.render("register",{title:"Register"});
});

//POST /register
router.post('/register',function(req,res,next){
  if(req.body.name && req.body.email && req.body.dob && req.body.password && req.body.confirmPassword)
  {
    //IF the passwords do not match
    if(req.body.password !== req.body.confirmPassword)
    {
      var error = new Error("Password Do Not Match :(");
      error.status=400;
      return next(error);
    }
    else
    {
      //Create a object
      var userData = {
        name:req.body.name,
        email:req.body.email,
        dob:req.body.dob,
        password:req.body.password
      };

      //Create a new document in the User collection
      User.create(userData,function(error,user){
        if(error)
        {
          return next(error);
        }
        else
        {
          //Create Session for logged in User
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    }
  }
  else
  {
    var error = new Error("All Fields Must be Filled!");
    error.status=400;
    return next(error);
  }
});

// GET /login
router.get("/login",function(req,res,next){
  res.render("login");  
});

//POST /login
router.post("/login",function(req,res,next){
  User.authenticate(req.body.email,req.body.password,function(err,user){
    if(err || !user)
    {
      var error = new Error("Invalid Email or password");
      error.status = 401;
      next(error);
    }
    else
    {
      //Create Session for logged in User
      req.session.userId = user._id;
      res.redirect('/profile');
    }
  });
});

// GET /profile
router.get("/profile",function(req,res,next){
  var posts;
  if(!req.session.userId)
  {
    var err = new Error("You are not authorized to view this page");
    err.status = 401;
    return next(err);
  }
  else
  {
    User.findById(req.session.userId).exec(function(err,user){
      if(err)
      {
        return next(err);
      }
      else
      {
        Post.find({publisherId:user._id}).exec(function(err,post){
          if(err)
            return next(err);
          else
          {
            posts = post;
            if(posts.length === 0)
              res.render("profile",{title:'Profile',name:user.name});
            else
            res.render("profile",{title:'Profile',name:user.name,posts});
          }
        });
      }
    });
  }
});

router.get("/logout",function(req,res,next){
  if(req.session)
  {
    req.session.destroy(function(err){
      if(err)
      {
        return next(err);
      }
      else
      {
        res.redirect("/");
      }
    });
  }
});

router.get("/note",function(req,res,next){
  if(req.session.userId)
    res.render("note",{title:"Note"});
    else
    {
      res.redirect("/");
    }
});

router.post("/note",function(req,res,next){
  if(req.session.userId)
  {
    if(req.body.title && req.body.description)
    {
      var userId = req.session.userId;
      var date = new Date();

      var postData = {
        title:req.body.title,
        description:req.body.description,
        publishDate:date,
        publisherId:userId
      }

      //Inserting the record
      Post.create(postData,function(error,post){
        if(error)
        {
          return next(err);
        }
        else
        {
          res.redirect("/profile");
        }
      });

    }
    else
    {
      var error = new Error("Please Fill All Fields");
      error.status=401;
      return next(error);
    }
  }
  else
  {
    res.redirect("/login");
  }
});

router.post("/delete",function(req,res,next){
  var postId = req.body.id;
  Post.findByIdAndDelete(postId,function(err,result){
    if(err)
      return next(err);
    else
      return result;
  });
});

router.post("/update",function(req,res,next){
  var postId = req.body.id;
  var updatedDocuments = {
    title:req.body.title,
    description:req.body.description
  };
  Post.findByIdAndUpdate(postId,updatedDocuments,function(err,result){
    if(err)
      return next(err);
    else
      return result;
  });
});



module.exports = router;
