import { format } from "date-fns";
const chat_container = document.querySelector(".chat");

export default function addTextHTML(body) {
  const timestamp = format(new Date(), "p");
  const message_box = document.createElement("div");
  message_box.classList.add("message_box");

  console.log(body);
  const htmlFRAG = `
       <span>
               <span class="username">${body.username}</span>
               <span class="time">${timestamp}</span>
             </span>
             <span class="message">${body.text}</span>   
       `;

  const message_inner = document
    .createRange()
    .createContextualFragment(htmlFRAG);

  message_box.appendChild(message_inner);
  chat_container.appendChild(message_box);
}
