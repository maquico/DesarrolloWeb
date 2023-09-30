document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.querySelector('.close');
    const addButton = document.getElementById('addButton');
    const loginSubmit = document.getElementById('loginSubmit');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    
    const registerButton = document.getElementById('registerButton');
    const registerModal = document.getElementById('registerModal');
    const registerCloseButton = document.getElementById('registerCloseButton');
    const registerForm = document.getElementById('registerForm');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const registerSubmitButton = document.getElementById('registerSubmitButton');

    // Event listener for the "Register" button
    registerButton.addEventListener('click', () => {
        // Show the registration modal
        registerModal.style.display = 'block';
    });

    // Event listener for the "Close" button in the registration modal
    registerCloseButton.addEventListener('click', () => {
        // Hide the registration modal
        registerModal.style.display = 'none';

        // Clear the registration form inputs
        registerUsernameInput.value = '';
        registerPasswordInput.value = '';
    });

    // Event listener for the registration form submit button
    registerSubmitButton.addEventListener('click', () => {
        // Get the username and password from the registration form
        const username = registerUsernameInput.value;
        const password = registerPasswordInput.value;

        // Send a POST request to your registration endpoint on the server
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response from the server (e.g., show a success message)
                console.log('Registration response:', data);
            })
            .catch((error) => {
                console.error('Registration error:', error);
            });

        // Hide the registration modal after submitting the form
        registerModal.style.display = 'none';

        // Clear the registration form inputs
        registerUsernameInput.value = '';
        registerPasswordInput.value = '';
    });


    // Function to fetch and display messages
    function fetchMessages() {
        // Replace with your API endpoint to fetch messages
        fetch('/messages')
            .then((response) => response.json())
            .then((data) => {
                const messages = data;
                messageList.innerHTML = '';
                messages.forEach((message) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = message.texto;
                    messageList.appendChild(listItem);
                });
            })
            .catch((error) => console.error('Error fetching messages:', error));
    }

    // Event listener for login button
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

   // Initially, the user is not logged in
let isLoggedIn = false;

// Function to enable or disable the "Add Message" button based on the user's login status
function updateAddButtonStatus() {
    if (isLoggedIn) {
        addButton.disabled = false; // Enable the button
    } else {
        addButton.disabled = true; // Disable the button
    }
}

// Event listener for login form submit button
loginSubmit.addEventListener('click', () => {
    // Get the username and password from the login form
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Send a POST request to your login endpoint on the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Handle the response from the server (e.g., check if login was successful)
            console.log('Login response:', data);

            // If login was successful, set the isLoggedIn variable to true
            isLoggedIn = true;

            // Update the "Add Message" button status
            updateAddButtonStatus();

            // Close the login modal
            loginModal.style.display = 'none';

            // Clear the login form inputs
            usernameInput.value = '';
            passwordInput.value = '';
        })
        .catch((error) => {
            console.error('Login error:', error);
        });
});

// Event listener for add button
addButton.addEventListener('click', () => {
    // Check if the user is logged in
    if (isLoggedIn && !document.querySelector('.message-input')) {
        // If the user is logged in and there are no existing message input elements
        // Create a textarea element for the user to enter the message
        const messageTextArea = document.createElement('textarea');
        messageTextArea.placeholder = 'Enter your message';
        messageTextArea.rows = 4; // You can adjust the number of rows
        messageTextArea.classList.add('message-input'); // Add a class for easy identification

        // Create a submit button to post the message
        const submitMessageButton = document.createElement('button');
        submitMessageButton.textContent = 'Submit Message';

        // Event listener for the submit button
        submitMessageButton.addEventListener('click', () => {
            const newMessage = messageTextArea.value.trim();

            if (newMessage) {
                // You can send a POST request to your server to add the message
                fetch('/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ texto: newMessage }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        // Handle the response from the server (e.g., show a success message)
                        console.log('Add Message response:', data);

                        // After successfully adding the message, you may want to fetch and update the message list
                        fetchMessages();

                        // Remove the message input elements
                        messageTextArea.remove();
                        submitMessageButton.remove();
                    })
                    .catch((error) => {
                        console.error('Add Message error:', error);
                    });
            }
        });

        // Append the message input elements to the page
        const addMessageSection = document.getElementById('addMessageSection');
        addMessageSection.appendChild(messageTextArea);
        addMessageSection.appendChild(submitMessageButton);
    } else if (!isLoggedIn) {
        // If the user is not logged in, display the login modal
        loginModal.style.display = 'block';
    }
});


    // Event listener for close button in the login modal
    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });


    fetchMessages();
});
