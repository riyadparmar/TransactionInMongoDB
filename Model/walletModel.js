const mongoose=require('mongoose');

const walletSchema=new mongoose.Schema({
    nBalance:{
        type:Number,
        required:true
    },
    iUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {timestamps:true}
)

const wallet=mongoose.model("Wallet",walletSchema);
module.exports=wallet;