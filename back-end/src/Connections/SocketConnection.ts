
module.exports = (expressApp:any,serverPort:number) => {
    const customParser = require('socket.io-json-parser');
    const server = expressApp.listen(serverPort);

    const io = require("socket.io")(server, {
        parser: customParser,
        cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
        }});
    return io;
}