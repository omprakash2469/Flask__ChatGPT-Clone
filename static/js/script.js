let mainContent = document.getElementById("mainContent"); // Landing page main content
let faqs = document.getElementById("faqs"); // Question & answers section
let promptForm = document.getElementById("prompt"); // Input Form
let newChat = document.getElementById("newChat"); // Initialize a new chat
let loader = document.getElementById("loader"); // Initialize a new chat
let questionsHistory = document.getElementById("questionsHistory"); // Initialize a new chat

// Create a post request
async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Load & Update Questions history
const updateQuestionsHistory = () => {
  questionsHistory.innerHTML = "";
  questionsHistory.innerHTML = `<li class="text-gray-400 text-sm px-2 py-4">All Questions</li>`;
  postData("/", { data: "Get Questions" }).then((response) => {
    if (response.status == "success") {
      // Append the question
      let parser = new DOMParser();

      response.questions.forEach((key) => {
        let list = `<li class="text-slate-300 flex items-center p-2.5 px-3 hover:bg-gray-800 rounded-lg cursor-pointer">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg><span class="text-sm">${key}</span></li>`;

        let text = parser.parseFromString(list, "text/html");
        let string = text.querySelector("li");
        questionsHistory.appendChild(string);
      });
    } else {
      console.log(response.questions);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  updateQuestionsHistory();
});

// Submit Prompt
promptForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (promptForm.question.value != "") {
    // Get the prompt
    mainContent.classList.add("hidden");
    faqs.classList.remove("hidden");
    promptQuestion = promptForm.question.value;
    promptForm.question.value = "";
    loader.classList.remove("hidden");

    // Make a post request
    postData("/chat", { data: promptQuestion }).then((response) => {
      if (response.status == "success") {
        updateQuestions(response.question, response.answer);
        loader.classList.add("hidden");
      } else {
        console.log(response.message);
      }
    });

    // Create and append question with answer
    const updateQuestions = (key, value) => {
      let newQuestion = `
      <div>
          <div class="box flex items-start py-6">
              <img src="static/images/profile.webp" alt="user profile" class="w-8 mr-5 rounded-sm">
              <h4>${key}</h4>
          </div>
          <div class="bg-gray-800">
              <div class="flex items-start py-6 box">
                  <img src="https://chat.openai.com/favicon.ico" alt="ChatGPT icon" class="w-8 mr-5 rounded-sm">
                  <p class="leading-7 text-slate-300">${value}</p>
              </div>
          </div>
      </div>
      `;
      // Append the question
      let parser = new DOMParser();
      let text = parser.parseFromString(newQuestion, "text/html");
      let string = text.querySelector("div");
      faqs.appendChild(string);
      updateQuestionsHistory();
    };
  } else {
    alert("Please enter a question");
  }
});

// Initialize a New Chat
newChat.addEventListener("click", () => {
  mainContent.classList.remove("hidden");
  loader.classList.remove("hidden");
  faqs.classList.add("hidden");

  faqs.innerHTML = "";
});
