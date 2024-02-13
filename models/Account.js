const mongoose = require("mongoose") ;

const accountSchema = new mongoose.Schema({
    companyName : {
        type: String ,
        required : true ,
    },
    companyCode:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model("Account" , accountSchema);