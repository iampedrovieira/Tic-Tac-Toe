import { connect } from "http2";
import { io, Socket } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
    console.log("Connectou")
    socket.on("data",(data)=>{
        console.log(data)
    })
})

socket.on("disconnect", () => {
    console.log("Conexão falhou");
});
