// * Do logic to connect to socket server with name and other info

import { io, Socket } from "socket.io-client";

function connectSocket():Socket{

    let socket:Socket 
    socket = io("http://localhost:8080");
    socket.on("connect", () => {
        console.log('Conneted');
        return socket;
    });
    return socket
}