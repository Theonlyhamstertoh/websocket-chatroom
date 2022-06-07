import addTextHTML from "./addTextHtml";
import addConnectionMessage from "./domFunctions/addConnectionMessage";
import ELEMENTS from "./domFunctions/ELEMENTS";
export const OPEN_ROOMS = [];

export default function messageTypeHandler(serverData) {
  switch (serverData.type) {
    case TYPES.CLIENT_MESSAGE:
      addTextHTML(serverData);
      user_message.value = "";
      break;
    case TYPES.CLIENT_CONNECTED:
      addConnectionMessage("on", serverData.username);
      // if (serverData.code) {
      ELEMENTS.room_code.textContent = serverData.code;
      ELEMENTS.callout.classList.remove("hidden");
      // }
      break;
    case TYPES.CLIENT_DISCONNECTED:
      addConnectionMessage("off", serverData.username);
      break;
    case TYPES.FETCH_ALL_MESSAGES:
      serverData.messages.forEach((message) => messageTypeHandler(message));
      break;
    case TYPES.FETCH_ALL_ROOMS:
      OPEN_ROOMS.push(...serverData.rooms);
      break;
    case TYPES.ROOM_CLOSED:
      OPEN_ROOMS.find((room, index) => {
        //find specific room first
        if (room.id === serverData.room.id) {
          // if room is empty, remove room
          OPEN_ROOMS.splice(index, 1);
        }
      });
      console.log(OPEN_ROOMS);
      break;
    case TYPES.SERVER_MESSAGE:
      console.log(serverData);
      break;
    case TYPES.ROOM_CREATED:
      // console.log(serverData);
      OPEN_ROOMS.push({
        code: serverData.code,
        id: serverData.id,
      });
      console.log(OPEN_ROOMS);
      break;
  }
}

export const TYPES = Object.freeze({
  SELF_CONNECTED: "SELF_CONNECTED",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  CLIENT_MESSAGE: "CLIENT_MESSAGE",
  SERVER_MESSAGE: "SERVER_MESSAGE",
  FETCH_ALL_ROOMS: "FETCH_ALL_ROOMS",
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  ROOM_CREATED: "ROOM_CREATED",
  ROOM_CLOSED: "ROOM_CLOSED",
  SERVER_MESSAGE: "SERVER_MESSAGE",
  FETCH_ALL_MESSAGES: "FETCH_ALL_MESSAGES_FROM_ROOM",
  SHOW_ALL_MESSAGES: "FETCH_ALL_MESSAGES_FROM_ROOM",
  PING: "PING",
});
