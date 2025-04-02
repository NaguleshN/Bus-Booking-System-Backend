import AdminService from '../services/adminService.js';

class AdminController {
    constructor(){
        this.adminService = new AdminService();
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.adminService.getAllUsers();
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.getUser(userId);
            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getOperators = async (req, res) => {
        try {
            const operators = await this.adminService.getAllOperator();
            return res.status(200).json({
                success: true,
                message: "Operators fetched successfully",
                data: operators
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getOperator = async (req, res) => {
        try {
            const operatorId = req.params.id;
            const operator = await this.adminService.getOperator(operatorId);
            return res.status(200).json({
                success: true,
                message: "Operator fetched successfully",
                data: operator
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    blockUnblock = async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await this.adminService.blockUnblockUser(userId);
            return res.status(200).json({
                success: true,
                message: "User block/unblock operation successful",
                data: user
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getAllTrips = async (req, res) => {
        try {
            const trips = await this.adminService.getAllTrips();
            return res.status(200).json({
                success: true,
                message: "Trips fetched successfully",
                data: trips
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    getTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.getTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip fetched successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    updateTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.updateTrip(req.body, tripId);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    cancelTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.adminService.cancelTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip cancelled successfully",
                data: trip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };

    approveOperator = async (req, res) => {
        try {
            const operatorId = req.params.id;
            const operator = await this.adminService.approveOperator(operatorId);
            return res.status(200).json({
                success: true,
                message: "Operator approved successfully",
                data: operator
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    };
}

export default AdminController;
