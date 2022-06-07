import "../scss/style.scss";
import ELEMENTS from "./domFunctions/ELEMENTS";
import messageTypeHandler, { OPEN_ROOMS, TYPES } from "./messengerTypeHandler";
import cryptoRandomString from "crypto-random-string";
class uWebSocket {
  constructor() {
    this.ws = "";
    this.serverUrl = "wss://weibo-websockets.herokuapp.com/";
    // this.serverUrl = "ws://localhost:9001";
  }

  connect() {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      console.log("WS CONNECTED");
    };
    this.ws.onclose = () => {
      console.log("WS DISCONNECTED");
    };
    this.ws.onmessage = (event) => {
      const serverData = JSON.parse(event.data);
      messageTypeHandler(serverData);
    };
  }
}

const SOCKET = new uWebSocket();
SOCKET.connect();

/**
 *
 * WebSocket Connectiong
 *
 */

/**
 *
 * Event Listeners
 *
 */

ELEMENTS.room_container.addEventListener("click", (e) => {
  if (e.target.id === "create_room") {
    if (user_input.value.length < 2) return alert("minimum 3 letters");
    ELEMENTS.create_room.classList.add("active");
    ELEMENTS.join_room.classList.remove("active");
    ELEMENTS.room_box.classList.add("hidden");
    initialize(user_input);

    SOCKET.ws.send(
      JSON.stringify({
        type: TYPES.SELF_CONNECTED,
        username: user_input.value,
        room: cryptoRandomString({ length: 4, type: "distinguishable" }),
      })
    );
    SOCKET.ws.send(
      JSON.stringify({
        type: TYPES.CREATE_ROOM,
      })
    );
  } else if (e.target.id === "join_room") {
    if (user_input.value.length < 2) return alert("minimum 3 letters");
    ELEMENTS.create_room.classList.remove("active");
    ELEMENTS.join_room.classList.add("active");
    ELEMENTS.room_box.classList.remove("hidden");
  } else if (e.target.id === "enter") {
    const theRoom = OPEN_ROOMS.find((room) => (room.code = room_input.value));
    if (theRoom === undefined) return alert("no room found");
    initialize(user_input);
    SOCKET.ws.send(
      JSON.stringify({
        type: TYPES.SELF_CONNECTED,
        username: user_input.value,
        room: room_input.value,
      })
    );
    SOCKET.ws.send(
      JSON.stringify({
        type: TYPES.JOIN_ROOM,
      })
    );
  }
});

function initialize() {
  ELEMENTS.message_bar.style.display = "block";
  ELEMENTS.room_container.style.display = "none";
  ELEMENTS.user_message.focus();

  ELEMENTS.add_button.addEventListener("click", sendMessageToServer);
  window.addEventListener("keydown", sendMessageToServer);
  ELEMENTS.room_container.removeEventListener("click", initialize);
}

function sendMessageToServer(e) {
  if (e.target.id === "add_message" || e.code === "Enter") {
    if (user_message.value.length > 0) {
      const message = {
        type: TYPES.CLIENT_MESSAGE,
        body: user_message.value,
      };
      SOCKET.ws.send(JSON.stringify(message));
    }
  }
}
