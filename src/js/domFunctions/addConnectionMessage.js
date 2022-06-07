import ELEMENTS from "./ELEMENTS";

export default function addConnectionMessage(connection_type, username) {
  const div = document.createElement("div");

  if (connection_type === "on") {
    div.textContent = `${username} has joined the chat!`;
    div.classList.add("connection_message");
  } else {
    div.textContent = `${username} has left the chat!`;
    div.classList.add("disconnected_message");
  }

  ELEMENTS.chat_container.appendChild(div);
}
