const generator = require("generate-password");
const { v4: uuidv4 } = require("uuid");
const { TYPES, ROOMS } = require("./variables");
const {
  createMessage,
  removeClientFromRoom,
  removeRoomIfEmpty,
  specificRoomTopic,
  findRoom,
} = require("./utilities");

/**
 *
 * Closure Function
 *
 */

const CLIENT = (() => {
  function send_message(ws, clientMessage, app) {
    // create json
    const clientData = createMessage(ws, TYPES.CLIENT_MESSAGE, {
      text: clientMessage.body,
    });

    // find specific room
    const room = findRoom(ws);
    // save into array
    room.messages.push(clientData);

    console.log(clientData);
    // sent off to everyone
    ws.publish(
      specificRoomTopic(room, TYPES.CLIENT_MESSAGE),
      JSON.stringify(clientData)
    );
    ws.send(JSON.stringify(clientData));
  }
  function self_connect(ws, clientMessage, app) {
    // create user data on the websocket object
    // join/create are separate from this to keep code clean. Clientside will just make another socket request to specific type.
    ws.username = clientMessage.body.username;
    ws.id = uuidv4();
    ws.roomCode = clientMessage.body.room;
  }

  function self_disconnect(ws, app) {
    console.log("DISCONNECTED");

    const room = findRoom(ws);
    if (room !== undefined) {
      const clientData = createMessage(ws, TYPES.CLIENT_DISCONNECTED);
      app.publish(
        specificRoomTopic(room.id, TYPES.CLIENT_DISCONNECTED),
        JSON.stringify(clientData)
      );
      removeClientFromRoom(ws);
      removeRoomIfEmpty(ws);
    }
  }

  function create_room(ws, app) {
    const newRoom = {
      id: uuidv4(),
      code: generator.generate({ length: 4, uppercase: false }),
      clients: [],
      messages: [],
    };

    // save the room code of client's current room
    ws.room = newRoom.code;
    // send specific info back

    const roomData = {
      room: {
        code: newRoom.code,
        clients: newRoom.clients,
      },
    };

    // subscribe to the SPECIFIC ROOM to receive messages from others
    // the subscribed topic has to be unique so that messages are filtered by room
    ws.subscribe(specificRoomTopic(newRoom, TYPES.CLIENT_CONNECTED));
    ws.subscribe(specificRoomTopic(newRoom, TYPES.CLIENT_DISCONNECTED));
    ws.subscribe(specificRoomTopic(newRoom, TYPES.CLIENT_MESSAGE));
    ws.subscribe(TYPES.SERVER_MESSAGE);

    ws.publish(TYPES.SERVER_MESSAGE, JSON.stringify(roomData));
    ROOMS.push(newRoom);
    ws.send(JSON.stringify({ type: TYPES.ROOM_CREATED, body: roomData }));

    // send the small client data over
    const clientData = createMessage(ws, TYPES.CLIENT_CONNECTED);
    // since first one, no need to publish. push clientData
    ws.send(JSON.stringify(clientData));
    newRoom.messages.push(clientData);
  }

  function join_room(ws, app) {
    // find the room client joined with code
    const room = findRoom(ws);
    // add client websocket into the array
    room.clients.push(ws);
    // retrieve and show all message from the ROOM
    ws.send(
      JSON.stringify({ type: TYPES.SHOW_ALL_MESSAGES, body: room.messages })
    );

    // subscribe to the SPECIFIC ROOM to receive messages from others
    // the subscribed topic has to be unique so that messages are filtered by room
    ws.subscribe(specificRoomTopic(room, TYPES.CLIENT_CONNECTED));
    ws.subscribe(specificRoomTopic(room, TYPES.CLIENT_DISCONNECTED));
    ws.subscribe(specificRoomTopic(room, TYPES.CLIENT_MESSAGE));
    ws.subscribe(TYPES.SERVER_MESSAGE);

    // notify everyone in the room that the client has joined
    // send to all clients in room including CLIENT ITSELF
    const clientData = createMessage(ws, TYPES.CLIENT_CONNECTED);
    ws.publish(
      specificRoomTopic(room, TYPES.CLIENT_CONNECTED),
      JSON.stringify(clientData)
    );
    room.messages.push(clientData);
    // send to yourself
    ws.send(JSON.stringify(clientData));
  }

  return {
    self_connect,
    send_message,
    join_room,
    create_room,
    self_disconnect,
  };
})();

module.exports = CLIENT;
