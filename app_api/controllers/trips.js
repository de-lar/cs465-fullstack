const mongoose = require('mongoose');
const Trip = require('../models/travlr.js');
//const Model = mongoose.model('trips');

const tripsList = async(req, res) => {
    const q = await Trip
    .find({})
    .exec();
    console.log(q);
    if(!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
        .status(200)
        .json(q);
    }
};

const tripsFindByCode = async(req, res) => {
    const q = await Trip
    .find({'code' : req.params.tripCode})
    .exec();
    console.log(q);
    if(!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
        .status(200)
        .json(q);
    }
};

const tripsUpdateTrip = async (req, res) => {
  getUser(req, res,
  (req, res) => {
  Trip
  .findOneAndUpdate({'code': req.params.tripCode },{
  code: req.body.code,
 name: req.body.name,
 length: req.body.length,
 start: req.body.start,
 resort: req.body.resort,
 perPerson: req.body.perPerson,
 image: req.body.image,
 description: req.body.description
  }, { new: true })
  .then(trip => {
  if (!trip) {
  return res
  .status(404)
 .send({
  message: "Trip not found with code" + req.params.tripCode
  });
  }
 res.send(trip);
  }).catch(err => {
  if (err.kind === 'ObjectId') {
  return res
  .status(404)
 .send({
  message: "Trip not found with code" + req.params.tripCode
  });
  }
 return res
  .status(500) // server error
 .json(err);
  });
  }
  );
 } 

  const tripsAddTrip = async (req, res) => {
    getUser(req, res,
    (req, res) => {
    Trip
    .create({
    code: req.body.code,
   name: req.body.name,
   length: req.body.length,
   start: req.body.start,
   resort: req.body.resort,
   perPerson: req.body.perPerson,
   image: req.body.image,
   description: req.body.description
    },
    (err, trip) => {
    if (err) {
    return res
    .status(400) // bad request
   .json(err);
    } else {
    return res
    .status(201) // created
   .json(trip);
    }
    });
    }
    );
   }

const getUser = (req, res, callback) => {

  console.log('in #getUser');
  console.log(req.payload.email);
  
  if (req.auth && req.auth.email) {

  if (req.payload && req.payload.email) {
      User
          .findOne({ email : req.auth.email })
          .exec((err, user) => {
              if (!user) {
                  return res  
                      .status(404)
                      .json({"message": "Email not found"});
              } else if (err) {
                  console.log(err);
                  return res
                      .status(404)
                      .json(err);

              }
              callback(req, 
                  res.json({"message": "User found"}), 
                  console.log('callback'),
                  console.log(req.auth)
                  
                  );


              });
  } else {
      
      return res
          .status(404)
          .json({"message": "User was not found"});
          console.log(req.payload);
          
  }
  } else {
      return res
          .status(404)
          .json({"message": "User was not found"});
          console.log(req.payload);
  }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsUpdateTrip,
    tripsAddTrip
};