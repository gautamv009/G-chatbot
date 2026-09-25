let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let submitBtn = document.querySelector("#Submit");
let imageBtn = document.querySelector("#Image");
let imageInput = document.querySelector("#Image input");

//const Api_Url =
  you api 
let user = { data: null };
// Conversation history
let conversationHistory = [];

// ========== MBTI QUIZ CONFIG ==========
let mbtiQuiz = {
  active: false,
  currentQuestion: 0,
  answers: [],
  questions: [
    { q: "You enjoy social events with lots of people. (Yes/No)", trait: "E/I" },
    { q: "You prefer concrete facts over abstract ideas. (Yes/No)", trait: "S/N" },
    { q: "You make decisions based on logic rather than feelings. (Yes/No)", trait: "T/F" },
    { q: "You like having a planned schedule. (Yes/No)", trait: "J/P" },
    { q: "You gain energy from being around people. (Yes/No)", trait: "E/I" },
    { q: "You rely more on imagination than experience. (Yes/No)", trait: "S/N" },
    { q: "You value empathy over efficiency. (Yes/No)", trait: "T/F" },
    { q: "You prefer to stay flexible rather than stick to a plan. (Yes/No)", trait: "J/P" },
  ]
};

let mbtiImages = {
  "INTJ": "Mbtiimages/DD.jpeg",
  "INTP": "Mbtiimages/Dr_Valerie_Kinbott_icons.jpeg",
  "ENTJ": "Mbtiimages/gwendoline-christie-as-larissa-weems.avif",
  "ENTP": "Mbtiimages/Dr_Valerie_Kinbott_icons.jpeg",
  "INFJ": "Mbtiimages/thornhill-gifts-wednesday-flower.avif",
  "INFP": "Mbtiimages/tyler-galpin-from-wednesday.avif",
  "ENFJ": "Mbtiimages/wednesday-thing.avif",
  "ENFP": "Mbtiimages/Bianca-Barclay-Siren.avif",
  "ISTJ": "Mbtiimages/Bianca-Barclay-Siren.avif",
  "ISFJ": "Mbtiimages/gwendoline-christie-as-larissa-weems.avif",
  "ESTJ": "Mbtiimages/DD.jpeg",
  "ESFJ": "Mbtiimages/uncle-fester.avif",
  "ISTP": "Mbtiimages/istp.png",
  "ISFP": "Mbtiimages/Dr_Valerie_Kinbott_icons.jpeg",
  "ESTP": "Mbtiimages/wednesday-thing.avif",
  "ESFP": "Mbtiimages/uncle-fester.avif",
  "default": "Mbtiimages/mbti.png"
};

// ========== FUNCTIONS ==========

// AI response from API
async function generateResponse(aiChatBox) {

  let textBox = aiChatBox.querySelector(".ai-chat-area");

  // Add the latest user message to conversation history
  conversationHistory.push({
      role: "user",
      text: user.data
  });

  // Create conversation text for the backend
  let conversationText = conversationHistory
      .map(message => {
          if (message.role === "user") {
              return `User: ${message.text}`;
          } else {
              return `Assistant: ${message.text}`;
          }
      })
      .join("\n\n");

  let requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: conversationText
      })
  };

  try {

      // Send request to our backend
      let response = await fetch("http://localhost:3000/api/chat", requestOptions);

      if (!response.ok) {

          if (response.status === 400) {
              throw new Error("Invalid request.");
          }

          if (response.status === 429) {
              throw new Error("Too many requests. Please try again later.");
          }

          if (response.status >= 500) {
              throw new Error("AI service is temporarily unavailable.");
          }

          throw new Error(
              `Request failed with status ${response.status}.`
          );
      }

      let data = await response.json();

      if (data.response) {

          let apiResponse = data.response.trim();

          // Save AI response in conversation history
          conversationHistory.push({
              role: "assistant",
              text: apiResponse
          });

          // ===== Response Formatting =====
          apiResponse = apiResponse.replace(
              /\*\*(.*?)\*\*/g,
              "<b>$1</b>"
          );

          apiResponse = apiResponse.replace(
              /\n/g,
              "<br>"
          );

          apiResponse = apiResponse.replace(
              /^- (.*)/gm,
              "• $1"
          );

          textBox.innerHTML = `
              ${apiResponse}

              <div class="message-info">
                  G-Chatbot • ${new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                  })}
              </div>

              <button class="copy-btn">
                  Copy
              </button>
          `;

          // ===== Copy Button =====
          let copyBtn = textBox.querySelector(".copy-btn");

          copyBtn.addEventListener("click", () => {

              navigator.clipboard.writeText(
                  textBox.innerText
                      .replace(/G-Chatbot •.*\n?/g, "")
                      .replace("Copy", "")
                      .trim()
              );

              copyBtn.textContent = "Copied";

              setTimeout(() => {
                  copyBtn.textContent = "Copy";
              }, 1500);
          });

      } else {

          textBox.innerHTML =
              "⚠️ I couldn't generate a response. Please try again.";

      }

  } catch (error) {

      console.error("G-Chatbot Error:", error);

      textBox.innerHTML = `
          <div>
              ⚠️ ${error.message}
          </div>

          <div class="message-info">
              Please try again.
          </div>
      `;

  } finally {

      chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: "smooth"
      });

  }
}
// Create chat bubble
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.classList.add(classes);
  div.innerHTML = html;
  return div;
}

