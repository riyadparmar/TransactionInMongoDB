const express = require("express");
const app = express();
const dbConnect = require("./utils/db");
const router=require('./Routes/transactionRouter');
app.use(express.json());
app.use('/api',router)


app.listen(3000, () => {
    console.log(`Server is listening on port 3000...`);
});

dbConnect();