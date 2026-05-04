import mongoose from "mongoose";

const connectDB = async () =>{
   try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('data base connected');
   }catch(err){
    console.log("ERROR:" + err);
   }
}
export default connectDB