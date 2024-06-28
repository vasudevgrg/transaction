const db= require("../models/index");
const Sequelize= require("sequelize");

const sequelize = new Sequelize('transaction', 'postgres', 'vasuDEV7?', {
    host: 'localhost',
    dialect: 'postgres', 
  });

const cretaeUser=async (req, res) => {
    const { name, username, password, balance } = req.body;
    let t;
  
    try {
      t = await sequelize.transaction();
      const user = await db.User.create({ name, username, password, balance }, { transaction: t });
      await t.commit();
      res.send("user created");
    } catch (err) {
      if (t) await t.rollback();
      res.status(500).send("error occurred while creating user");
    }
  };

  const getUsers=async (req, res)=>{
    const allUsers= await db.User.findAll({});
    res.send({users:allUsers});
};

const getUser= async (req, res)=>{
    const user_id= req.cookies.user_id;
    console.log(user_id+"hey");
    const user= await db.User.findOne({
        where:{
            id: user_id
        }
    });
    res.send({"user":user});
};

module.exports={cretaeUser, getUser, getUsers};