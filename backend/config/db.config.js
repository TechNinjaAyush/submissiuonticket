import { PrismaClient } from "@prisma/client";

const prism  = new PrismaClient({
log : ["query"] , 

})


export default  prism ; 