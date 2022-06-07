import addTextHTML from "./addTextHtml";
import addConnectionMessage from "./domFunctions/addConnectionMessage";
export const OPEN_ROOMS = [];

export default function messageTypeHandler(message) {
  switch (message.type) {
    case TYPES.CLIENT_MESSAGE:
      addTextHTML(message.body);
      user_message.value = "";
      break;
    case TYPES.CLIENT_CONNECTED:
      addConnectionMessage("on", message.body.username);
      break;
    case TYPES.CLIENT_DISCONNECTED:
      addConnectionMessage("off", message.body.username);
      break;
    case TYPES.FETCH_ALL_MESSAGES:
      console.log("NOT WORKING?", message.body);
      message.body.forEach((message) => messageTypeHandler(message));
      break;
    case TYPES.FETCH_ALL_ROOMS:
      OPEN_ROOMS.push(...message.body.rooms);
      console.log(OPEN_ROOMS);
      break;
    case TYPES.SERVER_MESSAGE:
      console.log(message.body);
      break;
    case TYPES.ROOM_CREATED:
      console.log(message.body);
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
