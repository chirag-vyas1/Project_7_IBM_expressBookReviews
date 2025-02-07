const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",
    session({secret:"chirag1234",
            resave: true,
            saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

//Write the authenication mechanism here
if (req.session.user){
    console.log("user is Authenticated", req.session.user);
    next();
}
else {
    console.log("User is not authenticated");
    res.status(401).json({message: "Authentication failed"})
}
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
