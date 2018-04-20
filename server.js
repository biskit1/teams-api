const mongoDBConnectionString = "mongodb://cdanzinger:Danzinger1@ds117148.mlab.com:17148/teams-api-db";
const mongoDBConnectionStringAuth = "mongodb://cdanzinger:Danzinger1@ds251849.mlab.com:51849/teams-api-users";
const HTTP_PORT = process.env.PORT || 8080; // Ports must be a numeric value, not a string
// "https://infinite-inlet-51839.herokuapp.com/"


const express = require("express");
const bodyParser = require('body-parser');

const cors = require("cors");
const dataService = require("./data-service.js");
//Register and Login methods
const dataServiceAuth = require("./data-service-auth.js");

const data = dataService(mongoDBConnectionString);
//Initialize the identity + auth data service
const dataAuth = dataServiceAuth(mongoDBConnectionStringAuth);

//passport.js components
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

//JSON web token setup
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configure its options
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
// IMPORTANT - this secret should be a long, unguessable string
// (ideally stored in a "protected storage" area on the
// web server, a topic that is beyond the scope of this course)
// We suggest that you generate a random 64-character string 
// using the following online tool:
// https://lastpass.com/generatepassword.php
jwtOptions.secretOrKey = 'CRORPTuiTChEADricTiNEurELsOphoRkElFLrdNMGLBcLNSRtNLtGWyNDrluRcR';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next){
    console.log('payload received', jwt_payload);

    if(jwt_payload){
        // The followng will ensure that all routes
        // using passport.authenticate have a req.user._id value
        // that matches the request payload's _id
        next(null, { _id: jwt_payload._id });
    } else {
        next(null, false);
    }
});

//Activate the security system
passport.use(strategy);

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// "Employee" Routes

app.get("/employees", (req,res) => {
    data.getAllEmployees().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/employees-raw", (req,res) => {
    data.getAllEmployeesRaw().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/employee/:employeeId", (req,res) => {
    data.getEmployeeById(req.params.employeeId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/employee-raw/:employeeId", (req,res) => {
    data.getEmployeeByIdRaw(req.params.employeeId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.put("/employee/:employeeId", (req, res) => {

    data.updateEmployeeById(req.params.employeeId, req.body).then((data)=>{
        res.json({"message": "Employee " + data + " updated successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.post("/employees", (req, res) => {
    
    data.addEmployee(req.body).then((data)=>{
        res.json({"message": "Employee " + data + " added successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

////////////////////

// "Position" Routes

app.get("/positions", (req,res) => {
    data.getAllPositions().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/position/:positionId", (req,res) => {
    data.getPositionById(req.params.positionId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.put("/position/:positionId", (req,res) => {
    data.updatePositionById(req.params.positionId, req.body).then((data)=>{
        res.json({"message": "Position " + data + " updated successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.post("/positions", (req, res) => {
    
    data.addPosition(req.body).then((data)=>{
        res.json({"message": "Position " + data + " added successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

////////////////////

// "Project" Routes

app.get("/projects", (req,res) => {
    data.getAllProjects().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/project/:projectId", (req,res) => {
    data.getProjectById(req.params.projectId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.put("/project/:projectId", (req,res) => {
    data.updateProjectById(req.params.projectId, req.body).then((data)=>{
        res.json({"message": "Project " + data + " updated successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.post("/projects", (req, res) => {
    
    data.addProject(req.body).then((data)=>{
        res.json({"message": "Project " + data + " added successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

////////////////////

// "Team Routes"

app.get("/teams", (req,res) => {
    data.getAllTeams().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/teams-raw", (req,res) => {
    data.getAllTeamsRaw().then((data)=>{
        res.json(data);
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/team/:teamId", (req,res) => {
    data.getTeamById(req.params.teamId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.get("/team-raw/:teamId", (req,res) => {
    data.getTeamByIdRaw(req.params.teamId).then((data)=>{
        if(data.length > 0){
            res.json(data);
        }else{
            res.status(404).end();
        }
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.put("/team/:teamId", (req,res) => {
    data.updateTeamById(req.params.teamId, req.body).then((data)=>{
        res.json({"message": "Team " + data + " updated successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

app.post("/teams", (req, res) => {
    
    data.addTeam(req.body).then((data)=>{
        res.json({"message": "Team " + data + " added successfully"});
    })
    .catch((err)=>{
        res.status(500).end();
    })
});

////////////////////

// Register & Login Routes

app.post("/register", (req, res) => {
    dataAuth.registerUser(req.body)
    .then((msg) => {
        res.json({ "message": msg });
    }).catch((msg)=>{
        res.status(422).json({ "message": msg });
    });
});

app.post("/login", (req, res) => {
    dataAuth.checkUser(req.body)
    .then((user) => {

        // Configure the payload with claims
        var payload = {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            role: user.role
        };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.json({ "message": "login successful", token: token });

    }).catch((msg) => {
        res.status(422).json({ "message": msg });
    });
});

////////////////////

// Catch-All 404 error

app.use((req, res) => {
    res.status(404).end();
});

// Connect to the DB and start the server

data.connect().then(dataAuth.connect()).then(()=>{
    app.listen(HTTP_PORT, ()=>{console.log("API listening on ip: " + HTTP_PORT)});
})
.catch((err)=>{
    console.log("unable to start the server: " + err);
    process.exit();
});