// Greeting
function aiGreeting() {
  let greetingHtml = `
    <img src="GV-ai-logo.jpg" alt="ai" id="aiimage" width="70">
    <div class="ai-chat-area">Hello! Type <b>/mbti</b> to take the MBTI quiz.</div>
  `;
  let greetingBox = createChatBox(greetingHtml, "ai-chat-box");
  chatContainer.appendChild(greetingBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
}

// Handle chat flow
function handlechatResponse(message) {
  user.data = message;

  let userHtml = `
    <div class="user-chat-area">${user.data}</div>
    <img src="Person-Icon-Black.jpeg" alt="user" id="userimage" width="50">
  `;
  let userChatBox = createChatBox(userHtml, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  prompt.value = "";
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  if (message.toLowerCase() === "/mbti" && !mbtiQuiz.active) {
    mbtiQuiz.active = true;
    mbtiQuiz.currentQuestion = 0;
    mbtiQuiz.answers = [];
    askNextQuestion();
    return;
  }

  if (mbtiQuiz.active) {
    mbtiQuiz.answers.push(message.toLowerCase().startsWith("y") ? "Y" : "N");
    mbtiQuiz.currentQuestion++;

    if (mbtiQuiz.currentQuestion < mbtiQuiz.questions.length) {
      askNextQuestion();
    } else {
      showMbtiResult();
    }
    return;
  }

  setTimeout(() => {
    let aiHtml = `
    <img src="GV-ai-logo.jpg" alt="ai" id="aiimage" width="70">
    <div class="ai-chat-area">
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
`;
    let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);

    generateResponse(aiChatBox);
  }, 600);
}

// Ask next MBTI question
function askNextQuestion() {
  let q = mbtiQuiz.questions[mbtiQuiz.currentQuestion].q;
  let aiHtml = `
    <img src="GV-ai-logo.jpg" alt="ai" id="aiimage" width="70">
    <div class="ai-chat-area">${q}</div>
  `;
  let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
}

// Calculate MBTI result
function showMbtiResult() {
  mbtiQuiz.active = false;

  let type = "";
  let EI = mbtiQuiz.answers[0] === "Y" ? "E" : "I";
  let SN = mbtiQuiz.answers[1] === "Y" ? "S" : "N";
  let TF = mbtiQuiz.answers[2] === "Y" ? "T" : "F";
  let JP = mbtiQuiz.answers[3] === "Y" ? "J" : "P";
  type = EI + SN + TF + JP;

  let img = mbtiImages[type] || mbtiImages["default"];

  let aiHtml = `
    <img src="GV-ai-logo.jpg" alt="ai" id="aiimage" width="70">
    <div class="ai-chat-area">
      Your MBTI type is <b>${type}</b><br>
      <img src="${img}" alt="${type}" width="120" style="margin-top:10px;"
           onerror="this.src='Mbtiimages/mbti.png'">
    </div>
  `;
  let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
}

// ========== EVENTS ==========
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && prompt.value.trim() !== "") {
    handlechatResponse(prompt.value);
  }
});

submitBtn.addEventListener("click", () => {
  if (prompt.value.trim() !== "") {
    handlechatResponse(prompt.value);
  }
});

imageBtn.addEventListener("click", () => {
  imageInput.click();
});
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (e) => {
    console.log("Selected image:", e.target.result);
  };
  reader.readAsDataURL(file);
});

window.onload = aiGreeting;
// Clear chat
let clearChatBtn = document.querySelector("#clearChat");

clearChatBtn.addEventListener("click", () => {

  chatContainer.innerHTML = "";

  // Clear AI conversation memory
  conversationHistory = [];

  aiGreeting();
});
