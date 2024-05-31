const mongoose=require('mongoose');

const passbookSchema=new mongoose.Schema({
    iUserId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    iTransactionId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Wallet"
    },
    iRecieverId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    nBalance:{
        type:Number, 
        required:true
    }
},
    {timestamps:true}
)

const passbook=mongoose.model("Passbook",passbookSchema);
module.exports=passbook;