const express= require("express");
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing');

require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));
// app.use("/public",express.static(__dirname+"/public"));




mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER
});
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})
 
app.post("/", function(req, res){
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);
  console.log(req.body.registrationId)   

 
 
  const listId = "61137eb2ab";
  const subscribingUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      regId:req.body.registrationId
  };
 
  async function run() {
      try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName,
              // email: subscribingUser.email,
              regID: subscribingUser.registrationId,
              
            }
          });
 
          console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
          );
 
          res.sendFile(__dirname + "/success.html");
      } catch (e) {
          res.sendFile(__dirname + "/failure.html");
      }
  }
 
  app.post("/failure" , function(req,res){
    res.redirect("/");
  });

  run();
})

const port = process.env.PORT || 3000;
app.listen(port,function(){  console.log('starting server at '+port);
});

// api keys for mailchimp 28b2058a4a8ac4482f09e5e5fd27f34a-us21

// audience id  61137eb2ab

// server prefix  us21