const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
let conversation_id = "";
let emeraldContext = false;
const pElement = document.createElement("p");

let userText = null;
const API_KEY = "eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEtc3RnMS1rZXktYXQtMS5jZXIiLCJraWQiOiJpbXNfbmExLXN0ZzEta2V5LWF0LTEiLCJpdHQiOiJhdCJ9.eyJpZCI6IjE2OTU5NjU4MzE1NDFfZDEwMDk3ZmEtNTg4Ny00Yjg2LWFlOGQtNjkxODE3YWQ1ZGQzX2V3MSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJzY29lLWhhY2thdGhvbi1hcHAiLCJ1c2VyX2lkIjoic2NvZS1oYWNrYXRob24tYXBwQEFkb2JlSUQiLCJhcyI6Imltcy1uYTEtc3RnMSIsImFhX2lkIjoic2NvZS1oYWNrYXRob24tYXBwQEFkb2JlSUQiLCJjdHAiOjAsInBhYyI6InNjb2UtaGFja2F0aG9uLWFwcF9zdGciLCJydGlkIjoiMTY5NTk2NTgzMTU0MV9jOTk3MmI2OS01MTZmLTQwMTEtYWU4Ny1jNGZkNGEyZjNiM2RfZXcxIiwibW9pIjoiZGVlMGIzNDMiLCJydGVhIjoiMTY5NzE3NTQzMTU0MSIsImV4cGlyZXNfaW4iOiI4NjQwMDAwMCIsInNjb3BlIjoic3lzdGVtIiwiY3JlYXRlZF9hdCI6IjE2OTU5NjU4MzE1NDEifQ.GAjLfCZ8HKuFf_w2TvzPC13PxKPu-gDACTujEp6fWLYIgExaA-_M3iPws7M1qaMKQrY_XDI41acto4g12GjBy6aPmccJpsw2u8SIKq4s6_2CAcC8qIWYUUMxC8CVzuZbKfyY1cPKaJN51-AahzBrCZ2NB6VSSYtjFrqkJMwJmIsuwMc7YGMjymx6IrC7Lo5EkrNBtiK2d2_RN200O2_9H68iT-VsuirURO3MLa1N8REmw0Kcy1jsVMELO5j7pFM0gK2oQahWrYSSTw7jL6yjIFouFLWU9kX4AWtxQsmlo6aTqzyJGWwBgfVE2-loCVtK0Em70mE3rjr-V1H8uHy9rw"; // Paste your API key here

const loadDataFromLocalstorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">

 

    <h1>Target GPT</h1>



    <p>Your one stop solution to all questions related to Target.<br> Let's get start with your queries in our chat section!</p>



</div>

<div class="frequently-asked">

<div class="typing-textarea faq">

<textarea id="chat-input" spellcheck="false" placeholder="Enter a prompt here" required="" style="height: 55px;"></textarea>

<span id="send-btn" class="material-symbols-rounded">send</span>

</div><div class="typing-textarea faq">

<textarea id="chat-input" spellcheck="false" placeholder="Enter a prompt here" required="" style="height: 55px;"></textarea>

<span id="send-btn" class="material-symbols-rounded">send</span>

</div>

   

</div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
}

const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

const getConversation = async (incomingChatDiv, userText) => {
    if(!localStorage.all_chats){
        const API_URL = "https://firefall-stage.adobe.io/v2/conversation";
        // Define the properties and data for the API request
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "x-api-key" : "scoe-hackathon-app",
                "x-gw-ims-org-id" : "154340995B76EEF60A494007@AdobeOrg"
            },
            body: JSON.stringify({
                    "conversation_name": "Target GPT_"+ Math.floor
                    (Math.random() * 90 + 10) ,
                    "capability_name": "completions_capability"
                })
        }

        // Send POST request to API, get response and set the reponse as paragraph element text
        try {
            const response = await (await fetch(API_URL, requestOptions)).json();
            console.log(response.conversation_id, "::::response conversation_id");
            conversation_id = response.conversation_id;
        } catch (error) { // Add error class to the paragraph element and set error text
            pElement.classList.add("error");
            pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
        }
    }
    if(!emeraldContext){
        getChatResponse(incomingChatDiv, userText, conversation_id);
    }else{
        getEmeraldContext(incomingChatDiv, userText, conversation_id);
    }
}


const getEmeraldContext = async (incomingChatDiv, userText, conversation_id) => {
    const API_URL = "https://emerald-stage.adobe.io/collection/Adobe_Target_Collection/search";
    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "x-api-key" : "scoe-hackathon-app",
            "x-gw-ims-org-id" : "154340995B76EEF60A494007@AdobeOrg"
        },
        body: JSON.stringify({
            "input_format": userText.indexOf("https") > -1 ? "url" : "text" ,
            "data": userText,
            "top_p" : 1
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response, "::::response");
        getEmeraldContextData(incomingChatDiv, userText, 
            response[0].asset_id, conversation_id)
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

}

const getEmeraldContextData = async (incomingChatDiv, userText, 
    asset_id, conversation_id) => {
    const API_URL = "https://emerald-stage.adobe.io//collection/Adobe_Target_Collection/asset/"+asset_id;
    // Define the properties and data for the API request
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "x-api-key" : "scoe-hackathon-app",
            "x-gw-ims-org-id" : "154340995B76EEF60A494007@AdobeOrg"
        }
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response, "::::response");
        getChatResponseEmerald(incomingChatDiv, userText, 
            response.data, conversation_id)
        //pElement.textContent = response.dialogue.answer;
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

}

const getChatResponseEmerald = async (incomingChatDiv, userText, 
    context, conversation_id) => {
    const API_URL = "https://firefall-stage.adobe.io//v1/completions";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "x-api-key" : "scoe-hackathon-app",
            "x-gw-ims-org-id" : "154340995B76EEF60A494007@AdobeOrg"
        },
        body: JSON.stringify({
                "dialogue":{
                    "conversation_id" : conversation_id,
                    "question": "\n'"+context+"'\n" + userText
                },
                "llm_metadata": {
                    "model_name": "gpt-35-turbo",
                    "temperature": 0.0,
                    "top_p": 1.0,
                    "frequency_penalty": 0,
                    "presence_penalty": 0,
                    "n": 1,
                    "llm_type": "azure_chat_openai"
                }
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response, "::::response");
        pElement.textContent = response.generations[0][0].text;
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

}

const getChatResponse = async (incomingChatDiv, userText, conversation_id) => {
    const API_URL = "https://firefall-stage.adobe.io/v2/query";

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "x-api-key" : "scoe-hackathon-app",
            "x-gw-ims-org-id" : "154340995B76EEF60A494007@AdobeOrg"
        },
        body: JSON.stringify({
	        "conversation_id": conversation_id,
            "dialogue":{
                "question": userText
            }
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response, "::::response");
        pElement.textContent = response.dialogue.answer;
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    //(incomingChatDiv, userText, conversationID);

}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = (userText) => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src="https://exc-unifiedcontent.experience.adobe.net/assets/CircleExperienceCloud.69d1dfda.svg" alt="chatbot-img">
                    <h5>Target GPT</h5>
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    console.log("incoming chat div ::::", incomingChatDiv);
    getConversation(incomingChatDiv, userText);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here
    console.log(userText, "userText :::;")
    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src="https://jira.corp.adobe.com/secure/useravatar?avatarId=48114" alt="user-img">
                    <h5>Harry Potter</h5>
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation(userText), 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage 
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
        if(document.querySelector('.chat-container .chat.outgoing')){
            document.querySelector('.frequently-asked').style.display = 'none';
        }

    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);
