module.exports = (expressApp:any) => {

    const server = expressApp.listen(8080);

    const io = require("socket.io")(server, {cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
        }});

    return io;
}