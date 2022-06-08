const { ROOMS, TYPES } = require("./variables");

function createMessage(ws, type, props) {
  return {
    type,
    body: {
      username: ws.username,
      ...props,
    },
  };
}

function removeClientFromRoom(ws) {
  ROOMS.find((room) => {
    //find specific room first
    if (room.code === ws.room) {
      // find specific client within room
      room.clients.find((client, index) => {
        // remove client from array
        if (client.id === ws.id) {
          // REMEMBER TO RETURN
          return room.clients.splice(index, 1);
        }
      });
    }
  });
}

function removeRoomIfEmpty(ws, app) {
  ROOMS.find((room, index) => {
    console.log(room);
    //find specific room first
    if (room.code === ws.room) {
      // if room is empty, remove room
      if (room.clients.length === 0) {
        ROOMS.splice(index, 1);
        app.publish(
          TYPES.SERVER_MESSAGE,
          JSON.stringify({
            type: TYPES.ROOM_CLOSED,
            room: {
              code: room.code,
              id: room.id,
            },
          })
        );
        return;
      }
    }
  });
}

function findRoom(ws) {
  return ROOMS.find((room) => room.code === ws.room);
}

const specificRoomTopic = (room, type) => `${room.id}+${type}`;

module.exports = {
  createMessage,
  removeClientFromRoom,
  removeRoomIfEmpty,
  specificRoomTopic,
  findRoom,
};
