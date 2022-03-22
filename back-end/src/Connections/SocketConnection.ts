module.exports = (expressApp:any,serverPort:number) => {

    const server = expressApp.listen(serverPort);

    const io = require("socket.io")(server, {cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
        }});
    return io;
}