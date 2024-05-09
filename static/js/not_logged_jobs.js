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
    var loginButton = document.createElement("button");
    loginButton.setAttribute("class", "loginButton");
    loginButton.textContent = "Log in to solve";

    // Append the Solve button to the list item
    listItem.appendChild(loginButton);

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
        loginButton.style.display = "block";

        // Populate the question div with the corresponding question
        document.getElementById("question").textContent = question;

        // Prevent the click event from propagating to the document body and immediately hiding the button
        event.stopPropagation();
    });

    // Function to hide the currently visible Solve button
    function hideVisibleButton() {
        var visibleButton = document.querySelector(".loginButton[style='display: block;']");
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
