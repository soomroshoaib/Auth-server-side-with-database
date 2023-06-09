import express, { json } from "express"
import userdb from '../model/userSchema.mjs';
import bcrypt from 'bcryptjs';

const router = new express.Router()

// user register data add database

router.post('/register',async(req,res)=>{
    // console.log(req.body)

    const {fname, email, password, cpassword } = req.body;

    if(!fname || !email|| !password|| !cpassword ){
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
            const isMatch =  await bcrypt.compare(password,userValid,password)

            if(!isMatch){
                res.status(422).json({error:'password is not matched'})
            }else{
                /////token generate
                const token = await userValid.generateAuthtoken()
                console.log(token)
            }
          }

    } catch (error){

    }
    
})




export default router