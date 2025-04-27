import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    lastName:{
        type : String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String ,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin","operator"],
        default:"user"
    },
    companyName :{
        type:String,
        default:''
    },
    isVerified:{
        type:Boolean,
        default:true
    },
    bookings:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Booking"
        }
    ],
    isBlocked:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});


userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}


const userModel = mongoose.model("User", userSchema);
export default userModel;