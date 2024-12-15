document.addEventListener("DOMContentLoaded", function() {
    
    const innerMainBody = document.querySelector(".inner-main-body");
    const lowerBody = document.querySelector(".lower-body");
    const reflectBody = document.querySelector(".reflectBody");
    
    // Start Session Button
    let createStartSessionButton = () => {
        const startSessionButton = document.createElement("button");
        startSessionButton.className = "startSessionButton";
        startSessionButton.textContent = "Start Session";
        let addWorkoutButton = createAddWorkoutButton();
        let endSessionButton = createEndSessionButton();
        
        startSessionButton.addEventListener("click", function () {
            innerMainBody.innerHTML = "";
            innerMainBody.appendChild(addWorkoutButton);
            innerMainBody.appendChild(endSessionButton);
        });
        
        return startSessionButton;
    };

    let createAddWorkoutButton = () => {
        let addWorkoutButton = document.createElement("button");
        addWorkoutButton.className = "addWorkoutButton";
        addWorkoutButton.innerHTML = "<strong>Add Workout</strong>"
        
        // Click Event: Add a new workout to session
        addWorkoutButton.addEventListener("click", async function() {
            addWorkoutButton.remove();
            const workoutsData = await fetchWorkouts();
            let addWorkoutForm = createAddWorkoutForm(workoutsData);
            innerMainBody.insertBefore(addWorkoutForm, innerMainBody.firstChild);
        });
        
        return addWorkoutButton;
    };

    // Gather existing workouts to populate workout list with
    async function fetchWorkouts() {
        try {
            const response = await fetch("workouts.json");
            const data = await response.json();
            return data;
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    // Create Add Workout Form
    let createAddWorkoutForm = (workoutsData) => {
        let addWorkoutForm = document.createElement("div");
        addWorkoutForm.className = "addWorkoutForm";

        let workoutDropdownLabel = document.createElement("label");
        workoutDropdownLabel.setAttribute("for", "workoutDropdownList");
        workoutDropdownLabel.innerHTML = "<p class='workoutDropdownLabel'>Choose Workout:</p>";

        let workoutDropdownList = document.createElement("select");
        workoutDropdownList.setAttribute("name", "workoutDropdown");
        workoutDropdownList.className = "workoutDropdownList";

        // Add workouts to the dropdown
        let option = document.createElement("option");
        option.value = "selectWorkout";
        option.text = "Select Workout...";
        workoutDropdownList.appendChild(option);

        workoutsData.workouts.forEach(workout => {
            let option = document.createElement("option");
            option.value = workout.name;
            option.text = workout.name;
            workoutDropdownList.appendChild(option);
        });

        // Change Form depending on chosen Workout 
        workoutDropdownList.addEventListener("change", function() {
            let existingWorkoutDetails = document.querySelector(".workoutDetails");
            if (existingWorkoutDetails) {
                existingWorkoutDetails.remove();
            }

            createWorkoutDetails(workoutsData);
        });

        addWorkoutForm.appendChild(workoutDropdownLabel);
        addWorkoutForm.appendChild(workoutDropdownList);
        
        return addWorkoutForm;
    };

    let createWorkoutDetails = (workoutsData) => {
        let selectedWorkoutName = document.querySelector(".workoutDropdownList").value;
        
        // Find the selected workout object from workoutsData
        let selectedWorkout = workoutsData.workouts.find(workout => workout.name === selectedWorkoutName);
        
        // Contains Measurement Name, Input, and Submit Button
        let workoutDetails = document.createElement("fieldset");
        workoutDetails.setAttribute("class", "workoutDetails");    
    
        if (selectedWorkout && selectedWorkout.measurements.includes("sets")) {
            let setsLabel = document.createElement("label");
            setsLabel.innerText = "SETS";
            setsLabel.setAttribute("for", "sets");
            setsLabel.className = "measurementName";
    
            let setsInput = document.createElement("input");
            setsInput.setAttribute("type", "number");
            setsInput.setAttribute("id", "sets");
            setsInput.setAttribute("name", "sets");
            setsInput.className = "measurementInput";
    
            let submitSetsNumButton = document.createElement("button");
            submitSetsNumButton.className = "submitSetsNumButton";
            submitSetsNumButton.textContent = "Submit Sets";
    
            submitSetsNumButton.addEventListener("click", function () {
                let submitSetsNum = setsInput.value;
                workoutDetails.innerHTML = "";

                for (let i = 1; i <= submitSetsNum; i++) {
                    let setCount = document.createElement("p");
                    setCount.className = "setDetailCount";
                    setCount.innerText = `SET ${i}`
                    workoutDetails.appendChild(setCount)

                    createSetDetails(selectedWorkout.measurements);
                }

                workoutDetails.appendChild(createSubmitWorkoutButton());
            });
    
            workoutDetails.appendChild(setsLabel);
            workoutDetails.appendChild(setsInput);
            workoutDetails.appendChild(submitSetsNumButton);
        }

        lowerBody.appendChild(workoutDetails)        
    };

    let createSetDetails = (measurements) => {    
        let workoutDetails = document.querySelector(".workoutDetails");

        let setDiv = document.createElement("div");
        setDiv.className = "setDiv";
        
        measurements.forEach(name => {
            if (name !== "sets") {
                
                let measurementDiv = document.createElement("div");
                measurementDiv.className = "measurementDiv";
                
                let measurementItem = document.createElement("label");
                measurementItem.innerText = name.toUpperCase();
                measurementItem.setAttribute("for", name);
                measurementItem.className = "measurementName";
                
                let measurementValue = document.createElement("input");
                measurementValue.setAttribute("type", "text");
                measurementValue.setAttribute("id", name);
                measurementValue.setAttribute("name", name); 
                
                measurementDiv.appendChild(measurementItem);
                measurementDiv.appendChild(measurementValue);
                
                setDiv.appendChild(measurementDiv);
            };
            
            workoutDetails.appendChild(setDiv);
        });
    };
    
    let createSubmitWorkoutButton = () => {
        let submitWorkoutButton = document.createElement("button");
        submitWorkoutButton.className = "submitWorkout";
        submitWorkoutButton.textContent = "Submit";

        submitWorkoutButton.addEventListener("click", createSessionItem);

        return submitWorkoutButton
    }
    
    // Stores new workout to be added to session list
    let createSessionItem = () => {
        let workoutDetails = document.querySelector(".workoutDetails");
        let setDetails = workoutDetails.querySelectorAll(".setDiv");
        let workoutDropdownList = document.querySelector(".workoutDropdownList");
        let addWorkoutForm = document.querySelector(".addWorkoutForm");
        let endSessionButton = document.querySelector(".endSessionButton");
        
        let sessionItemName = workoutDropdownList.value.toUpperCase();
        
        let sessionItem = document.createElement("div");
        sessionItem.className = "sessionItem";

        let sessionItemNameElement = document.createElement("p");
        sessionItemNameElement.className = "sessionItemName";
        sessionItemNameElement.innerText = sessionItemName.toUpperCase();

        sessionItem.appendChild(sessionItemNameElement);

        let storedInputs = [];
        
        
        let i = 1;
        
        setDetails.forEach((set) => {
            let sessionItemBox = document.createElement("div");
            sessionItemBox.className = "sessionItemBox";
            
            let inputs = set.querySelectorAll("input");
            
            storedInputs = Array.from(inputs).map(input => {
                return {
                measurement: input.name,
                value: input.value
                };
            });

            let setCount = document.createElement("p");
            setCount.className = "setCount";
            setCount.innerText = `SET ${i}`
            
            sessionItemBox.appendChild(setCount);

            storedInputs.forEach((input) => {
                let sessionItemName = document.createElement("p");
                sessionItemName.className = "itemName";
                sessionItemName.innerText = input.measurement.toUpperCase();
                
                let sessionItemValue = document.createElement("p");
                sessionItemValue.className = "itemValue";
                sessionItemValue.innerText = input.value;
    
                sessionItemBox.appendChild(sessionItemName);
                sessionItemBox.appendChild(sessionItemValue);
            });

            sessionItem.appendChild(sessionItemBox);

            i = i + 1;
        });

        addWorkoutForm.remove();
        workoutDetails.remove();

        let addWorkoutButton = createAddWorkoutButton();
        innerMainBody.insertBefore(addWorkoutButton, endSessionButton);
        lowerBody.appendChild(sessionItem);
    };

    let createEndSessionButton = () => {
        let endSessionButton = document.createElement("button");
        endSessionButton.className = "endSessionButton";
        endSessionButton.textContent = "End Session";
    
        endSessionButton.addEventListener("click", function () {
            const addWorkoutButton = document.querySelector(".addWorkoutButton");
            
            if (addWorkoutButton) {
                addWorkoutButton.remove();
            }
        
            storeSession();
        
            innerMainBody.innerHTML = "";
            lowerBody.innerHTML = "";
            
            innerMainBody.appendChild(createStartSessionButton());
        });
        
        return endSessionButton;
    };
    
    let storeSession = () => {
        let sessionDataString = localStorage.getItem('sessionData');
        let sessionData = sessionDataString ? JSON.parse(sessionDataString) : [];
        let sessionCount = document.querySelector(".sessionCount");

        let lastId = sessionData.length > 0 ? Math.max(...sessionData.map(session => session.id)) : 0;
        if (sessionCount) {
            sessionCount.innerText = `${lastId}`;
        }

        let newSession = {
            id: lastId + 1,
            items: []
        };
    
        const sessionItems = document.querySelectorAll(".sessionItemBox");
    
        if (sessionItems.length > 0) {
            sessionItems.forEach(item => {
                let workoutNameElement = item.querySelector(".sessionItemName");
                if (workoutNameElement) {
                    newSession.items.push(workoutNameElement.textContent.trim());
                }
            });
        }
    
        sessionData.push(newSession);
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
    
    let createReflect = () => {
        
        let sessionDataString = localStorage.getItem('sessionData');
        let sessionData = sessionDataString ? JSON.parse(sessionDataString) : [];
        let sessionCount = document.querySelector(".sessionCount");

        let lastId = sessionData.length > 0 ? Math.max(...sessionData.map(session => session.id)) : 0;
        sessionCount.innerText = `${lastId}`;
        
        if (!sessionData) {
            sessionData = [];
        }
        console.log(sessionData)

        let reflectBody = document.querySelector(".reflectBody");

        reflectBody.innerHTML = '';

        sessionData.forEach(session => {
            let sessionDiv = document.createElement("div");
            sessionDiv.className = "sessionSummary";

            let workoutNames = session.items.map(item => item.workout).join("; ");
          
            sessionDiv.innerText = `Session ${session.id}: ${workoutNames}`;

            reflectBody.appendChild(sessionDiv);
        });
    }

    if (innerMainBody) {
        innerMainBody.appendChild(createStartSessionButton());
    }

    if (reflectBody) {
        createReflect();
    }
});