const express= require("express");
const { atomicity } = require("../controllers/transaction");
const router= express.Router();

router.post("/atomicity",atomicity);


module.exports=router;
