// Function to create a job entry
function createJobEntry(jobId, jobName, jobDescription, difficulty, question) {
    // Create a new list item
    var listItem = document.createElement("li");

    // Create the job div
    var jobDiv = document.createElement("div");
    jobDiv.setAttribute("class", "job");
    jobDiv.setAttribute("id", "job-" + jobId); // Unique ID for each job

    // Create paragraphs for job details
    var jobNamePara = document.createElement("p");
    jobNamePara.textContent = jobName;
    var jobDescriptionPara = document.createElement("p");
    jobDescriptionPara.textContent = jobDescription;
    var difficultyPara = document.createElement("p");
    difficultyPara.textContent = "Difficulty: " + difficulty;

    // Append paragraphs to the job div
    jobDiv.appendChild(jobNamePara);
    jobDiv.appendChild(jobDescriptionPara);
    jobDiv.appendChild(difficultyPara);

    // Append the job div to the list item
    listItem.appendChild(jobDiv);

    // Create a Solve button
    var solveButton = document.createElement("button");
    solveButton.setAttribute("class", "startButton");
    solveButton.setAttribute("id", "startButton-" + jobId); // Set unique ID for each button
    solveButton.textContent = "Start solving";


    // Attach click event listener to the Solve button
    solveButton.addEventListener("click", function(event) {
        // Print a message to the console
        console.log("Start solving button clicked for question ID:", jobId);

        // Call the startSolving function
        startSolving(jobId);

        // Prevent the click event from propagating to the document body
        event.stopPropagation();
    });

    // Append the Solve button to the list item
    listItem.appendChild(solveButton);


    // Append the list item to the jobs list
    document.getElementById("jobs").appendChild(listItem);

    // Attach click event listener to the list item
    listItem.addEventListener("click", function(event) {
        // Remove 'clicked' class from all list items
        var allListItems = document.querySelectorAll("#jobs li");
        allListItems.forEach(function(item) {
            item.classList.remove("clicked");
        });

        // Add 'clicked' class to the clicked list item
        listItem.classList.add("clicked");

        // Hide the previously visible Solve button
        hideVisibleButton();

        // Show the Solve button for the selected job
        solveButton.style.display = "block";

        // Populate the question div with the corresponding question
        document.getElementById("question").textContent = question;

        // Prevent the click event from propagating to the document body and immediately hiding the button
        event.stopPropagation();
    });

    // Function to hide the currently visible Solve button
    function hideVisibleButton() {
        var visibleButton = document.querySelector(".startButton[style='display: block;']");
        if (visibleButton) {
            visibleButton.style.display = "none";
        }
    }
}

    // Function to fetch job entries from JSON file
    function fetchJobEntries() {
        fetch('static/jobs.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(job => {
                createJobEntry(job.id, job.name, job.description, job.difficulty, job.question);
            });
        })
        .catch(error => console.error('Error fetching job entries:', error));
    }

    fetchJobEntries();

    //start solving 

// Global variable to track button state
let solvingInProgress = false;

function startSolving(questionId) {
    // Print a message to the console
    console.log("Start solving button clicked for question ID:", questionId);

    // Toggle solvingInProgress variable
    solvingInProgress = !solvingInProgress;

    // Check if solving is in progress
    if (solvingInProgress) {
        // Change button text to "Done and submit!"
        document.getElementById('startButton-' + questionId).textContent = "Done and submit!";
    } else {
        // Change button text to "Start solving"
        document.getElementById('startButton-' + questionId).textContent = "Start solving";
    }

    // Check if solving is in progress
    if (!solvingInProgress) {
        // Get user input from code-input element
        const userInput = document.getElementById('code-input').innerText.trim();
        console.log("User input:", userInput); // Print user input to console for testing

        // Clear user input and restore placeholder
        document.getElementById('code-input').innerText = "";
        handlePlaceholder();

        // Send AJAX request to Flask backend
        fetch('/start_solving', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questionId: questionId })
        })
        .catch(error => console.error('Error starting solving:', error));
    }
}

// Function to handle placeholder
function handlePlaceholder() {
    const codeInput = document.getElementById('code-input');
    const formattedInput = codeDisplay.innerHTML; // Get the formatted text

    // Check if the input area is empty after formatting
    if (codeInput.innerText.trim() === "" && formattedInput === "") {
        codeInput.innerText = "Write your DAX here..."; // Restore placeholder text
        codeDisplay.innerHTML = ""; // Clear formatted text display
    } else if (codeInput.innerText === "Write your DAX here...") {
        codeDisplay.innerHTML = ""; // Clear formatted text display
    }
}

// Event listener to handle blur
codeInput.addEventListener('blur', function() {
    handlePlaceholder();
    clearCodeDisplay();
});

// Function to clear the code display
function clearCodeDisplay() {
    codeDisplay.innerHTML = ""; // Clear formatted text display
}


// Event listener to handle blur
codeInput.addEventListener('blur', function() {
    handlePlaceholder();
});

    
function doneAndSubmit(questionId) {
    // Get user input from code-input element
    const userInput = codeInput.innerText.trim();
    console.log("User input:", userInput); // Print user input to console for testing

    // Clear the code input area
    codeInput.innerText = "";
    
    // Restore placeholder
    handlePlaceholder();

    // Send AJAX request to Flask backend
    fetch('/done_and_submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questionId: questionId })
    })
    .then(response => {
        // If the submission is successful, switch the button back to "Start solving"
        if (document.getElementById('startButton-' + questionId).textContent === 'Done and submit!') {
            document.getElementById('startButton-' + questionId).textContent = 'Start solving';
        }
    })
    .catch(error => console.error('Error done and submit:', error));
}