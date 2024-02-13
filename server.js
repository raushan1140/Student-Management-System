const express = require("express") ;
const app = express() ;


// adding middlewares
app.use(express.json()) ;
app.use(express.urlencoded()) ;
const cors = require("cors") ;
app.use(cors()) ;           // for frontend-backend connectivity 

require("dotenv").config() ;
const cookieParser = require("cookie-parser") ;
const session = require("express-session");
app.use(cookieParser()) ;
app.use(session({
    secret:'secretKey',
    cookie:{
        maxAge: 2 * 60 * 1000,
    },
    resave:true,
    saveUninitialized:false,
})) ;

app.set('view engine' , 'hbs') ;
app.set('views' , './views') ;




// controllers
const {showAllStudents , showStudentByRoll , addStudent , updateStudent , deleteByRoll, login , signup} = require("./controllers/control") ;

// middlewares
function isLoggedIn(req,res,next){
    
    if(req.session.loggedIn){
        next() ;
    }
    else{
        res.redirect('/') ;
    }
}




// login 
app.get('/' , (req,res)=> res.render('loginPage')) ;
app.post('/login' , login) ;

// signup
app.get('/signup' , (req,res)=> res.render('signupPage')) ;
app.post('/signup' , signup);


// getting all students
app.get('/students' , showAllStudents) ;


// getting student with given rollno
app.get('/students/:rollno' , showStudentByRoll) ;


// adding new student
app.post("/addStudent" , addStudent) ;

// update student
app.put("/update/:rollno", updateStudent) ;


// delete Student
app.delete("/delete/:rollno" , deleteByRoll);


// protected routes
// app.get("/protected" , isLoggedIn ,(req,res)=>{
//     res.send(`Welcome ${req.session.loggedInUser.companyName}`) ;
// });

app.get("/index" , isLoggedIn , (req,res)=>{
    let user = req.session.loggedInUser ;
    res.render('index' , {user}) ;
});


app.get('/addStudentPage' ,isLoggedIn , (req,res)=> res.render('addStudentPage')) ;
app.get('/deleteStudentPage' , isLoggedIn ,(req,res)=> res.render('deleteStudentPage')) ;
app.get('/updateStudentPage' , isLoggedIn ,(req,res)=> res.render('updateStudentPage')) ;



// database connection
require("./database/database").connect() ;

app.listen(process.env.PORT , ()=>{
    console.log(`server listening at http://localhost:3000 `) ;
});

