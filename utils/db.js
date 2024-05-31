const mongoose=require('mongoose');

module.exports=function dbConnect(){
mongoose
    .connect("mongodb+srv://riyaparmar:omrowarRRxRz8JbD@practicecluster.qyfvxyq.mongodb.net/Transacation_db?readPreference=secondaryPreferred")
    .then(()=>console.log("Database Connected"))
    .catch((err)=>console.log("MongoDB Connection error",err));
}