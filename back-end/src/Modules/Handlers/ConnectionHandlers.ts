import { Socket } from "socket.io"

module.exports = (io:any)=>{

    const onConnection = (socket:Socket) =>{

    }    

    return io.on("connection",onConnection)
}