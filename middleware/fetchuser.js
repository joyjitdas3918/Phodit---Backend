var jwt=require('jsonwebtoken');
const JWT_SECRET=`${process.env.REACT_APP_NOT_SECRET_CODE}`;
const fetchuser=(req,res, next)=>{
    //get user from the jwt token and add id to req object
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({error: "please authenticate using a valid token"})
    }
    try {
        const data =jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next()
    } 
    catch (error) {
        res.status(401).send({error: "please authenticate using a valid token"})
    }
}

module.exports=fetchuser;