const db= require("../models/index");
const Sequelize= require("sequelize");

const sequelize = new Sequelize('transaction', 'postgres', 'vasuDEV7?', {
    host: 'localhost',
    dialect: 'postgres', 
  });

const atomicity= async (req, res)=>{
    console.log(req.body);
    const {receiver_id, amount}= req.body;
    const user_id= req.cookies.user_id;

    try{
        await sequelize.transaction(async (t)=>{
            
            const sender= await db.User.findOne({where:{
                id:user_id
            }},{transaction:t});

            console.log(sender.balance);

            if(sender.balance<amount){
               throw new Error("insufficient balance");
            }
           
          
        
            const receiver= await db.User.findOne({where:{
                id:receiver_id
            }},{transaction:t});

            console.log(receiver);
            if(!receiver){
                throw new Error("no receiver found");
            };
            await db.User.update({balance:sender.balance-amount}, {where:{id: user_id}},{transaction:t});
            await db.User.update({balance:amount+receiver.balance},{where:{id: receiver_id}});
            res.send("money transfered");
        
        })
    }catch(err){
        console.log(err);
        
        res.send({err:err});
    }
  };


  module.exports={atomicity};