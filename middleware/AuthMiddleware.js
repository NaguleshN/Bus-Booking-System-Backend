import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

class AuthMiddleware {
    
    protectUser = async(req,res,next) =>{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken  ; 
        if(!token){
            return res.status(404).json({ error: 'Token not found' });
        }
        console.log("Nagulesh")
        console.log(token);
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded :",decoded);
        }catch(err){
            return res.status(404).json({ error: 'Token is not valid' });
        }
        console.log("suuceess")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select('-password');
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    }

    protectOperator = async(req,res,next) =>{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken  ; 
        if(!token){
            return res.status(404).json({ message: 'Token not found' });
        }
        console.log("Nagulesh")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user ) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.role!="operator"){
            return res.status(401).json({ messsage: 'Not a Operator' });
        }
        req.user = user;
        console.log(user);
        next();
    }

    protectAdmin = async(req,res,next) =>{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken  ; 
        if(!token){
            return res.status(404).json({ error: 'Token not found' });
        }
        console.log("Nagulesh")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user ) {
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.role!="admin"){
            return res.status(404).json({ error: 'Not a admin' });
        }
        console.log(user);
        req.user = user;
        next();
    }
}

export default AuthMiddleware;