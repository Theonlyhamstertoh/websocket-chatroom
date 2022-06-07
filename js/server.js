const UWS = require("uWebSockets.js");
const CLIENT = require("./Chat");
const { TYPES, ROOMS } = require("./variables");
const PORT = process.env.PORT || process.env.port || 9001;
const decoder = new TextDecoder();

const app = UWS.App({
  // key_file_name: "...",
  // cert_file_name: "...",
  // passphrase: "1234",
})
  .ws("/*", {
    // idleTimeout: 12,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    compression: UWS.DEDICATED_COMPRESSOR_3KB,

    upgrade: (res, req, context) => {
      console.log(
        "An Http connection wants to become WebSocket, URL: " +
          req.getUrl() +
          "!"
      );
      /* This immediately calls open handler, you must not use res after this call */
      res.upgrade(
        {
          url: req.getUrl(),
          req: req,
        },
        /* Spell these correctly */
        req.getHeader("sec-websocket-key"),
        req.getHeader("sec-websocket-protocol"),
        req.getHeader("sec-websocket-extensions"),
        context
      );
    },
    open: (ws) => {
      console.log("WebSocket connection made");
      ws.send(
        JSON.stringify({ type: TYPES.FETCH_ALL_ROOMS, body: { rooms: ROOMS } })
      );
    },
    message: (ws, message, isBinary) => {
      const clientMessage = JSON.parse(decoder.decode(message));

      switch (clientMessage.type) {
        case TYPES.SELF_CONNECTED:
          CLIENT.self_connect(ws, clientMessage);
          break;
        case TYPES.CLIENT_MESSAGE:
          CLIENT.send_message(ws, clientMessage);
          break;
        case TYPES.CREATE_ROOM:
          CLIENT.create_room(ws);
          break;
        case TYPES.JOIN_ROOM:
          CLIENT.join_room(ws);
          break;
      }
    },
    close: (ws, code, message) => {
      console.log("DISCONNECTED");
      CLIENT.self_disconnect(ws, app);
    },
  })
  .get("/*", (res, req) => {
    res
      .writeStatus("200 OK")
      .writeHeader("IsExample", "Yes")
      .end("Hello there!");
  })
  .listen("0.0.0.0", PORT, (listenSocket) => {
    if (listenSocket) {
      console.log("Listening to: " + PORT);
    } else {
      console.log("Unable to listen to port 9001");
    }
  });
