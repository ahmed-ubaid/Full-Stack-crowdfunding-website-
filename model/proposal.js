const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({
    Id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    request:{
        type:Number,
        required:true,
        min:0
    },
    amount:{
        type:Number,
        min:0
    },
    owner:{
        type:String,
        required:true
    },
    investorsList:{
        type:[Number],
        default:[]
    }
})
const Proposal=mongoose.model('Proposal',productSchema);
module.exports=Proposal;