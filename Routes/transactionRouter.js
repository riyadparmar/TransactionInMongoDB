const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../Model/userModel");
const Wallet = require("../Model/walletModel");
const Passbook = require("../Model/passbookModel");

//manual transaction
router.post("/register", async (req, res) => {
  const session = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session.startTransaction(transactionoption);
  try {
    const user = await User.create([req.body], { session });

    const wallet = await Wallet.create(
      [{ nBalance: 1000, iUserId: user[0]._id }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .send({ message: "User Successfully registered", user, wallet });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ error: error.message });
  }
});

//automatic transaction

router.post('/register',async(req,res)=>{
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async()=>{
            const user=await User.create([req.body],{session})
            const wallet=await Wallet.create([{nBalance:0,user:user[0]._id}],{session})

            return res.status(200).send({message:"User Successfully registered",user, wallet})
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
})

//manual transaction
router.post("/transaction/manual", async (req, res) => {
  const session = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session.startTransaction(transactionoption);
  try {
    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalance: -100 } },
      { session }
    );

    await Wallet.updateOne(
      { iRecieverId: req.body.iRecieverId },
      { $inc: { nBalance: 100 } },
      { session }
    );
    const walletdata = await Wallet.findOne({ iUserId: req.body.iUserId });
  
    await Passbook.create([
      {
        iUserId: req.body.iUserId,
        // iTransactionId: req.body.walletId,
        iRecieverId: req.body.iRecieverId,
        // nBalance: walletdata.nBalance,
      },
    ]);
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ message: "Transaction Successful" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ error: error.message });
  }
});

// automatic transaction
router.post("/transaction/auto", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Wallet.updateOne(
        { iUserId: req.body.iUserId },
        { $inc: { nBalance: -100 } },
        { session }
      );

      await Wallet.updateOne(
        { iRecieverId: req.body.iRecieverId },
        { $inc: { nBalance: 100 } },
        { session }
      );

      return res.status(200).send({ message: "Transaction Successful" });
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// create two session and try to update data in collection
router.post("/transaction3", async (req, res) => {
  const session1 = await mongoose.startSession();
  const session2 = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session1.startTransaction(transactionoption);
  session2.startTransaction(transactionoption);
  try {
    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalance: 100 } },
      { session: session1 }
    );

    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalance: 200 } },
      { session: session2 }
    );

    await session1.commitTransaction();
    session1.endSession();
    await session2.commitTransaction();
    session2.endSession();
    return res.status(200).send({ message: "Transaction Successful" });
  } catch (error) {
    await session1.abortTransaction();
    session1.endSession();
    await session2.abortTransaction();
    session2.endSession();
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;