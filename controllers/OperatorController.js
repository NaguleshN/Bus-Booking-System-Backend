import OperatorService from '../services/operatorService.js';

class OperatorController {
    constructor() {
        this.operatorService = new OperatorService();
    }

    getBuses = async (req, res) => {
        try {
            const buses = await this.operatorService.getBuses();
            return res.status(200).json({
                success: true,
                message: "Buses fetched successfully",
                data: buses
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    getBus = async (req, res) => {
        try {
            const busId = req.params.id;
            const bus = await this.operatorService.getBus(busId);
            return res.status(200).json({
                success: true,
                message: "Bus fetched successfully",
                data: bus
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    createBus = async (req, res) => {
        try {
            const operatorId = req.user.id;
            const bus = await this.operatorService.creatingBus(operatorId, req.body);
            return res.status(201).json({
                success: true,
                message: "Bus created successfully",
                data: bus
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    updateBus = async (req, res) => {
        try {
            const busId = req.params.id;
            const updatedBus = await this.operatorService.updatingBus(req.body, busId);
            return res.status(200).json({
                success: true,
                message: "Bus updated successfully",
                data: updatedBus
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    deleteBus = async (req, res) => {
        try {
            const busId = req.params.id;
            await this.operatorService.deletingBus(busId);
            return res.status(200).json({
                success: true,
                message: "Bus deleted successfully",
                data: null
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    createTrip = async (req, res) => {
        try {
            const operatorId = req.user.id;
            const trip = await this.operatorService.creatingTrip(operatorId, req.body);
            return res.status(201).json({
                success: true,
                message: "Trip created successfully",
                data: trip
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    updateTrip = async (req, res) => {
        try {
            const userId = req.user.id;
            const tripId = req.params.id;
            const updatedTrip = await this.operatorService.updatingTrip(req.body, tripId, userId);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: updatedTrip
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }

    deleteTrip = async (req, res) => {
        try {
            const userId = req.user.id;
            const tripId = req.params.id;
            await this.operatorService.deletingTrip(userId, tripId);
            return res.status(200).json({
                success: true,
                message: "Trip deleted successfully",
                data: null
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    cancelTrip = async (req, res) => {
        try {
            const userId = req.user.id;
            const tripId = req.params.id;
            const cancelledTrip = await this.operatorService.cancelTrip(userId, tripId);
            return res.status(200).json({
                success: true,
                message: "Trip cancelled successfully",
                data: cancelledTrip
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    getMyTrips = async (req, res) => {
        try {
            const operatorId = req.user.id;
            const trips = await this.operatorService.fetchingTrip(operatorId);
            return res.status(200).json({
                success: true,
                message: "Trips fetched successfully",
                data: trips
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    getTrip = async (req, res) => {
        try {
            const tripId = req.params.id;
            const trip = await this.operatorService.getTrip(tripId);
            return res.status(200).json({
                success: true,
                message: "Trip fetched successfully",
                data: trip
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }
}

export default OperatorController;