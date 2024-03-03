import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export default async function connectToDB() {
    try {
        let conString = process.env.DB_CON_STRING
        mongoose.set("strictQuery", false);
    
        await mongoose.connect(conString);
        console.log("Connected to database")
    } catch (error) {
        console.log(error)
    }

}