import userModel from '../models/userModel.js';
import busModel from '../models/busModel.js';
import tripModel from '../models/tripModel.js';

class OperatorService {
    
    getBuses = async() =>{
        const buses = await busModel.find();
        return buses;
    }

    getBus = async(busId) =>{
        const buses = await busModel.findById(busId);
        return buses;
    }
    
    creatingBus = async (operatorId,busData) =>{

        const { busNumber, busType, seats, amenities} = busData;
        const operator = await userModel.findById(operatorId);
        console.log(operatorId)
        // console.log(operator)

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

        // const seatLayout = seats.map(seat => ({
        //     seatNumber: seat.number,
        //     isBooked: seat.booked || false
        // }));
        
        console.log(seats)
        if (seats === 0) 
            throw new Error('At least one seat required');
        const bus = await busModel.create({
            operatorId,
            busType,
            busNumber,
            // setlayout: seatLayout,
            amenities: amenities ,
            totalSeats: seats
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

        console.log(seats)
        if (seats === 0) 
            throw new Error('At least one seat required');

        const updateData = {};
        if (busType) updateData.busType = busType;
        if (amenities) updateData.amenities = amenities;
        if (seats) {
          updateData.totalSeats = seats;
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

    creatingTrip = async (operatorId,tripData) =>{

        const { busId, source, destination, departureTime, arrivalTime, price, seatNumbers, availableSeats } = tripData ;
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
            operatorId, busId, source, destination, departureTime, arrivalTime, price, availableSeats, seatNumbers
        });
        console.log(trip) 
        return trip;
    }

    updatingTrip = async(tripData,tripId ,userId) =>{
        const { busId, source,destination,departureTime,arrivalTime, price,seatNumbers, availableSeats } = tripData ;
        // const selectedBus = await busModel.findOne({_id : busId, operatorId :userId});
        // console.log(selectedBus)
        
        if(busId){
            const selectedBus = await busModel.findById(busId);
            if(!selectedBus){
                throw new Error("Bus is Invalid");
            }
        }
        const operator = await userModel.findById(userId);
        console.log(operator)

        if( !operator || operator.role!="operator"){
            throw new Error("Bus is Invalid");
        }
        
        const updateData = {};
        if (source) updateData.source = source;
        if (busId) updateData.source = busId;
        if (destination) updateData.destination = destination;
        if (departureTime) updateData.departureTime = departureTime;
        if (arrivalTime) updateData.arrivalTime = arrivalTime;
        if (price) updateData.price = price;
        if(seatNumbers) updateData.seatNumbers = seatNumbers;
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

    getTrip = async (tripId) =>{
        const getTrip = await tripModel.findById(tripId);
        console.log("Trips" , getTrip)
        return getTrip;
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