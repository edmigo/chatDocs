// for load web app goto the following link
// file:///C:/Users/998823/PycharmProjects/chatGPT/SimpleLoadFile_01/index.html
// HTML file input element
const fileInput = document.querySelector('#fileInput');
const loadButton = document.querySelector('#loadButton');
const textBox = document.createElement("TextBoxInsertQuestion");
const AnswerShow = document.createElement("TextBoxShowAnswer");
const SendButton = document.querySelector('#SendButton');

MsgWaitForAnswer = 'Please wait few seconds, embedding your question...'

ServerAddress = 'https://014e-194-163-191-105.ngrok-free.app'
//ServerAddress = 'https://cbcd-77-137-75-12.ngrok.io'

//textBox.setAttribute("type", "text");
document.body.appendChild(textBox);

// Event listener for file selection
fileInput.addEventListener('click', handleChooseFileForUpload);
loadButton.addEventListener('click', handleFileUpload);
SendButton.addEventListener('click', handleSendButton);

var ShowAnswer = document.getElementById("TextBoxShowAnswer")

let intervalID = setInterval(() => {
 if (ShowAnswer.value == MsgWaitForAnswer){
     if ((SendButton.textContent == 'Send') || (SendButton.textContent == 'Sending')){
        SendButton.textContent = 'Sending.';
     }
     else if (SendButton.textContent == 'Sending.'){
        SendButton.textContent = 'Sending..';
     }
     else if (SendButton.textContent == 'Sending..'){
        SendButton.textContent = 'Sending...';
     }
     else if (SendButton.textContent == 'Sending...'){
        SendButton.textContent = 'Sending';
     }
 }
 else{
    SendButton.textContent = 'Send';
 }

 if (loadButton.textContent == 'Uploading'){
    loadButton.textContent = 'Uploading.';
 }
 else if(loadButton.textContent == 'Uploading.'){
    loadButton.textContent = 'Uploading..';
 }
 else if(loadButton.textContent == 'Uploading..'){
    loadButton.textContent = 'Uploading...';
 }
 else if(loadButton.textContent == 'Uploading...'){
    loadButton.textContent = 'Uploading';
 }
}, 1000);

function handleChooseFileForUpload(){
    loadButton.textContent = 'Load';
}

function handleSendButton() {
// Create a FormData object
  const formData = new FormData();
  var text = document.getElementById("TextBoxInsertQuestion").value
  //var ShowAnswer = document.getElementById("TextBoxShowAnswer")

  formData.append('text', text);
  if (ShowAnswer.value != MsgWaitForAnswer){
      ShowAnswer.value = MsgWaitForAnswer

      fetch(ServerAddress + '/question', {
            method: 'POST',
            body: formData
      })
      .then(response => response.text())
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
  else{
    ShowAnswer.value = MsgWaitForAnswer
  }
}

// Function to handle file upload
function handleFileUpload() {
  const file = fileInput.files[0];

  //var ShowAnswer = document.getElementById("TextBoxShowAnswer")

  loadButton.textContent = 'Uploading';

  if (ShowAnswer.value != MsgWaitForAnswer){
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);

      // Send the file data to the Streamlit backend
      //fetch('http://localhost:8888/upload', {
      fetch(ServerAddress + '/upload', {
        method: 'POST',
        body: formData
      })
      //.then(response => response.json())
      .then(response => response.text())
      .then(data => {
        // Process and display the response data
        console.log(data);
        if (data == 'TRUE'){
            loadButton.textContent = 'The file upload was successful.';
        }
        else{
            loadButton.textContent = 'File upload failed.';
        }
        // Update the UI with the processed results
      })
      .catch(error => {
        console.error('Error:', error);
        loadButton.textContent = 'File upload failed.';
        // Handle error scenarios
      });
  }
  else{
  }
}
