var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//authentication function
UserSchema.statics.authenticate = function(email,password,callback)
{
  User.findOne({email:email}).exec(function(err,user){
    if(err)
      return callback(err);
    else if(!user)
    {
      var error = new Error("User not found");
      error.status = 401;
      return callback(error);
    }
    else
    {
      bcrypt.compare(password,user.password,function(err,result){
        if(result === true)
          return callback(null,user);
        else
          return callback();
      });
    }
  });
}

//hash the password before saving the data to the database
UserSchema.pre('save',function(next){
  var user = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err)
        {
          return next(err);
        }
        else
        {
          user.password = hash;
          next();
        }
    });
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;