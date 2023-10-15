// for load web app goto the following link
// file:///C:/Users/998823/PycharmProjects/chatGPT/SimpleLoadFile_01/index.html
// HTML file input element
const fileInput = document.querySelector('#fileInput');
const loadButton = document.querySelector('#loadButton');
const textBox = document.createElement("TextBoxInsertQuestion");
const AnswerShow = document.createElement("TextBoxShowAnswer");
const SendButton = document.querySelector('#SendButton');

//textBox.setAttribute("type", "text");
document.body.appendChild(textBox);

// Event listener for file selection
loadButton.addEventListener('click', handleFileUpload);
SendButton.addEventListener('click', handleSendButton);

function handleSendButton() {
// Create a FormData object
  const formData = new FormData();
  var text = document.getElementById("TextBoxInsertQuestion").value
  var ShowAnswer = document.getElementById("TextBoxShowAnswer")

  formData.append('text', text);
  ShowAnswer.value = 'Please wait few seconds, embedding your question...'

  // Send the file data to the Streamlit backend
  fetch('http://localhost:8888/question', {
    method: 'POST',
    body: formData
    //body: formData
  })
  .then(response => response.text())
  //.then(response => JSON.stringify(response.json()))
  .then(response => {
    // Process and display the response data
    console.log(response);
    ShowAnswer.value = response;
    // Update the UI with the processed results
  })
  .catch(error => {
    console.error('Error:', error);
    ShowAnswer.value = 'error: ' + error;
    // Handle error scenarios
  });
}

// Function to handle file upload
function handleFileUpload() {
  const file = fileInput.files[0];

  // Create a FormData object
  const formData = new FormData();
  formData.append('file', file);

  // Send the file data to the Streamlit backend
  fetch('http://localhost:8888/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Process and display the response data
    console.log(data);
    // Update the UI with the processed results
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle error scenarios
  });
}