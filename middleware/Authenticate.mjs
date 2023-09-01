import jwt from 'jsonwebtoken';
import userdb from '../model/userSchema.mjs';
const keysecret = "ShoaibShoaibShoaibShoaibShoaib"





const authenticate = async function (req,res,next) {
    try {
        const token = req.headers.authorization;
        // console.log("token: ", token);
        // console.log("req: ", req);
        const verfy = jwt.verify(token,keysecret);
        //  console.log(verfy);
        const rootUser = await userdb.findOne({_id:verfy._id});
        // console.log(rootUser)
        if(!rootUser) {throw new Error("user is not found")}
        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id
        next()
    } catch (error) {
        res.status(401).json({status:401, message:"Unanthorized no token provide"})
    }

}

export default authenticate 