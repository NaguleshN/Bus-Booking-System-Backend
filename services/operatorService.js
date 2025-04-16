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
        
        if (seats <= 0) 
            throw new Error('At least one seat required');
        const bus = await busModel.create({
            operatorId,
            busType,
            busNumber,
            // setlayout: seatLayout,
            amenities: amenities ,
            totalSeats: seats
        });
        return bus;
    }

    updatingBus = async (busData ,busId) =>{
        const { busNumber, busType, seats, amenities} = busData;
        // const operator = await userModel.findById(operatorId);
        const selectedBus = await busModel.findById(busId);
        
        if(!selectedBus){
            throw new Error("Bus is Invalid");
        }
        
        if (seats <= 0) 
            throw new Error('Atleast one seat required');
        
        const validBustypes = ['Sleeper', 'AC', 'Non-AC', 'Seater'];
        const updateData = {};
        if (busType)  {
            if(!validBustypes.includes(busType)){
                throw new Error("Bus Type is not Valid");
            }
            updateData.busType = busType;
        }
        if (amenities) updateData.amenities = amenities;
        if (seats) updateData.totalSeats = seats;
        if (busNumber) updateData.busNumber = busNumber;
      
        const bus = await busModel.findByIdAndUpdate(
            busId,
            {$set: updateData},
        );
        return bus;
    }

    deletingBus = async(busId) => {
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
        return trip;
    }

    updatingTrip = async(tripData,tripId ,userId) =>{
        const { busId, source,destination,departureTime,arrivalTime, price,seatNumbers, availableSeats } = tripData ;
        // const selectedBus = await busModel.findOne({_id : busId, operatorId :userId});
        
        if(busId){
            const selectedBus = await busModel.findById(busId);
            if(!selectedBus){
                throw new Error("Bus is Invalid");
            }
        }
        const operator = await userModel.findById(userId);

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
        return trip;
    }

    deletingTrip = async (userId, tripId) => {
        const trip = await tripModel.find({ _id: tripId, userId });
      
        if (!trip || trip.length === 0) {
          throw new Error("Trip is Invalid");
        }
      
        const deletedTrip = await tripModel.findByIdAndDelete(tripId);
        return deletedTrip;
      }
      

    fetchingTrip = async (operatorId) =>{
        const getTrips = await tripModel.find({ operatorId });
        if (!getTrips || getTrips.length === 0) {
            throw new Error("Trips not found");
        }
        return getTrips;
    }

    getTrip = async (tripId) =>{
        const getTrip = await tripModel.findById(tripId);
       if(!getTrip){
            throw new Error("Trip is not found");
        }
        return getTrip;
    }

    cancelTrip = async(userId, tripId) =>{
        const trip = await tripModel.findOne({ _id : tripId, userId});
        
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