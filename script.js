// Function to show content based on menu click
function showHome() {
    document.getElementById('output').textContent = '';  // Clear previous content
}

function showAbout() {
    document.getElementById('output').textContent = 'About Fintuit: Fintuit provides clear and reliable financial insights for every investor. We aim to make complex financial data simple and actionable, helping investors make smarter decisions.';
}

function showServices() {
    document.getElementById('output').textContent = 'Our Services: We offer personalized investment advice, portfolio management, and detailed market analysis to help investors achieve their financial goals.';
}

function showContact() {
    document.getElementById('output').textContent = 'Contact Us: You can reach us at contact@fintuit.com or call us at 123-456-7890.';
}

// Handle Search (from previous example)
function handleSearch(event) {
    event.preventDefault();
    const searchText = document.getElementById('searchInput').value;
    if (searchText.trim() !== "") {
        const url = `http://194.163.191.105:8000/keepalive`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const outputContainer = document.getElementById('output');
                outputContainer.textContent = `Search Results: ${JSON.stringify(data)}`;
            })
            .catch(error => {
                console.error('Error during fetch request:', error);
                const outputContainer = document.getElementById('output');
                outputContainer.textContent = 'An error occurred. Please try again later.';
            });
    } else {
        const outputContainer = document.getElementById('output');
        outputContainer.textContent = 'Please enter a search term.';
    }
    document.getElementById('searchInput').value = "";  // Clear the search input
}

// Function to send GET request every 15 minutes (900,000 ms)
function sendPeriodicRequest() {
    const url = `http://194.163.191.105:8000/keepalive`;  // Replace with your actual endpoint
    
    fetch(url)
        .then(response => response.json())  // Assuming the response is JSON
        .then(data => {
            console.log('Periodic data received:', data);
            // Handle the periodic response data as needed
        })
        .catch(error => {
            console.error('Error during periodic fetch request:', error);
        });
}

// Send a GET request immediately when the page loads
sendPeriodicRequest();  // Optional: send immediately when the page loads

// Set an interval to send GET request every 15 minutes (900,000 milliseconds)
setInterval(sendPeriodicRequest, 9000000);  // 15 minutes = 900,000 milliseconds
