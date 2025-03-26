import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

class AuthMiddleware {
    
    protectUser = async(req,res,next) =>{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken  ; 
        if(!token){
            return res.status(404).json({ error: 'Token not found' });
        }
        console.log("Nagulesh")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        next();
    }

    protectOperator = async(req,res,next) =>{
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
        if(user.role!="operator"){
            return res.status(404).json({ error: 'Not a Operator' });
        }
        next();
    }

    protectAdmin = async(req,res,next) =>{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.AuthToken  ; 
        if(!token){
            // throw new Error("Token Not found");
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
        next();
    }
}

export default AuthMiddleware;