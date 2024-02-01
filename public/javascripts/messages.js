
const socket = io({
  path: '/chats', 
});

socket.emit('addToActiveUsers', currentUser._id)

let memberName
let screenWidth = window.innerWidth
const chatRooms = document.querySelectorAll('.chat-card')
const messagesBox = document.querySelector('.messages-box')
const inputForm = document.createElement('form');
const messagesContainer = document.createElement('div')
const messagesHeader = document.createElement('div')
const input = document.createElement('input')

function updateScreenWidth() {
    screenWidth = window.innerWidth 
}


updateScreenWidth();

// Update screen width on window resize
window.addEventListener('resize', updateScreenWidth);


const CreateMessage = (messsageContent, time, sender) => {
    const message = document.createElement('div');
    const textContainer = document.createElement('div');
    let text = document.createElement('p');
    let timeSent = document.createElement('span');
    const imageContainer = document.createElement('div');
    let image = document.createElement('img');
    image.src = sender.profile_picture ? sender.profile_picture.replace('/upload', '/upload/w_100') : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
    image.classList.add('rounded-circle')
    image.style.width = '50px';
    image.style.height = '50px';
    imageContainer.classList.add('d-flex', 'justify-content-start');
    imageContainer.appendChild(image);
    if (currentUser._id == sender._id) {
        message.classList.add('mw-75', 'd-flex', 'justify-content-center', 'align-self-end', 'm-1', 'gap-2', 'pl-1', 'my-auto')
        text.classList.add('bg-primary', 'text-white')
    } else {
        message.classList.add('mw-75', 'd-flex', 'flex-row-reverse', 'justify-content-center', 'align-self-start', 'm-1', 'gap-2','pr-1', 'my-auto')
        textContainer.classList.add('d-flex', 'flex-column', 'align-items-end')
        // text.classList.add('bg-light', 'text-dark')
        text.style.backgroundColor = '#d1d5db'
    }
    timeSent.textContent = time;
    timeSent.className = 'text-muted'
    timeSent.style.fontSize = '12px'
    text.classList.add('h-auto', 'rounded-3', 'py-2', 'px-3', 'my-0')
    text.textContent = messsageContent;
    textContainer.appendChild(text);
    textContainer.appendChild(timeSent);
    message.appendChild(textContainer);
    message.appendChild(imageContainer);
    message.style.minHeight = '2.5rem';
    message.style.minWidth = 'auto';
    message.style.maxWidth = '85%';
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function fetchData(chatId) {
    
    console.log('fetched dat with id: ', chatId)
    try {
        const response = await fetch(`http://localhost:3000/messages/${chatId}`);
        
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
        console.log('Data:', data);

        
        const button = document.createElement('button')
        button.className = 'btn border mx-1'
        button.innerHTML = '<svg width="30px" height="30px" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 30 30" version="1.1" id="svg822" inkscape:version="0.92.4 (f8dce91, 2019-08-02)" sodipodi:docname="send.svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs id="defs816"></defs> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#ffffff" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="17.833333" inkscape:cx="15" inkscape:cy="15" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="true" units="px" inkscape:window-width="1366" inkscape:window-height="713" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="1" showguides="true" inkscape:guide-bbox="true"> <inkscape:grid type="xygrid" id="grid816"></inkscape:grid> <sodipodi:guide position="14,30" orientation="0,1" id="guide888" inkscape:locked="false"></sodipodi:guide> </sodipodi:namedview> <metadata id="metadata819"> <rdf:rdf> <cc:work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type> <dc:title> </dc:title> </cc:work> </rdf:rdf> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-289.0625)"> <path inkscape:connector-curvature="0" style="opacity:1;fill:#000;fill-opacity:1;stroke:none;stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 25.5,304.0625 c 0,-1.11962 -1,-1.5 -1,-1.5 l -20,-8 3.60352,8.56055 L 17.5,304.0625 8.10352,305.00195 4.5,313.5625 l 20,-8 c 0,0 1,-0.38038 1,-1.5 z" id="rect820"></path> </g> </g></svg>'

        input.classList.add('input-control', 'flex-grow-1', 'border', 'border-grey', 'rounded', 'px-1')
        input.placeholder = 'Message'
        input.name = 'text'
        
        const innerDiv = document.createElement('div')
        innerDiv.className = 'input-group mb-3 d-flex'
        innerDiv.appendChild(input)
        innerDiv.appendChild(button)
        
        inputForm.appendChild(innerDiv);
        
        messagesContainer.className = 'messages-container flex-grow-1 d-flex flex-column gap-5 py-2 overflow-scroll'
        messagesContainer.innerHTML = ''
        if (data.length === 0) {
            const startMessage = document.createElement('p');
            startMessage.classList.add('align-self-center', 'my-auto')
            startMessage.textContent = 'Here is the start of a legendary conversation!! and yes its from Discord';
            messagesContainer.appendChild(startMessage);
        } else {
            
            data.forEach((dat) => {
                CreateMessage(dat.text, dat.createdAt.slice(11, 16), dat.sender);
            });
        }

        const fragment = document.createDocumentFragment();
        fragment.innerHTML = inputForm

        messagesBox.innerHTML = ''
        messagesBox.appendChild(messagesContainer)
        messagesBox.appendChild(inputForm)
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (screenWidth < 768) {
            
            messagesHeader.className = 'messages-header py-2'
            messagesHeader.height = '15%';
            messagesHeader.style.display = 'flex';
            messagesHeader.style.backgroundColor = '#fff';
            messagesHeader.style.alignContent = 'center';
            messagesHeader.style.position = 'sticky'
            messagesHeader.style.top = '0px'

            const backButton = document.createElement('button')
            backButton.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000" /></svg>'
            backButton.className = 'btn'
            title = document.createElement('h3').innerText = memberName
            headerTitle = document.createElement('h3')
            headerTitle.textContent = memberName

            messagesHeader.append(backButton)
            messagesHeader.append(headerTitle)
            messagesContainer.prepend(messagesHeader)
            messagesContainer.classList.add('pt-0')
            document.querySelector('.chats-container').style.display = 'none';

            messagesBox.style.display = 'flex'
            messagesBox.style.flexDirection = 'column'
            messagesBox.style.width = '100%';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
            backButton.addEventListener('click', e => {
                messagesBox.style.display = 'none'
                document.getElementsByClassName('chats-container')[0].style.display = 'block'
            })
        } 
    } catch (error) {
      console.error('Error:', error);
    }
}


chatRooms.forEach(chatRoom => {
    chatRoom.addEventListener('click', e => {
        messagesBox.innerHTML = ''
        inputForm.innerHTML = ''
        messagesHeader.innerHTML = ''
        chatId = chatRoom.dataset.chatid;
        memberName = chatRoom.getElementsByClassName('card-title')[0].textContent
       
        socket.emit('joinChatRoom', chatId);

    
        fetchData(chatId);
        console.log("content", chatRoom)
        console.log('id:', chatRoom.getAttribute('id'))
        
        inputForm.addEventListener('submit', e => {
            e.preventDefault()
            console.log('hi from inside input')
            const message = input.value.trim();
            if (message) {
                console.log('hi from inside socket')
                socket.emit('sendMessage', message, currentUser._id, chatId);
                input.value = '';
            }
        })
})  
})

function updateActiveDots(userActivityData) {
    const userDotSpans = document.querySelectorAll('.user-dot');

    userDotSpans.forEach(span => {
        const userId = span.dataset.userid;
        console.log(userId)
        console.log(span.dataset)
        const isUserActive = userActivityData.some(user => user.userId === userId);

        if (isUserActive) {
            span.classList.add('active-dot');
        } else {
            span.classList.remove('active-dot');
        }
    });
}


socket.on('receiveMessage', (data) => {
    console.log('received data:', data)
    CreateMessage(data.text, data.createdAt.slice(11,16), data.sender)
});
socket.on('onlineUsers', (users) => {
    updateActiveDots(users)
});

try {
    inputForm.addEventListener('submit', e => {
        e.preventDefault()
        console.log('hi from inside input')
        const message = input.value.trim();
        if (message) {
            console.log('hi from inside socket')
            socket.emit('sendMessage', message, currentUser._id, chatId);
            input.value = '';
        }
    })
}catch(e){
    console.log(e)
}