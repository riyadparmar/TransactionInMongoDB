const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    sName:{
        type:String,
        required:true,
    },
    sEmail:{
        type:String,
        required:true
    },
    sPassword:{
        type:String,
        required:true
    },

},
    {timestamps:true}
)

const user=mongoose.model("User",userSchema);
module.exports=user;