const express= require("express");
const cors= require("cors");
const {Sequelize, Transaction}= require("sequelize");
const app= express();
const db= require("./models/index");
const cookieParser= require("cookie-parser");
const transactionRouter= require("./routes/transaction");
const userRouter= require("./routes/user");


app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());

app.use(cookieParser());
app.use("/transaction", transactionRouter);
app.use("/", userRouter);

const sequelize = new Sequelize('transaction', 'postgres', 'vasuDEV7?', {
    host: 'localhost',
    dialect: 'postgres', 
  });

//   app.post("/transaction/isolation", async (req, res) => {
//     const { receiver_id, amount } = req.body;
//     const user_id= req.cookies.user_id;
  
//     try {
//       await sequelize.transaction({
//         isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
//       }, async (t) => {
//         const sender = await db.User.findOne({ where: { id: user_id }, transaction: t });
  
//         if (!sender) {
//           throw new Error("Sender not found");
//         }
  
//         if (sender.balance < amount) {
//           throw new Error("Insufficient balance");
//         }
  
//         const receiver = await db.User.findOne({ where: { id: receiver_id }, transaction: t });
  
//         if (!receiver) {
//           throw new Error("Receiver not found");
//         }
  
//         await sender.update({ balance: sender.balance - amount }, { transaction: t });
//         await receiver.update({ balance: receiver.balance + amount }, { transaction: t });
//       });
  
//       res.send({message:"Money transferred successfully"});
//     } catch (err) {
//       console.error("Error occurred:", err);
//       res.status(500).send(err.message);
//     }
//   });

//   app.post("/nontransaction/isolation", async (req, res) => {
//     const { receiver_id, amount } = req.body;
//     const user_id= req.cookies.user_id;
  
//     try {
//       await sequelize.transaction({
//         isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
//       }, async (t) => {
//         const sender = await db.User.findOne({ where: { id: user_id }, transaction: t });
  
//         if (!sender) {
//           throw new Error("Sender not found");
//         }
  
//         if (sender.balance < amount) {
//           throw new Error("Insufficient balance");
//         }
  
//         const receiver = await db.User.findOne({ where: { id: receiver_id }, transaction: t });
  
//         if (!receiver) {
//           throw new Error("Receiver not found");
//         }
  
//         await sender.update({ balance: sender.balance - amount }, { transaction: t });
//         await receiver.update({ balance: receiver.balance + amount }, { transaction: t });
//       });
  
//       res.send({message:"Money transferred successfully"});
//     } catch (err) {
//       console.error("Error occurred:", err);
//       res.status(500).send(err.message);
//     }
//   });

app.post("/transaction/isolation", async (req, res) => {
  console.log(req.body+"inside isolation");
    const { receiver_id, amount } = req.body;
    const user_id= req.cookies.user_id;
  
    try {
      await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
      }, async (t) => {
        const sender = await db.User.findOne({ where: { id: user_id }, transaction: t });
  
        if (!sender) {
          throw new Error("Sender not found");
        }
  
        if (sender.balance < amount) {
          throw new Error("Insufficient balance");
        }
  
        const receiver = await db.User.findOne({ where: { id: receiver_id }, transaction: t });
  
        if (!receiver) {
          throw new Error("Receiver not found");
        }
  
        await sender.update({ balance: sender.balance - amount }, { transaction: t });
        await receiver.update({ balance: receiver.balance + amount }, { transaction: t });
      });
  
      res.send({message:"Money transferred successfully with SERIALIZABLE isolation"});
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).send(err.message);
    }
  });
  
  // Endpoint with READ_UNCOMMITTED isolation level
  app.post("/nontransaction/isolation", async (req, res) => {
    const { receiver_id, amount } = req.body;
    const user_id= req.cookies.user_id;
  
    try {
      await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
      }, async (t) => {
        const sender = await db.User.findOne({ where: { id: user_id }, transaction: t });
  
        if (!sender) {
          throw new Error("Sender not found");
        }
  
        if (sender.balance < amount) {
          throw new Error("Insufficient balance");
        }
  
        const receiver = await db.User.findOne({ where: { id: receiver_id }, transaction: t });
  
        if (!receiver) {
          throw new Error("Receiver not found");
        }
  
        await sender.update({ balance: sender.balance - amount }, { transaction: t });
        await receiver.update({ balance: receiver.balance + amount }, { transaction: t });
      });
  
      res.send({message:"Money transferred successfully with READ_UNCOMMITTED isolation"});
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).send(err.message);
    }
  });



app.listen(5002, ()=>console.log("listening to 5002"));