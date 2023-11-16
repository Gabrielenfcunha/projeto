const userid = new URLSearchParams(location.search).get('matricula');
const socket = io();
let name;
let senha;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

// const menu = [
//     { id: 1, nome: 'Hamburguer', preco: 10.99 },
//     { id: 2, nome: 'Pizza', preco: 8.99 },
//     { id: 3, nome: 'Salada', preco: 5.99 },
// ];

// do {
//   name = prompt('Please enter your name: '),
//   senha = prompt('senha')
// } while(!name )

textarea.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
      user: name,
      message: message.trim()
  }
  // Append 
  appendMessage(msg, 'outgoing')
  textarea.value = ''
  scrollToBottom()

  // Send to server 
  socket.emit('message', msg)
};

function appendMessage(msg, type) {
  let mainDiv = document.createElement('div')
  let className = type
  mainDiv.classList.add(className, 'message')
  mainDiv.innerHTML = msg
  messageArea.appendChild(mainDiv)
};

// Recieve message
socket.on('message', (msg) => {
    console.log('RECEBI UMA MENSAGEM!', msg);
    appendMessage(msg, 'incoming')
    scrollToBottom()
});

socket.on('commandData', (commandData) => {
    console.log('RECEBI UM DADO DE UM COMANDO', commandData);
    switch (commandData.origin.command) {
        case 'showMenu':
            appendMessage(`<strong>Cardápio</strong><br/>
            ${
                commandData.result
                    .map(item => {
                        return `
                            <div class="menu-item">
                                <strong>
                                    ${item.id}
                                    ${item.nome}
                                </strong>
                                <span>
                                    R$${item.preco}
                                </span>
                                <button
                                    onclick="doRequest(${item.id})"
                                >
                                    Adicionar ao carrinho
                                </button>
                            </div>
                        `;
                    })
                    .join('')
            }
            </ul>`, 'incoming')
            break;
    
        default:
            break;
    }
})


function askForTheMenu () {
    socket.emit('command', {command: 'showMenu', value: ''});
}

function wantRequest () {
    socket.emit('command', {command: 'wantRequest', value: ''});
}

function doRequest (itemId) {
    socket.emit('command', {command: 'doRequest', value: itemId});
}

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight
}

function saldoVerificado() {
    socket.emit('command', {command: 'saldoVerificado', value: userid});     
}