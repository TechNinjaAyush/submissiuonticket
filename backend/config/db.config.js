import { PrismaClient } from "@prisma/client";

export const prism  = new PrismaClient({
log : ["query"] , 

})

export async  function connectDB(){
    try{
        await prism.$connect();

        console.log("Database connected succesfully") ;



    }

    catch(error){
        console.log("Database connection  failed" , error) ; 


    }
}



