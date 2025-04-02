import UserService from "../services/userService.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    getTrips = async (req, res) => {
        try {
            const users = await this.userService.getTrips();
            return res.status(200).json({ 
                success: true,
                message: "Trips fetched successfully", 
                data: users 
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
            const user = await this.userService.getTrip(tripId);
            return res.status(200).json({ 
                success: true,
                message: "Trip fetched successfully", 
                data: user 
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    viewProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            const profile = await this.userService.viewProfile(userId);
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                data: profile
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    updateProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            const update = req.body;
            const user = await this.userService.updateProfile(userId, update);
            return res.status(200).json({
                success: true,
                message: "User profile updated successfully",
                data: user
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    bookTickets = async (req, res) => {
        try {
            const userId = req.user.id;
            const tripId = req.params.id;
            const user = await this.userService.bookTickets(userId, tripId, req.body);
            return res.status(200).json({
                success: true,
                message: "Tickets booked successfully",
                data: user
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    getBookings = async (req, res) => {
        try {
            const userId = req.user.id;
            const bookings = await this.userService.getBookings(userId);
            return res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                data: bookings
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    getBooking = async (req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.userService.getBooking(bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking fetched successfully",
                data: booking
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    cancelBooking = async (req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await this.userService.cancelBooking(bookingId);
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: booking
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
                data: null
            });
        }
    }

    paymentForTickets = async (req, res) => {
        try {
            const userId = req.user.id;
            const bookingId = req.params.id;
            const user = await this.userService.paymentForTickets(userId, bookingId, req.body);
            return res.status(200).json({
                success: true,
                message: "Payment completed successfully",
                data: user
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

export default UserController;