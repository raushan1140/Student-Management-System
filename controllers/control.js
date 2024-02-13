
const Student = require("../models/Student") ;
const Account = require("../models/Account") ;
const bcrypt = require("bcrypt") ;
// const jwt = require("jsonwebtoken") ;
const session = require("express-session") ;

require("dotenv").config() ;


// login handler
exports.login = async(req,res) =>{

    try{

        let { companyCode , email } = req.body ;
    
        // validation
        if(!companyCode || !email){
    
            return res.status(400).json({
                success:false ,
                message:"Please Enter the Company Code ..." ,
            })
        } ;
    
        // check if user present
        let user = await Account.findOne({email}) ;
    
        if(!user){
            alert("Account Not present") ;
            return res.status(400).json({
                success:false ,
                message:"Account not present" ,
            }) ;
        } ;
    
        // now check if password matches 
        if(await bcrypt.compare(companyCode , user.companyCode)){

            req.session.loggedInUser = user ;
            req.session.loggedIn = true ;

            return res.status(200).json({
                loggedInUser:user,
                success:true,
                message:"user logged in successfully",
            })

        }
        else{           // password not matches
            return res.status(403).json({
                success:false,
                message:"Wrong Password" ,
            }) ;
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });
    } ;

}

// signup handler
exports.signup = async(req,res)=>{
    try{
        const {companyName , companyCode , email} = req.body ;

        if(!companyCode || !companyName || !email){
            return res.status(400).json({
                success:false ,
                message:"Details not filled properly.." , 
            });
        };

        const existingUser = await Account.findOne({email}) ;

        if(existingUser){
            return res.status(400).json({
                success:false ,
                message:"company already registered.." , 
            });
        };

        
        // hash the company code
        let hashCode ;
        try{
            hashCode = await bcrypt.hash(companyCode , 10) ;
        }
        catch(error){
            return res.status(500).json({
                success:false ,
                message:"Error in hashing company code.." , 
            });
        } ;


        // create entry for new company
        const user = await Account.create({
            companyName,
            companyCode: hashCode,
            email,
        });

        return res.status(200).json({
            success:true,
            message: "Company Created Successfully",
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"signup Failure",
        });
    }
}


// showing all students
exports.showAllStudents = async(req , res) =>{

    try{
        const list = await Student.find() ;
        res.send(list) ;
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error in fetching all students list",
        }) ;
    }

};


// showing specific student with rollno.
exports.showStudentByRoll = async(req , res)=>{
    try{
        const {rollno} = req.params ;

        const requiredStudent = await Student.findOne({rollno}) ;

        if(!requiredStudent){
            return res.status(500).json({
                success:false,
                message:"No Such Student Present",
            });
        } ;

        res.status(200).json({
            success:true,
            message:"student found !!",
            student: requiredStudent,
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error in fetching Student!!",
        });
    }

};


//adding new student (signup)
exports.addStudent = async(req,res)=>{
    try{
        const {name , email , rollno} = req.body ;
    
        const stu = await Student.findOne({rollno}) ;
    
        // if student already present
        if(stu){
            return res.status(400).json({
                success:false,
                message:"Student with same rollno Already exist..",
            })
        };
    
        const newStud = await Student.create({
            name: name,
            rollno: rollno,
            email: email,
        });
    
        return res.status(200).json({
            success:true,
            message:"New Student Created Successfully",
            stu:newStud,
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error in creating a new Student..",
        })
    }


}

// updating student
exports.updateStudent = async(req,res)=>{

    try{

        const previousRoll = req.params.rollno ;

        const {name , email , rollno} = req.body ;

        // check if student is present in db or not
        const stu = await Student.findOne({rollno:previousRoll}) ;

        if(!stu){
            return res.status(400).json({
                success:false,
                message:"No such Student found",
            })
        };

        const updatedStu = await Student.findOneAndUpdate({rollno: previousRoll} , {
            rollno: rollno,
            name: name,
            email: email,
        });

        res.status(200).json({
            success:true,
            message:"Data Updated Successfully",
            updated: updatedStu,
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error in updating Student details",
        });
    }
}


// deleting the specific student
exports.deleteByRoll = async(req,res)=>{
    try{
        const {rollno} = req.params ;

        const stu = await Student.findOne({rollno:rollno}) ;

        // if student not present in the database, send error response
        if(!stu){
            return res.status(400).json({
                success:false,
                message:"No Such Present !!",
            });
        } ;

        // delete the student from the database
        await Student.findOneAndDelete({rollno:rollno}) ;

        return res.status(200).json({
            success:true,
            message:"Student deleted Successfully",
        })

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error in fetching Student!!",
        });
    }
}


