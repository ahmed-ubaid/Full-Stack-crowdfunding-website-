const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({
    Id:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true,
        min:0
    },
    amountContributed:{
        type:Number,
        required:true,
        min:0
    },
    proposalList:{
        type: [Number],
        default:[]
    }
})
const Investor=mongoose.model('Investor',productSchema);
module.exports=Investor;