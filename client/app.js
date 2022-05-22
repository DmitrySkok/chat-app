/* add webSocket */
const socket = io();

/* DOM elements */
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

/* reassignable variables */
let userName = '';

/* functions */
function login(e) {
  e.preventDefault();
  if (userNameInput.value) {
    userName = userNameInput.value;
    socket.emit('join', { name: userName, id: socket.id });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    alert('please type your name');
  }
}

 function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();
  let messageContent = messageContentInput.value;
  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
}
/* end functions */

/* webSocket listeners */
socket.on('message', ({ author, content }) => addMessage(author, content));

/* JS listeners */
loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);