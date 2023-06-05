// Initialize the speech recognition object
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

// Initialize the text-to-speech object
const synth = window.responsiveVoice;

// Function to transcribe audio to text using speech recognition
function transcribeAudioToText(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      recognition.onresult = (event) => {
        const text = event.results[event.results.length - 1][0].transcript;
        resolve(text);
      };
      recognition.onerror = (event) => {
        reject(event.error);
      };
      recognition.start();
    };
    reader.readAsDataURL(blob);
  });
}

// Function to retrieve the API key from the input box
function getApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    return apiKeyInput.value;
  }
  
  // Function to generate response using OpenAI GPT-3
  async function generateResponse(prompt) {
    const apiKey = getApiKey(); // Retrieve the API key from the input box
    // Make an HTTP request to your server or directly to the OpenAI API
    // Include the necessary headers and data for authentication and the GPT-3 request
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Use the retrieved API key
      },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await response.json();
    return data.choices[0].text;
  }
  
// Function to speak the generated text using text-to-speech
function speakText(text) {
  synth.speak(text);
}

// Function to handle button click
// Function to handle button click
async function handleButtonClick() {
    const apiKey = getApiKey(); // Retrieve the API key from the input box
    if (!apiKey) {
      console.log("Please enter your API key");
      return;
    }
  
    // Record audio
    console.log("Say your question");
    recognition.onresult = async (event) => {
      const blob = event.results[event.results.length - 1][0].blob;
      const text = await transcribeAudioToText(blob);
      console.log(`You said: ${text}`);
  
      // Generate response using GPT-3
      const response = await generateResponse(text);
      console.log(`GPT-3 says: ${response}`);
  
      // Speak the response
      speakText(response);
    };
  }


// Get the button element
const button = document.getElementById('start');

// Add event listener to the button
button.addEventListener('click', handleButtonClick);
