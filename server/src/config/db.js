import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        if(!process.env.MONGO_URL){
        console.log("NO mongo url found")
    }

    const connectionInstance = await mongoose.connect(process.env.MONGO_URL)

    console.log(connectionInstance.connection.host)
    } catch (error) {
        console.log("Database error " , error)
    }
    
}