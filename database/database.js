const mongoose = require("mongoose") ;

require("dotenv").config() ;


exports.connect = () => {

        mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("DB connection successful")) 
        .catch((err) => {
            console.log("Failure in Database connection...");
            process.exit(1) ;
        } );
}

