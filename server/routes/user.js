const express= require("express");
const { cretaeUser, getUser, getUsers } = require("../controllers/user");
const router= express.Router();

router.post("/createUser",cretaeUser);
router.get("/getUser", getUser);
router.get("/getUsers", getUsers);


module.exports=router;