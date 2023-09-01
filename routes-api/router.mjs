import express, { json } from "express"
import userdb from '../model/userSchema.mjs';
import bcrypt from 'bcryptjs';
import cookie from 'cookie-parser';
import Authenticate from "../middleware/Authenticate.mjs";
//import jwt from 'jsonwebtoken';

const router = new express.Router()

// user register data add database signup


router.post('/register',async(req,res)=>{
    // console.log(req.body)

    const {fname, email, password, cpassword } = req.body;

    if(!fname || !email || !password|| !cpassword ){
        res.status(422).json({error:'Please Fill All the details'})
    }

    try{
        const preuser = await userdb.findOne({email:email})
        if(preuser){
            res.status(422).json({error:'This Email Allready   Exist'})
        }else if(password !== cpassword){
            res.status(422).json({error:' Password and Confirm Passwrd not Match '})
        }else{
            const finaluser = new userdb({
                fname, email , password , cpassword
            })
            /// password hashing using bcryptjs 

            const storeData = await finaluser.save();
            // console.log(storeData)
            res.status(201).json({status:201,storeData})
        }         
    } catch (error){
        res.status(422).json(error)
        console.log("catch block error ")

    }
})


// user Login 

router.post("/login", async (req, res)=>{
    const { email, password,  } = req.body;

    if( !email|| !password ){
        res.status(422).json({error:'Please Fill All the details'})
    }

    try{
          const userValid = await userdb.findOne({email:email});

          if(userValid){
              const isMatch =  await bcrypt.compare(password, userValid.password)

            if(!isMatch){
                res.status(422).json({error:'password is not matched'})
            }else{
                /////token generate
                const token = await userValid.generateAuthtoken()
                res.cookie("usercookie", token,{
                    expires:new Date(Date.now()+9000000),
                       httpOnly:true  
                });
                const result = {
                    userValid,
                    token

                }
                res.status(201).json({status:201, result})
            }
          }

    } catch (error){

        res.status(201).json(error)
        console.log("catch block error ")

    }
    
})

router.get("/validuser", Authenticate, async(req, res)=>{
    try{
        const validuserOne = await userdb.findOne({_id:req.userId}) ;
    res.status(201).json({status:201, validuserOne});
    } catch {
        res.status(401).json({status:201, error});
    }
})





export default router

