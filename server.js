const UWS = require("uWebSockets.js");
const randomColor = require("randomcolor");
const { v4: uuidv4 } = require("uuid");

var PORT = process.env.PORT || 5000;
var express = require("express");
var app = express();

var http = require("http");
var server = http.Server(app);

app.use(express.static("client"));

server.listen(PORT, function () {
  console.log("Chat server running");
});

// const decoder = new TextDecoder();
// const port = process.env.PORT || 9001;

// const SOCKETS = [];
// const MESSAGES = [];
// const TYPES = Object.freeze({
//   SELF_CONNECTED: "SELF_CONNECTED",
//   CLIENT_CONNECTED: "CLIENT_CONNECTED",
//   CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
//   CLIENT_MESSAGE: "CLIENT_MESSAGE",
//   SERVER_MESSAGE: "SERVER_MESSAGE",
//   ROOM_OPENED: "ROOM_OPENED",
//   ROOM_CLOSED: "ROOM_CLOSED",
//   SERVER_MESSAGE: "SERVER_MESSAGE",
//   GET_ALL_MESSAGES: "GET_ALL_MESSAGES",
//   PING: "PING",
// });

// const app = UWS.App({
//   key_file_name: "...",
//   cert_file_name: "...",
//   // passphrase: "1234",
// })
//   .ws("/*", {
//     sendPingsAutomatically: true,
//     // idleTimeout: 12,
//     maxBackpressure: 1024,
//     maxPayloadLength: 512,
//     compression: UWS.DEDICATED_COMPRESSOR_3KB,

//     open: (ws) => {
//       console.log("WebSocket connection made");

//       ws.subscribe(TYPES.CLIENT_CONNECTED);
//       ws.subscribe(TYPES.CLIENT_DISCONNECTED);
//       ws.subscribe(TYPES.CLIENT_MESSAGE);
//     },
//     message: (ws, message, isBinary) => {
//       const clientMessage = JSON.parse(decoder.decode(message));

//       switch (clientMessage.type) {
//         case TYPES.SELF_CONNECTED:
//           // create user data on the websocket object
//           ws.username = clientMessage.body;
//           ws.id = uuidv4();
//           ws.color = randomColor({ luminosity: "light" });

//           const clientData = {
//             type: TYPES.CLIENT_CONNECTED,
//             body: {
//               username: ws.username,
//               color: ws.color,
//             },
//           };

//           // show after loggin in
//           ws.send(
//             JSON.stringify({ type: TYPES.GET_ALL_MESSAGES, body: MESSAGES })
//           );

//           // push into an array of clients
//           SOCKETS.push(ws);
//           MESSAGES.push(clientData);

//           // send to all clients except yourself
//           // ws.publish(TYPES.CLIENT_CONNECTED, JSON.stringify(clientData));

//           // send to all clients including YOURSELF
//           app.publish(TYPES.CLIENT_CONNECTED, JSON.stringify(clientData));

//           break;
//         case TYPES.CLIENT_MESSAGE:
//           const serverMessage = {
//             type: TYPES.CLIENT_MESSAGE,
//             body: {
//               username: ws.username,
//               color: ws.color,
//               text: clientMessage.body,
//             },
//           };
//           MESSAGES.push(serverMessage);
//           app.publish(TYPES.CLIENT_MESSAGE, JSON.stringify(serverMessage));
//           break;
//       }
//     },
//     close: (ws, code, message) => {
//       console.log("DISCONNECTED");
//       removeClient(ws);
//     },
//   })
//   .get("/*", (res, req) => {
//     res.end("Nothing to see here");
//   })
//   .get("/home", (res, req) => {
//     res.end("Welcome Home");
//   })
//   .listen(process.env.PORT || 9001, (listenSocket) => {
//     if (listenSocket) {
//       console.log("Listening to port");
//     } else {
//       console.log("Unable to listen to port 9001");
//     }
//   });

// function getClient(ws) {
//   return SOCKETS.find((socket) => socket.id === ws.id);
// }
// function removeClient(ws) {
//   return SOCKETS.find((socket, index) => {
//     if (socket.id === ws.id) {
//       SOCKETS.splice(index, 1);
//     }
//   });
// }
