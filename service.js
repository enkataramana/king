const express = require('express');
const app = express();

app.use(express.static('public'));
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require("./key1.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public/" + "kingsignup.html");
});

app.get("/signupsubmit", function (req, res) {
  db.collection("personal data")
    .add({
      FullName: req.query.FullName,
      Email: req.query.Email,
      password: req.query.password,
    })
    .then(() => {
      res.send("signup successful. click here to <a href='/login'>login</a>");
    });
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/" + "kinglogin.html");
});
app.get("/gona", function (req, res) {
    const providedEmail = req.query.Email;
    const providedPassword = req.query.password;
  
    db.collection("personal data")
      .where("Email", "==", providedEmail)
      .where("password", "==", providedPassword)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 1) {
          // Login successful
          res.send("Login successful. Click here to <a href='/Dashboard'>Dashboard</a>");
        } else {
          // Login failed
          res.send("Login failed. Please check your credentials and <a href='/login'>try again</a>.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        res.send("An error occurred during login. Please try again.");
      });
  });
  



app.get("/Dashboard", function (req, res) {
  res.sendFile(__dirname + "/public/" + "g.html");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});