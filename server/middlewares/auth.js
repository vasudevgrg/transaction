const authenticate=async (req,res, next)=>{
    const allUsers= await db.User.findAll();
    allUsers.map(e=>{
        if(e.username==req.body.username){
            res.send("user exists");
        }
    });
    next();

}