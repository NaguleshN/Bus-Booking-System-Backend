import userModel from '../models/userModel.js';

import AuthService from '../services/authService.js';
import OperatorService from '../services/operatorService.js';

class OperatorController {
    constructor(){
        this.operatorService = new OperatorService();
    }

    createBus = async(req,res) =>{
        try{
            
            const user = await this.operatorService.creatingBus(req.body);
            return res.status(201).json({message : "Bus created successfuly"})
        }catch(error){
            return res.status(404).json({message : error.message})
        }
    }
    updateBus = async(req,res) => {
        try{
            const busId  = req.params.id ;
            console.log(busId);
            
            const user = await this.operatorService.updatingBus(req.body ,busId);
            return res.status(201).json({message:"Bus updated successfully"})
        }
        catch(err){
            return res.status(400).json({message:err.message})
        }
    }
    deleteBus = async(req,res) =>{
        try{
            const busId  = req.params.id ;
            console.log(busId);
            await this.operatorService.deletingBus(busId);
            res.status(201).json({message:"Bus deleted successfully"})
        }
        catch(error){
            res.status(500).json({message:error.message})
        }
    }

    createTrip = async(req ,res) =>{
        try{
            const user = await this.operatorService.creatingTrip(req.body);
            return res.status(201).json({message : "trip created successfuly"})
        }catch(error){
            return res.status(404).json({message : error.message})
        }
    }

    updateTrip = async(req ,res) =>{
        try{
            const tripId = req.params.id;
            console.log(tripId);
            const user = await this.operatorService.updatingTrip(req.body,tripId);
            return res.status(201).json({message : "trip updated successfuly"})
        }catch(error){
            return res.status(404).json({message : error.message})
        }
    }

    deleteTrip = async(req,res) => {
        try{
            const tripId = req.params.id;
            console.log(tripId);
            const user = await this.operatorService.deletingTrip(tripId);
            return res.status(201).json({ message:"Deleted Successfully" })
        }
        catch(err){
            return res.status(500).json({ message:err.message })
        }
    }

    getMyTrips = async (req,res) =>{
        try{
            const operatorId = req.params.id;
            console.log(operatorId)
            const getTrips = await this.operatorService.fetchingTrip(operatorId);
            // console.log(getTrips)
            return res.status(200).json({message:"Trips fetched",getTrips})
        }catch(err){
            return res.status(500).json({message:err.message})
        }
      
    }
}

export default OperatorController;