import "../scss/style.scss";
import addTextHTML from "./addTextHtml";
const start_screen = document.getElementById("start_screen");
const message_bar = document.getElementById("message_bar");
const chat_container = document.querySelector(".chat");
const enter_button = document.getElementById("enter");
const add_button = document.getElementById("add_message");
const user_message = document.getElementById("user_message");

const TYPES = Object.freeze({
  SELF_CONNECTED: "SELF_CONNECTED",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  CLIENT_MESSAGE: "CLIENT_MESSAGE",
  SERVER_MESSAGE: "SERVER_MESSAGE",
  ROOM_OPENED: "ROOM_OPENED",
  ROOM_CLOSED: "ROOM_CLOSED",
  SERVER_MESSAGE: "SERVER_MESSAGE",
  GET_ALL_MESSAGES: "GET_ALL_MESSAGES",
  PING: "PING",
});

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
      console.log(event);
      const message = JSON.parse(event.data);
      messageTypeHandler(message);
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
  }
}

/**
 *
 * Event Listeners
 *
 */
enter_button.addEventListener("click", initialize);

function initialize(e) {
  const textbox = e.target.previousElementSibling;

  if (textbox.value.length > 2) {
    message_bar.style.display = "block";

    SOCKET.ws.send(
      JSON.stringify({ type: TYPES.SELF_CONNECTED, body: textbox.value })
    );
    start_screen.style.display = "none";
    user_message.focus();

    add_button.addEventListener("click", sendMessage);
    window.addEventListener("keydown", sendMessage);
    enter_button.removeEventListener("click", initialize);
  } else {
    alert("3 letters minimum");
  }
}

function sendMessage(e) {
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

function addConnectionMessage(connection_type, username) {
  const div = document.createElement("div");

  if (connection_type === "on") {
    div.textContent = `${username} has joined the chat!`;
    div.classList.add("connection_message");
  } else {
    div.textContent = `${username} has left the chat!`;
    div.classList.add("disconnected_message");
  }

  chat_container.appendChild(div);
}
