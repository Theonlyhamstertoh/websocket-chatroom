const { ROOMS } = require("./variables");

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
  return ROOMS.find((room) => {
    //find specific room first
    if (room.code === ws.roomCode) {
      // find specific client within room
      room.clients.find((client, index) => {
        // remove client from array
        if (client.id === ws.id) room.clients.splice(index, 1);
      });

      // if room is empty, remove room
      if (room.clients.length === 0) {
        room.clients.splice(index, 1);
      }
    }
  });
}

function removeRoomIfEmpty() {
  ROOMS.find((room) => {
    //find specific room first
    if (room.code === ws.roomCode) {
      // if room is empty, remove room
      if (room.clients.length === 0) {
        room.clients.splice(index, 1);
      }
    }
  });
}

function findRoom(ws) {
  return ROOMS.find((room) => room.code === ws.roomCode);
}

const specificRoomTopic = (room, type) => `${room.id}+${type}`;

module.exports = {
  createMessage,
  removeClientFromRoom,
  removeRoomIfEmpty,
  specificRoomTopic,
  findRoom,
};
