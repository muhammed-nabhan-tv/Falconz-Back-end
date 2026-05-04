import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    img:{
        type:String,
    },
    category:{
        type:String
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
    },
    isStock:{
        type:String,
        default:true
    }
});

export default mongoose.model("Product",productSchema);