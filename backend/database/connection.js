import mongoose from "mongoose";
const dbString = process.env.MONGODB_STRING;

export const dbConnection = async () =>{
  try{
    const conectDb = await mongoose.connect(dbString);
    if(conectDb){
      console.log(
      'Conexion Exitosa',
      '\nNombre DataBase: ',conectDb.connection.name)
    }
  }catch(err){
    console.log(err)
  }
 
}