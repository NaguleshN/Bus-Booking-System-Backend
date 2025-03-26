import userModel from '../models/userModel.js';
import busModel from '../models/busModel.js';
import tripModel from '../models/tripModel.js';

class OperatorService {
    getBus = async() =>{
        const buses = await busModel.find();
        return buses;
    }
    creatingBus = async ({ operatorId, busNumber, busType, seats, amenities}) =>{
        const operator = await userModel.findById(operatorId);
        console.log(operatorId)
        console.log(operator)

        const existBus = await busModel.findOne({busNumber})
        if(existBus){
            throw new Error("Bus already exists")
        }
        if(!operator || operator.role !="operator"){
            throw new Error("Operator is Invalid");
        }
        const validBustypes = ['Sleeper', 'AC', 'Non-AC', 'Seater'];
        if(!validBustypes.includes(busType)){
            throw new Error("Bus Type is not Valid");
        }

        const seatLayout = seats.map(seat => ({
            seatNumber: seat.number,
            isBooked: seat.booked || false
        }));
        // Add validation
        console.log(seats.length)
        if (seats.length === 0) 
            throw new Error('At least one seat required');
        const bus = await busModel.create({
            operatorId,
            busType,
            busNumber,
            setlayout: seatLayout,
            amenities: amenities ,
            totalSeats: seats.length
        });
        console.log(bus) 
        return bus;
    }

    updatingBus = async (busData ,busId) =>{
        const { busNumber, busType, seats, amenities} = busData;
        // const operator = await userModel.findById(operatorId);
        const selectedBus = await busModel.findById(busId);
        console.log(selectedBus)
        // console.log(operator)
        if(!selectedBus){
            throw new Error("Bus is Invalid");
        }
        
        const validBustypes = ['Sleeper', 'AC', 'Non-AC', 'Seater'];
        if(!validBustypes.includes(busType)){
            throw new Error("Bus Type is not Valid");
        }

        const seatLayout = seats.map(seat => ({
            seatNumber: seat.number,
            isBooked: seat.booked || false
        }));
        // Add validation
        console.log(seats.length)
        if (seats.length === 0) 
            throw new Error('At least one seat required');

        const updateData = {};
        if (busType) updateData.busType = busType;
        if (amenities) updateData.amenities = amenities;
        if (seats) {
          updateData.setlayout = seatLayout;
          updateData.totalSeats = seats.length;
          updateData.busNumber = busNumber;
        }
      
        const bus = await busModel.findByIdAndUpdate(
            busId,
            {$set: updateData},
        );
        console.log(bus) 
        return bus;
    }

    deletingBus = async(busId) => {
        console.log(busId);
        const busToBeDeleted = await busModel.findById(busId);
        if(!busToBeDeleted){
            throw new Error("Bus not Exists");
        }
        const deletedBus = await busModel.findByIdAndDelete(busId);
        return deletedBus;
    }   

    creatingTrip = async ({ operatorId, busId, source, destination, departureTime, arrivalTime, price, availableSeats }) =>{
        const operator = await userModel.findById(operatorId);
        console.log(operatorId)
        console.log(operator)

        const existBus = await busModel.findById(busId)
        if(!existBus){
            throw new Error("Bus not exists")
        }
        if(!operator || operator.role !="operator"){
            throw new Error("Operator is Invalid");
        }
        
        const trip = await tripModel.create({
            operatorId, busId, source, destination, departureTime, arrivalTime, price, availableSeats
        });
        console.log(trip) 
        return trip;
    }

    updatingTrip = async(tripData,tripId ,userId) =>{
        const { operatorId, busId, source,destination,departureTime,arrivalTime, price, availableSeats } = tripData ;
        const selectedBus = await busModel.findOne({_id : busId, operatorId :userId});
        console.log(selectedBus)
        
        const operator = await userModel.findById(operatorId);
        console.log(operator)

        if(!selectedBus || !operator || operator.role!="operator"){
            throw new Error("Bus is Invalid");
        }
        
        const updateData = {};
        if (source) updateData.source = source;
        if (destination) updateData.destination = destination;
        if (departureTime) updateData.departureTime = departureTime;
        if (arrivalTime) updateData.arrivalTime = arrivalTime;
        if (price) updateData.price = price;
        if (availableSeats) updateData.availableSeats = availableSeats;
         
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            {$set: updateData},
        );
        console.log(trip) 
        return trip;
    }

    deletingTrip =async(userId,tripId) =>{
        const trip = await tripModel.find({_id : tripId,userId});
        console.log(trip)

        if(!trip ){
            throw new Error("Trip is Invalid");
        }
        const deletedTrip = await tripModel.findByIdAndDelete(tripId);
        return deletedTrip;
    }

    fetchingTrip = async (operatorId) =>{
        const getTrips = await tripModel.find({ operatorId });
        console.log("Trips" , getTrips)
        return getTrips;
    }

    cancelTrip = async(userId, tripId) =>{
        const trip = await tripModel.findOne({ _id : tripId, userId});
        console.log(trip)
        if(!trip){
            throw new Error("Trip is not found");
        }
        if (trip.status === 'Cancelled') {
            throw new Error("Trip is already cancelled");
        }
        trip.status = 'Cancelled'
        const updatedTrip =  await trip.save();
        return updatedTrip;
    }
}

export default OperatorService;