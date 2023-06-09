import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const keysecret = "ShoaibShoaibShoaibShoaibShoaibSh"

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    }, 
    email:{
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid your email")
            }
        }
    },
    password:{
        type: String,
        required:true,
        minlength:6
    },
    cpassword:{
        type: String,
        required:true,
        minlength:6
    },
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ]
})



/////// hash password 
userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
    next()

})

////token generate    ///  _id:this._id is payload

userSchema.method.generateAuthtoken = async function(){
    try{
        let token3 = jwt.sign({_id:this._id, keysecret},{
            expiresIn:"1d"
        })
        this.tokens = this.tokens.concat({token:token3})
        await this.save()
    }catch (error){}

}


///// createing model user 

const userdb = new mongoose.model("user" , userSchema)

export default userdb