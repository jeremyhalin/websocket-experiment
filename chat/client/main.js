document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!');

    let WS = new WebSocket("ws://localhost:9999");
    let messagesDiv = document.querySelector('div.messages');

    WS.onopen = function() {
        const btn = document.getElementById("btn-send-message");
        const inputMessage = document.getElementById("input-message");
        btn.addEventListener('click', function() {
            WS.send(inputMessage.value);
            inputMessage.value = "";
        });
    }

    WS.onmessage = function(event) {
        console.log(event.data);
        const pEl = document.createElement("p");
        pEl.innerHTML = event.data;
        messagesDiv.appendChild(pEl);
    }

    
})
