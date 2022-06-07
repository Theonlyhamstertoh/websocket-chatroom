import { format } from "date-fns";
const chat_container = document.querySelector(".chat");

export default function addTextHTML(serverData) {
  const timestamp = format(new Date(), "p");
  const message_box = document.createElement("div");
  message_box.classList.add("message_box");

  const htmlFRAG = `
       <span>
               <span class="username">${serverData.username}</span>
               <span class="time">${timestamp}</span>
             </span>
             <span class="message">${serverData.text}</span>   
       `;

  const message_inner = document
    .createRange()
    .createContextualFragment(htmlFRAG);

  message_box.appendChild(message_inner);
  chat_container.appendChild(message_box);
}
