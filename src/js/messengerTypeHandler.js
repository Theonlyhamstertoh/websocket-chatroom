import addTextHTML from "./addTextHtml";
import addConnectionMessage from "./domFunctions/addConnectionMessage";
function messageTypeHandler(message) {
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
    case TYPES.GET_ALL_MESSAGES:
      console.log("NOT WORKING?", message.body);
      message.body.forEach((message) => messageTypeHandler(message));
      break;
    case TYPES.OPENED_ROOMS:
      OPEN_ROOMS.push(...message.body.rooms);
  }
}
