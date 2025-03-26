import AdminService from '../services/adminService.js';

class AdminController {
    constructor(){
        this.adminService = new AdminService();
    }
    getUsers = async(req,res) =>{
        try{
            const users = await this.adminService.getAllUsers();
            return res.status(200).json({message:"Fetched success", users})
        }
        catch(err){
            return res.status(400).json({ message: err.message })
        } 
    }
    getUser = async(req,res) =>{
        try{
            const userId = req.params.id ;
            const users = await this.adminService.getAllUser(userId);
            return res.status(200).json({message:"Fetched success", users})
        }
        catch(err){
            return res.status(400).json({ message: err.message })
        } 
    }
    getOperators = async(req,res) =>{
        try{
            const operators = await this.adminService.getAllOperator();
            return res.status(200).json({message:"Fetched success", operators})
        }
        catch(err){
            return res.status(400).json({ message: err.message })
        } 
    }
    getOperator = async(req,res) =>{
        try{
            const operatorId = req.params.id;
            const operators = await this.adminService.getOperator(operatorId);
            return res.status(200).json({message:"Fetched success", operators})
        }
        catch(err){
            return res.status(400).json({ message: err.message })
        } 
    }
    blockUnblock = async(req,res) =>{
        try{
            const userId = req.params.id;
            console.log(userId)
            const user = await this.adminService.blockUnblockUser(userId);
            return res.status(200).json({ message:"Block success", user})
        }catch(err){
            return res.status(400).json({ message: err.message })
        }
    }
    getAllTrips = async(req,res) => {
        try{
            const trips = await this.adminService.getAllTrips();
            return res.status(200).json({ message: "Fetched Trips successfully" ,trips})
        }catch(err){
            return res.status(400).json({ message: err.message })
        }
    }
    getTrip = async(req,res) => {
        try{
            const tripId = req.params.id
            const trips = await this.adminService.getTrip(tripId);
            return res.status(200).json({ message: "Fetched Trips successfully" ,trips})
        }catch(err){
            return res.status(400).json({ message: err.message })
        }
    }

    approveOperator = async(req,res) =>{
        try{
            const operatorId = req.params.id;
            const operator = await this.adminService.approveOperator(operatorId);
            return res.status(200).json({message:"Approved Operator successfully",operator});
        }
        catch(err){
            return res.status(500).json({message:err.message});
        }
    }
}
export default AdminController