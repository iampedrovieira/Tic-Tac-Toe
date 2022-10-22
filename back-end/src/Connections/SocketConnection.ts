
import * as dotenv from 'dotenv';
module.exports = (expressApp:any,serverPort:number) => {
    dotenv.config();
    const server = expressApp.listen(serverPort);
    const io = require("socket.io")(server, {
        cors: {
        origin: process.env.origin_cors,
        methods: ["GET", "POST"]
        }});
    return io;
}