const express = require('express')

const fetch =  require('node-fetch');

const _ = require('lodash');

const router = express.Router();

const Driver = require('../../models/driver');


// Sample API for adding driver data into DB
router.post('/drivers', async (req, res, next) => {

    try {

  var driver =   await createDriver({

        driverName: req.body.driverName,
        driverRating: req.body.driverRating,
        vehicleNumber: req.body.vehicleNumber,

        currentLocation: {
            type: 'Point',
            coordinates: [req.body.lon, req.body.lat]
        }
    })
    
    res.status(201).json(driver);

    }catch( e){
        console.log(e)
        res.status(400).json({error:e}) ;
    }


})

router.post('/bookings', async(req, res, next) => {

    try {

        //Book a ride

        var sourceLong = req.body.sourceLong;
        var sourceLat = req.body.sourceLat;

        var destLong = req.body.destLong;
        var destLat = req.body.destLat;


        var userNumber = req.body.userNumber;
        
         // These paramters pass to careem service that will check the availability of drivers    

        //Would be done by Careem

        var queryPayload = {
            currentLocation: {
             $near: {
              $maxDistance: 1000,
              $geometry: {
               type: "Point",
               coordinates: [sourceLong, sourceLat]
              }
             }
            }
           }

        //Finding nearest driver 
        var drivers  = await getNearestDriver(queryPayload)

        // SMS sent back to customer

           console.log(drivers);
        if (_.isEmpty(drivers)) {
            res.status(404).json({message:"No driver found"});
        }else{
            res.status(200).json(drivers);
        }
      


        

      //  res.status(200).json(response);

    } catch (err) {
        console.log(err);
        next({
            status: 500,
            message: err
        });
    }
});

//  
router.post('/drivers/available', (req, res, next) => {


    var location = req.body.sourceLatLang;


    //Send location to careem to update its source location
    res.status(200).json({
        response: "Driver available"
    });

});


router.post('/invitations', (req, res, next) => {

    var isAccepted = req.body.isAccepted;
    
    if (isAccepted) {
        // Call API to fetch te steps from Google

        //Send these steps to driver and user

        smsGoogleDirections();
    }

    //Send location to careem to update its source location
    res.status(200).json({
        response: "Driver available"
    });

});

router.post('/directions', async(req, res, next) => {

    var sourceLocation = req.body.source;
    var destinationLocation = req.body.destination;

    // try{
        
    //     var steps = fetch("https://script.google.com/macros/s/AKfycbwEydaZiKNHCQGdNSgC8rQx6EQBKLtHman1ZAVU3cu4uxTnuh-E/exec?source="+sourceLocation+"&dest="+destinationLocation)
    //     .then(res => res.text())
    //     .then(json => resolve(json));
        
    // }catch(e){
    // console.log(e);
    // }

    

  //  var directions = await fetchGoogleDirections(sourceLocation,destinationLocation);

  var directions = fetch("https://script.google.com/macros/s/AKfycbwEydaZiKNHCQGdNSgC8rQx6EQBKLtHman1ZAVU3cu4uxTnuh-E/exec?source="+sourceLocation+"&dest="+destinationLocation)
  .then(resp => resp.text())
  .then(json => res.json(json.split('\n')));

  
    //console.log(directions);
    // res.status(200).json({
    //     response: directions
    // });


});



async function getNearestDriver(query) {

    return new Promise((resolve, reject) => {
        
        Driver.find(query).lean()
        .then((driver)=>{
            resolve(driver)
        }).catch(e=>{
            reject(e);
        });
    });

}

async function createDriver(driverReq) {

    return new Promise((resolve, reject) => {
        const driver = new Driver(driverReq);

        driver.save().then((savedObj) => {
            resolve(savedObj);
        }).catch(err => {
            console.log(err);
            reject();
        })

    });

}




function fetchGoogleDirections(source,destination) {

    return new Promise(async(resolve, reject) => {
        //https://script.google.com/macros/s/AKfycbwEydaZiKNHCQGdNSgC8rQx6EQBKLtHman1ZAVU3cu4uxTnuh-E/exec?source="DHA phase 5, Lahore"&dest="Kalma Chowk, Lahore"
      
        // var steps = await fetch("https://script.google.com/macros/s/AKfycbwEydaZiKNHCQGdNSgC8rQx6EQBKLtHman1ZAVU3cu4uxTnuh-E/exec?source="+source+"&dest="+destination).catch(e=>{
        //     console.log('Error while fetching steps');
        //     reject(e);
        // });


        await fetch("https://script.google.com/macros/s/AKfycbwEydaZiKNHCQGdNSgC8rQx6EQBKLtHman1ZAVU3cu4uxTnuh-E/exec?source="+sourceLocation+"&dest="+destinationLocation)
        .then(res => res.text())
        .then(json => resolve(json));
        

       

    })
}

function smsGoogleDirections() {

    return new Promise((resolve, rejec) => {
        //Send the directions via SMS Gateway
        resolve()
    })
}


module.exports = router;