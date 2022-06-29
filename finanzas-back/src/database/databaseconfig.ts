import { createConnection } from 'typeorm';

export const dbConnection = async() => {
    try{
        await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "1231",
            database: "finanzas",
            entities:["dist/src/models/**/*.js"],
            synchronize: true
            // entities:["dist/src/models/**/*.js"],
            // sysnchronize:true
        });
        console.log('BD connectada°°');
        
    } catch (err) {
        console.log('err dbConnection: ',err);
        throw new Error('Error a la hora de iniciar la BD')
        
    }
}