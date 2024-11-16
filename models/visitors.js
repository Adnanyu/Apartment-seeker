import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true, 
  },
  visitDate: {
    type: Date,
    default: Date.now,
  },
});


export const Visitor = mongoose.model('Visitor', visitorSchema);

