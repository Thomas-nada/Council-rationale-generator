// Global variable to track the current step
let currentStep = 1;
// Object to store input data collected from all steps
const formData = {};
formData.manualRelevantArticles = []; // Array to store relevant articles references { label, uri, selectedArticles? }
formData.manualOtherReferences = []; // Array to store other references { label, uri }
// Total number of steps in the form
const totalSteps = 6; // Remains 6 steps (incl. review)
// Object to track the validation status of each step
const stepValidity = {};

// --- Reference Library Definition ---
const referenceLibrary = [
    { label: "Cardano Blockchain Ecosystem Constitution", uri: "ipfs://bafkreiazhhawe7sjwuthcfgl3mmv2swec7sukvclu3oli7qdyz4uhhuvmy", isConstitution: true }, // Added flag
    { label: "GovTool", uri: "https://gov.tools/" },
    { label: "CIP-100 (Governance Metadata)", uri: "https://cips.cardano.org/cip/CIP-0100" },
    { label: "CIP-136 (CC Vote Metadata)", uri: "https://cips.cardano.org/cip/CIP-0136" },
    { label: "CIP-1694 (Governance Framework)", uri: "https://cips.cardano.org/cip/CIP-1694" },
    // Add more common references here
];

// **** UPDATED & REFORMATTED: Constitution Articles Extracted from PDF ****
const constitutionArticles = [
    // Preamble
    "PREAMBLE",                                                         //
    // Tenets (Under Article I but listed after Preamble)
    "TENET 1",                                                          //
    "TENET 2",                                                          //
    "TENET 3",                                                          //
    "TENET 4",                                                          //
    "TENET 5",                                                          //
    "TENET 6",                                                          //
    "TENET 7",                                                          //
    "TENET 8",                                                          //
    "TENET 9",                                                          //
    "TENET 10",                                                         //
    // ARTICLE I: CARDANO BLOCKCHAIN TENETS AND GUARDRAILS                //
    "Article I Section 1",                                              //
    "Article I Section 2",                                              //
    // ARTICLE II: THE CARDANO BLOCKCHAIN COMMUNITY                     //
    "Article II Section 1",                                             //
    "Article II Section 2",                                             //
    "Article II Section 3",                                             //
    "Article II Section 4",                                             //
    // ARTICLE III: PARTICIPATORY AND DECENTRALIZED GOVERNANCE            //
    "Article III Section 1",                                            //
    "Article III Section 2",                                            //
    "Article III Section 3",                                            //
    "Article III Section 4",                                            //
    "Article III Section 5",                                            //
    "Article III Section 6",                                            //
    // ARTICLE IV: THE CARDANO BLOCKCHAIN ECOSYSTEM BUDGET                //
    "Article IV Section 1",                                             //
    "Article IV Section 2",                                             //
    "Article IV Section 3",                                             //
    "Article IV Section 4",                                             //
    "Article IV Section 5",                                             //
    // ARTICLE V: DELEGATED REPRESENTATIVES                               //
    "Article V Section 1",                                              //
    "Article V Section 2",                                              //
    "Article V Section 3",                                              //
    "Article V Section 4",                                              //
    "Article V Section 5",                                              //
    "Article V Section 6",                                              //
    // ARTICLE VI: STAKE POOL OPERATORS                                   //
    "Article VI Section 1",                                             //
    "Article VI Section 2",                                             //
    "Article VI Section 3",                                             //
    "Article VI Section 4",                                             //
    // ARTICLE VII: CONSTITUTIONAL COMMITTEE                              //
    "Article VII Section 1",                                            //
    "Article VII Section 2",                                            //
    "Article VII Section 3",                                            //
    "Article VII Section 4",                                            //
    "Article VII Section 5",                                            //
    "Article VII Section 6",                                            //
    "Article VII Section 7",                                            //
    "Article VII Section 8",                                            //
    "Article VII Section 9",                                            //
    // ARTICLE VIII: AMENDMENT PROCESS                                    //
    "Article VIII Section 1",                                           //
    "Article VIII Section 2",                                           //
    "Article VIII Section 3",                                           //
    // APPENDIX I: CARDANO BLOCKCHAIN GUARDRAILS                          //
    "Appendix I Section 1: Introduction",                               //
    "Appendix I Section 1: Amending, Adding or Deprecating Guardrails", //
    "Appendix I Section 1: Terminology and Guidance",                   //
    "Appendix I Section 1: Automated Checking ('Guardrails Script')",   //
    "Appendix I Section 2: Protocol Parameter Update Actions",          //
    "Appendix I Section 2.1: Critical Protocol Parameters",             //
    "Appendix I Section 2.2: Economic Parameters",                      //
    "Appendix I Section 2.3: Network Parameters",                       //
    "Appendix I Section 2.4: Technical/Security Parameters",            //
    "Appendix I Section 2.5: Governance Parameters",                    //
    "Appendix I Section 2.6: Monitoring and Reversion",                 //
    "Appendix I Section 2.7: Non-Updatable Parameters",                 //
    "Appendix I Section 3: Treasury Withdrawal Actions",                //
    "Appendix I Section 4: Hard Fork Initiation Actions",               //
    "Appendix I Section 5: Update CC or Threshold Actions",             //
    "Appendix I Section 6: New Constitution/Script Actions",            //
    "Appendix I Section 7: No Confidence Actions",                      //
    "Appendix I Section 8: Info Actions",                               //
    "Appendix I Section 9: List of Protocol Parameter Groups",          //
    // APPENDIX II: SUPPORTING GUIDANCE                                   //
    "Appendix II Section 1: Framing Notes",                             //
    "Appendix II Section 2: Other Guidance"                             //
];

// --- DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    showStep(1); // Show the first step on load
    populateReferenceLibraryDropdown(); // Populate the library dropdown
    updateReferenceDisplay('relevant'); // Initial display update for references
    updateReferenceDisplay('other');   // Initial display update for references
    hideConstitutionSelector(); // Ensure selector is hidden initially

    // --- Summary Character Counter Setup ---
    const summaryTextarea = document.getElementById('summary');
    const summaryCharCount = document.getElementById('summary-char-count');
    if (summaryTextarea && summaryCharCount) {
        summaryCharCount.textContent = summaryTextarea.value.length; // Initial count
        summaryTextarea.addEventListener('input', () => {
            const count = summaryTextarea.value.length;
            summaryCharCount.textContent = count;
            summaryCharCount.style.color = count > 300 ? 'red' : 'inherit';
        });
    }
    // Hide error message div initially
     const errorDiv = document.getElementById('error-message');
     if(errorDiv) errorDiv.style.display = 'none';
});


// --- Reference Library Functions ---

/**
 * Populates the reference library dropdown menu.
 */
function populateReferenceLibraryDropdown() {
    const selectElement = document.getElementById('library-select');
    if (!selectElement) return;

    referenceLibrary.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as value for easy lookup
        option.textContent = item.label; // Display label to the user
        selectElement.appendChild(option);
    });
}

/**
 * Adds the selected library reference to the appropriate internal list and updates display.
 * Handles showing/hiding the constitution article selector.
 * @param {string} targetType - 'relevant' or 'other'.
 */
function addLibraryReference(targetType) {
    const selectElement = document.getElementById('library-select');
    const errorDiv = document.getElementById('manual-ref-error');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';

    if (!selectElement || selectElement.value === "") {
        errorDiv.textContent = 'Please select a reference from the library.';
        errorDiv.style.display = 'block';
        return;
    }

    const selectedIndex = parseInt(selectElement.value, 10);
    const selectedRef = referenceLibrary[selectedIndex];

    if (selectedRef) {
        // **** MODIFIED: Add selectedArticles array for Constitution ****
        const newRef = {
            label: selectedRef.label,
            uri: selectedRef.uri,
            isConstitution: selectedRef.isConstitution || false // Store flag
            // selectedArticles will be added specifically for constitution below
        };

        if (targetType === 'relevant') {
            if (!formData.manualRelevantArticles.some(ref => ref.uri === newRef.uri)) {
                // **** MODIFIED: Add selectedArticles if it's the constitution ****
                if (newRef.isConstitution) {
                    newRef.selectedArticles = []; // Initialize empty array for selections
                    showConstitutionSelector(formData.manualRelevantArticles.length); // Show selector, pass index
                }
                formData.manualRelevantArticles.push(newRef);
                updateReferenceDisplay('relevant');
            } else {
                 errorDiv.textContent = 'This library reference is already in Relevant Articles.';
                 errorDiv.style.display = 'block';
            }
        } else if (targetType === 'other') {
             if (!formData.manualOtherReferences.some(ref => ref.uri === newRef.uri)) {
                formData.manualOtherReferences.push(newRef);
                updateReferenceDisplay('other');
                // Hide selector if constitution was added to 'other' (unlikely use case)
                if (newRef.isConstitution && !formData.manualRelevantArticles.some(r => r.isConstitution)) {
                    hideConstitutionSelector();
                }
             } else {
                  errorDiv.textContent = 'This library reference is already in Other References.';
                  errorDiv.style.display = 'block';
             }
        }
    } else {
         errorDiv.textContent = 'Could not find selected library reference.';
         errorDiv.style.display = 'block';
    }
}

/**
 * Adds a manually entered reference.
 */
function addManualReference() {
    const labelInput = document.getElementById('manualRefLabel');
    const uriInput = document.getElementById('manualRefUri');
    const targetSelect = document.getElementById('manualRefTarget');
    const errorDiv = document.getElementById('manual-ref-error');

    const label = labelInput.value.trim();
    const uri = uriInput.value.trim();
    const targetType = targetSelect.value; // 'relevant' or 'other'
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';

    if (!label) {
        errorDiv.textContent = 'Please enter a Reference Label.';
        errorDiv.style.display = 'block'; labelInput.focus(); return;
    }
    if (!uri) {
        errorDiv.textContent = 'Please enter a Reference URI.';
        errorDiv.style.display = 'block'; uriInput.focus(); return;
    }
    if (!uri.includes(':') && !uri.includes('.')) {
         errorDiv.textContent = 'Please enter a valid URI (e.g., include http://, ipfs://, or other scheme).';
         errorDiv.style.display = 'block'; uriInput.focus(); return;
    }

    // **** MODIFIED: Check if manually added ref IS the constitution ****
    const isConstitution = (label === "Cardano Blockchain Ecosystem Constitution");
    const newRef = {
        label: label,
        uri: uri,
        isConstitution: isConstitution
        // selectedArticles will be added below if needed
    };

    if (targetType === 'relevant') {
         if (!formData.manualRelevantArticles.some(ref => ref.uri === newRef.uri)) {
            // **** MODIFIED: Add selectedArticles and show selector if it's the constitution ****
            if (newRef.isConstitution) {
                newRef.selectedArticles = []; // Initialize
                showConstitutionSelector(formData.manualRelevantArticles.length); // Show selector
            }
            formData.manualRelevantArticles.push(newRef);
            updateReferenceDisplay('relevant');
            labelInput.value = ''; uriInput.value = '';
         } else {
              errorDiv.textContent = 'This URI is already in Relevant Articles.';
              errorDiv.style.display = 'block';
         }
    } else if (targetType === 'other') {
         if (!formData.manualOtherReferences.some(ref => ref.uri === newRef.uri)) {
            formData.manualOtherReferences.push(newRef);
            updateReferenceDisplay('other');
             // Hide selector if constitution was added manually to 'other'
            if (newRef.isConstitution && !formData.manualRelevantArticles.some(r => r.isConstitution)) {
                hideConstitutionSelector();
            }
            labelInput.value = ''; uriInput.value = '';
         } else {
             errorDiv.textContent = 'This URI is already in Other References.';
             errorDiv.style.display = 'block';
         }
    }
}

/**
 * Updates the visual list display for a given reference type.
 * @param {string} targetType - 'relevant' or 'other'.
 */
function updateReferenceDisplay(targetType) {
    let displayListElement;
    let referenceArray;

    if (targetType === 'relevant') {
        displayListElement = document.getElementById('relevantArticlesDisplay');
        referenceArray = formData.manualRelevantArticles;
    } else { // Assumes 'other'
        displayListElement = document.getElementById('otherReferencesDisplay');
        referenceArray = formData.manualOtherReferences;
    }

    if (!displayListElement) return;
    displayListElement.innerHTML = ''; // Clear current list

    if (referenceArray.length === 0) {
         displayListElement.innerHTML = '<li>No references added yet.</li>';
    } else {
        referenceArray.forEach((ref, index) => {
            const listItem = document.createElement('li');
            // **** MODIFIED: Display selected articles for Constitution ****
            let selectedArticlesHtml = '';
            if (ref.isConstitution && ref.selectedArticles && ref.selectedArticles.length > 0 && targetType === 'relevant') { // Only show for relevant const ref
                selectedArticlesHtml = `<span class="selected-articles">(Selected: ${escapeHtml(ref.selectedArticles.join(', '))})</span>`;
            }
            listItem.innerHTML = `
                <span class="ref-display-label">${escapeHtml(ref.label)}:</span>
                <span class="ref-display-uri">${escapeHtml(ref.uri)}</span>
                ${selectedArticlesHtml} {/* Added selected articles display */}
                <button type="button" class="delete-ref-button" onclick="deleteReference('${targetType}', ${index})">Delete</button>
            `;
            displayListElement.appendChild(listItem);
        });
    }
}

/**
 * Deletes a reference from the specified list and updates the display.
 * Hides constitution selector if the constitution reference is removed from 'relevant'.
 * @param {string} targetType - 'relevant' or 'other'.
 * @param {number} index - The index of the reference to delete.
 */
function deleteReference(targetType, index) {
    let referenceArray;
    let isRelevant = false;

    if (targetType === 'relevant') {
        referenceArray = formData.manualRelevantArticles;
        isRelevant = true;
    } else if (targetType === 'other') {
        referenceArray = formData.manualOtherReferences;
    } else {
        return; // Should not happen
    }

     if (index >= 0 && index < referenceArray.length) {
         const deletedRef = referenceArray[index]; // Get ref before deleting
         referenceArray.splice(index, 1);

         // **** MODIFIED: Hide selector if Constitution was deleted from relevant ****
         if (isRelevant && deletedRef.isConstitution) {
             // Check if *any* constitution ref still exists in relevant articles
             const constitutionStillRelevant = formData.manualRelevantArticles.some(ref => ref.isConstitution);
             if (!constitutionStillRelevant) {
                 hideConstitutionSelector();
             } else {
                 // If another constitution ref exists (unlikely?), we might need to repopulate selector
                 // Find the index of the remaining constitution ref
                 const remainingConstIndex = formData.manualRelevantArticles.findIndex(ref => ref.isConstitution);
                 if(remainingConstIndex > -1) {
                    showConstitutionSelector(remainingConstIndex); // Refresh selector for the remaining one
                 }
             }
         }
        updateReferenceDisplay(targetType); // Update display AFTER potential selector changes
     }
}


// **** NEW: Functions to handle Constitution Article Selector ****

/** Shows and populates the constitution article selector */
function showConstitutionSelector(referenceIndex) {
    const selectorDiv = document.getElementById('constitution-articles-selector');
    const checkboxesContainer = document.getElementById('constitution-checkboxes-container');
    if (!selectorDiv || !checkboxesContainer) return;

    checkboxesContainer.innerHTML = ''; // Clear previous checkboxes

    // Get the current selections for this reference
    const currentSelections = formData.manualRelevantArticles[referenceIndex]?.selectedArticles || [];

    constitutionArticles.forEach(article => {
        // Skip comments
        if (article.startsWith("//")) return;

        const checkboxId = `const-art-${article.replace(/[\s\W]+/g, '-')}`; // Create a unique ID, handle non-alphanumeric chars
        const isChecked = currentSelections.includes(article); // Check if already selected

        const label = document.createElement('label');
        label.htmlFor = checkboxId;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.value = article;
        checkbox.checked = isChecked; // Set checked state
        // Add event listener to update selections in formData
        checkbox.addEventListener('change', (event) => {
            // Find the current index of the constitution reference (it might change if others are deleted)
            const currentConstIndex = formData.manualRelevantArticles.findIndex(ref => ref.uri === formData.manualRelevantArticles[referenceIndex].uri && ref.isConstitution);
             if (currentConstIndex > -1) {
                updateConstitutionSelections(currentConstIndex, event.target.value, event.target.checked);
                // Also update the display immediately
                updateReferenceDisplay('relevant');
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${article}`)); // Add space before text
        checkboxesContainer.appendChild(label);
    });

    selectorDiv.style.display = 'block'; // Show the container
}

/** Hides and clears the constitution article selector */
function hideConstitutionSelector() {
    const selectorDiv = document.getElementById('constitution-articles-selector');
    const checkboxesContainer = document.getElementById('constitution-checkboxes-container');
     if (selectorDiv) {
        selectorDiv.style.display = 'none';
    }
    if (checkboxesContainer) {
        checkboxesContainer.innerHTML = ''; // Clear content
    }
}

/** Updates the selected articles array for the constitution reference */
function updateConstitutionSelections(referenceIndex, articleValue, isChecked) {
    // Ensure the reference exists and has the selectedArticles array
    if (formData.manualRelevantArticles[referenceIndex]?.isConstitution) {
        if (!formData.manualRelevantArticles[referenceIndex].selectedArticles) {
             formData.manualRelevantArticles[referenceIndex].selectedArticles = []; // Initialize if somehow missing
        }

        const selections = formData.manualRelevantArticles[referenceIndex].selectedArticles;
        if (isChecked) {
            // Add article if checked and not already present
            if (!selections.includes(articleValue)) {
                selections.push(articleValue);
            }
        } else {
            // Remove article if unchecked
            const indexToRemove = selections.indexOf(articleValue);
            if (indexToRemove > -1) {
                selections.splice(indexToRemove, 1);
            }
        }
        // Sort selections based on their order in the main constitutionArticles array for consistency
        selections.sort((a, b) => {
            // Filter out comments before finding index
            const mainList = constitutionArticles.filter(item => !item.startsWith("//"));
            return mainList.indexOf(a) - mainList.indexOf(b);
        });
    } else {
        console.warn("Attempted to update selections for a non-constitution reference at index", referenceIndex);
    }
}


// --- Step Navigation and Validation Functions ---
// (No changes needed in showStep, validateStep, runFinalValidation, collectStepData, nextStep, prevStep)
// Existing functions for steps 1-4, 6 remain the same...
/**
 * Updates the visual status indicator (checkmark) for a given step.
 * @param {number} stepNumber - The step number whose status indicator should be updated.
 */
function updateStepStatusDisplay(stepNumber) {
    const statusElement = document.getElementById(`status-step-${stepNumber}`);
    if (statusElement) {
        if (stepValidity[stepNumber]) {
            statusElement.textContent = '✓'; // Checkmark for valid
            statusElement.classList.add('valid');
        } else {
            statusElement.textContent = ''; // Clear if not valid
            statusElement.classList.remove('valid');
        }
    }
}


/**
 * Hides all form steps and displays the specified step number.
 * Resets Step 6 verification state when shown.
 * @param {number} stepNumber - The step number to display.
 */
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    const stepToShow = document.getElementById(`step-${stepNumber}`);
    if (stepToShow) {
        stepToShow.style.display = 'block';
        updateStepStatusDisplay(stepNumber); // Update status for the shown step

        // If showing Step 6, reset verification state and populate review
        if (stepNumber === totalSteps) {
            populateReviewArea();
            document.getElementById('generate-button').disabled = true; // Disable generate button
            const verificationStatusDiv = document.getElementById('verification-status');
            verificationStatusDiv.textContent = ''; // Clear verification message
            verificationStatusDiv.className = ''; // Clear status styling
            const errorMsgDiv = document.getElementById('error-message');
            errorMsgDiv.textContent = ''; // Clear generation errors
            errorMsgDiv.style.display = 'none'; // Hide generation error div

        }
    }
    currentStep = stepNumber;
}

/**
 * Validates the input fields within the specified step number based on requirements.
 * Stores the validation result in `stepValidity`.
 * @param {number} stepNumber - The step number to validate.
 * @param {boolean} showAlerts - Whether to show alert popups for errors (default: true).
 * @returns {boolean} - True if the step is valid, false otherwise.
 */
function validateStep(stepNumber, showAlerts = true) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (!stepElement) return false;

    const requiredInputs = stepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true; // Assume valid initially
    let firstErrorMessage = '';

    // Check required fields first
    requiredInputs.forEach(input => {
        if (isValid && !input.value.trim()) { // Only check if still valid
            const fieldName = input.id === 'hashAlgorithm' ? 'Hash Algorithm' : (input.previousElementSibling?.textContent || input.id);
            firstErrorMessage = `Please fill in the required field: ${fieldName}`;
            if (showAlerts) alert(firstErrorMessage);
            input.focus();
            isValid = false;
        }
    });

    // Don't proceed with specific checks if a required field failed
    if (!isValid) {
        stepValidity[stepNumber] = false; // Store invalid status
        return false;
    }

    // --- Specific Step Validations (only if required fields are filled) ---
    if (stepNumber === 2) { // Summary length
        const summary = document.getElementById('summary').value;
        if (summary.length > 300) {
            firstErrorMessage = 'Summary must not exceed 300 characters.';
            if (showAlerts) alert(firstErrorMessage);
            document.getElementById('summary').focus();
            isValid = false;
        }
    } else if (stepNumber === 4) { // Internal votes non-negative
         const numberInputs = stepElement.querySelectorAll('input[type="number"]');
         numberInputs.forEach(input => {
             if (isValid && input.value && parseInt(input.value, 10) < 0) { // Only check if still valid
                 firstErrorMessage = `Internal vote count for ${input.previousElementSibling?.textContent || input.id} cannot be negative.`;
                 if (showAlerts) alert(firstErrorMessage);
                 input.focus();
                 isValid = false;
             }
         });
    }
    // No specific validation needed for Step 5 itself, as references are added individually
    // Add more specific validation rules here if needed for other steps

    stepValidity[stepNumber] = isValid; // Store final result
    return isValid; // Return the final validation status
}

/**
 * Runs validation checks on all input steps required for final generation.
 * @returns {{isValid: boolean, message: string}} - Object indicating overall validity and an error message if invalid.
 */
function runFinalValidation() {
    // Define which steps have mandatory requirements for final JSON
    const requiredSteps = [1, 2]; // Step 1 (hash, authors), Step 2 (summary, rationale)
    let overallValid = true;
    let finalMessage = "Verification successful. Ready to generate JSON.";

    // Validate each required step without showing alerts
    for (const stepNum of requiredSteps) {
        if (!validateStep(stepNum, false)) { // Run validation silently
            overallValid = false;
            // Construct a more helpful error message
            const stepElement = document.getElementById(`step-${stepNum}`);
            // Find the first input that failed the required check (more reliable)
            let firstInvalidInput = null;
            const reqInputs = stepElement.querySelectorAll('input[required], textarea[required]');
            for(const input of reqInputs) {
                if(!input.value.trim()) {
                    firstInvalidInput = input;
                    break;
                }
            }
            const fieldName = firstInvalidInput?.previousElementSibling?.textContent || `a required field in Step ${stepNum}`;
            finalMessage = `Verification failed: Please check ${fieldName}.`;
            showStep(stepNum); // Navigate to the invalid step
            break; // Stop on first failure
        }
    }

    // Also check specific constraints again (e.g., summary length)
    if (overallValid) {
        const summary = document.getElementById('summary').value;
        if (summary.length > 300) {
            overallValid = false;
            finalMessage = 'Verification failed: Summary exceeds 300 characters.';
            showStep(2); // Navigate to step 2
        }
        // Add checks for negative numbers in step 4 if needed, even though optional
        const numberInputs = document.querySelectorAll('#step-4 input[type="number"]');
         numberInputs.forEach(input => {
             if (overallValid && input.value && parseInt(input.value, 10) < 0) {
                 overallValid = false;
                 finalMessage = `Verification failed: Internal vote count for ${input.previousElementSibling?.textContent || input.id} cannot be negative.`;
                 showStep(4); // Navigate to step 4
             }
         });
    }

    // **** NEW: Add validation for Constitution selections if needed ****
    // Example: Ensure at least one article is selected if the Constitution is added as relevant
    /*
    if (overallValid && formData.manualRelevantArticles.some(ref => ref.isConstitution)) {
        const constitutionRef = formData.manualRelevantArticles.find(ref => ref.isConstitution);
        if (!constitutionRef.selectedArticles || constitutionRef.selectedArticles.length === 0) {
            overallValid = false;
            finalMessage = 'Verification failed: Please select at least one relevant article/section for the Constitution reference.';
            showStep(5); // Go to references step
        }
    }
    */

    return { isValid: overallValid, message: finalMessage };
}


/**
 * Collects data from all input fields within the specified step number
 * and stores it in the global `formData` object. Skips reference data.
 * @param {number} stepNumber - The step number to collect data from.
 */
function collectStepData(stepNumber) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (!stepElement) return;

    const inputs = stepElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Skip reference-related inputs in Step 5 as they are handled separately
        // Also skip constitution article checkboxes
        if (input.id !== 'manualRefLabel' && input.id !== 'manualRefUri' && input.id !== 'manualRefTarget' && input.id !== 'library-select' && !input.id.startsWith('const-art-')) {
             formData[input.id] = input.value.trim();
        }
    });

     // Special handling for number inputs in Step 4
     if (stepNumber === 4) {
        const numberIds = [
            'internal_constitutional_votes', 'internal_unconstitutional_votes',
            'internal_abstain_votes', 'internal_did_not_vote', 'internal_against_vote' // Include optional field if needed elsewhere
        ];
        numberIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const value = parseInt(input.value, 10);
                // Store as number if valid and >= 0, otherwise store null
                formData[id] = (!isNaN(value) && value >= 0) ? value : null;
            }
        });
    }
}

/**
 * Validates the current step, collects its data, updates its status display,
 * and moves to the next step if valid.
 */
function nextStep() {
    const isValid = validateStep(currentStep); // Validate with alerts
    updateStepStatusDisplay(currentStep); // Update status display

    if (isValid) {
        collectStepData(currentStep); // Collect non-reference data for the current step
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

/**
 * Collects data from the current step and moves to the previous step.
 */
function prevStep() {
    // No need to collect data when going back unless you want to save partially entered data
    // collectStepData(currentStep); // Optional: Collect data even when going back
    if (currentStep > 1) {
        showStep(currentStep - 1); // Move back
    }
}

// --- Data Parsing Functions ---

function parseAuthors(authorsString) {
    if (!authorsString) return [];
    return authorsString.split(/[\n;]+/) // Split by newline or semicolon
                      .map(a => a.trim())
                      .filter(a => a)    // Remove empty entries
                      .map(name => ({ name: name })); // Format as object
}

// --- Metadata Generation Functions ---

function buildMetadata() {
    // Ensure data from the last step before review is collected if needed
    // collectStepData(totalSteps - 1); // Step 5 data is handled separately now

    const context = {
        "@language": "en-us",
        "CIP100": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0100/README.md#",
        "CIP136": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0136/README.md#",
        "hashAlgorithm": "CIP100:hashAlgorithm",
        "body": {
            "@id": "CIP136:body",
            "@context": {
                // **** MODIFIED: Context definition updated (RelevantArticles still conceptual) ****
                "references": { "@id": "CIP100:references", "@container": "@set", "@context": { "GovernanceMetadata": "CIP100:GovernanceMetadataReference", "Other": "CIP100:OtherReference", "label": "CIP100:reference-label", "uri": "CIP100:reference-uri", "RelevantArticles": "CIP136:RelevantArticles" } },
                "summary": "CIP136:summary",
                "rationaleStatement": "CIP136:rationaleStatement",
                "precedentDiscussion": "CIP136:precedentDiscussion",
                "counterargumentDiscussion": "CIP136:counterargumentDiscussion",
                "conclusion": "CIP136:conclusion",
                "internalVote": { "@id": "CIP136:internalVote", "@context": { "constitutional": "CIP136:constitutional", "unconstitutional": "CIP136:unconstitutional", "abstain": "CIP136:abstain", "didNotVote": "CIP136:didNotVote" } }
            }
        },
        "authors": {
            "@id": "CIP100:authors",
            "@container": "@set",
            "@context": {
                "did": "@id",
                "name": "http://xmlns.com/foaf/0.1/name",
                "witness": { "@id": "CIP100:witness", "@context": { "witnessAlgorithm": "CIP100:witnessAlgorithm", "publicKey": "CIP100:publicKey", "signature": "CIP100:signature" } }
            }
        }
    };

    const metadata = {
        "@context": context,
        "hashAlgorithm": formData.hashAlgorithm || "blake2b-256",
        "body": {
            "summary": formData.summary || "",
            "rationaleStatement": formData.rationaleStatement || "",
        },
        "authors": parseAuthors(formData.authors || "")
    };

    const body = metadata.body;
    // Add optional text fields if they exist
    if (formData.precedentDiscussion) body.precedentDiscussion = formData.precedentDiscussion;
    if (formData.counterargumentDiscussion) body.counterargumentDiscussion = formData.counterargumentDiscussion;
    if (formData.conclusion) body.conclusion = formData.conclusion;

    // Add internal vote data if provided
    const internalVoteData = {};
    if (formData.internal_constitutional_votes !== null) internalVoteData.constitutional = formData.internal_constitutional_votes;
    if (formData.internal_unconstitutional_votes !== null) internalVoteData.unconstitutional = formData.internal_unconstitutional_votes;
    if (formData.internal_abstain_votes !== null) internalVoteData.abstain = formData.internal_abstain_votes;
    if (formData.internal_did_not_vote !== null) internalVoteData.didNotVote = formData.internal_did_not_vote;
    if (Object.keys(internalVoteData).length > 0) body.internalVote = internalVoteData;

    // **** MODIFIED: Build references with dynamic RelevantArticles ****
    const allReferences = [];
    const processReference = (ref) => {
         const referenceObject = {
            "@type": "Other",
            label: ref.label,
            uri: ref.uri
        };
        // Check if this is the constitution and has selected articles
        if (ref.isConstitution && ref.selectedArticles && ref.selectedArticles.length > 0) {
            // Join the selected articles array into a string
            referenceObject.RelevantArticles = ref.selectedArticles.join(', ');
        }
        allReferences.push(referenceObject);
    };

    formData.manualRelevantArticles.forEach(processReference);
    formData.manualOtherReferences.forEach(processReference); // Process 'other' refs too, in case constitution ends up there

    if (allReferences.length > 0) {
        body.references = allReferences;
    }
    // **** END MODIFICATION ****

    return metadata;
}

/**
 * Populates the review area (Step 6) with the data collected in `formData`.
 */
function populateReviewArea() {
    const reviewArea = document.getElementById('review-area');
    if (!reviewArea) return;

    let reviewHtml = '';
    // Basic Info (Step 1)
    if (formData.hashAlgorithm || formData.subject || formData.authors) {
        reviewHtml += `<div class="review-section"><h3>Basic Information</h3>`;
        if (formData.hashAlgorithm) reviewHtml += `<p><span class="review-label">Hash Algorithm:</span> <span class="review-value">${escapeHtml(formData.hashAlgorithm)}</span></p>`;
        if (formData.subject) reviewHtml += `<p><span class="review-label">Subject:</span> <span class="review-value">${escapeHtml(formData.subject)}</span></p>`;
        const authorsList = parseAuthors(formData.authors || "");
        if (authorsList.length > 0) {
             reviewHtml += `<p><span class="review-label">Authors:</span> <span class="review-value">${authorsList.map(a => escapeHtml(a.name)).join('; ')}</span></p>`;
        } else if (formData.authors) {
             reviewHtml += `<p><span class="review-label">Authors:</span> <span class="review-value">${escapeHtml(formData.authors)}</span></p>`;
        }
        reviewHtml += `</div>`;
    }
    // Core Rationale (Step 2)
    if (formData.summary || formData.rationaleStatement) {
        reviewHtml += `<div class="review-section"><h3>Core Rationale</h3>`;
        if (formData.summary) reviewHtml += `<p><span class="review-label">Summary:</span></p><pre class="review-value review-block">${escapeHtml(formData.summary)}</pre>`;
        if (formData.rationaleStatement) reviewHtml += `<p><span class="review-label">Rationale Statement:</span></p><pre class="review-value review-block">${escapeHtml(formData.rationaleStatement)}</pre>`;
        reviewHtml += `</div>`;
    }
    // Supporting Discussion (Step 3)
    let optionalDiscussionHtml = '';
    if (formData.precedentDiscussion) optionalDiscussionHtml += `<p><span class="review-label">Precedent Discussion:</span></p><pre class="review-value review-block">${escapeHtml(formData.precedentDiscussion)}</pre>`;
    if (formData.counterargumentDiscussion) optionalDiscussionHtml += `<p><span class="review-label">Counterargument Discussion:</span></p><pre class="review-value review-block">${escapeHtml(formData.counterargumentDiscussion)}</pre>`;
    if (formData.conclusion) optionalDiscussionHtml += `<p><span class="review-label">Conclusion:</span></p><pre class="review-value review-block">${escapeHtml(formData.conclusion)}</pre>`;
    if (optionalDiscussionHtml) reviewHtml += `<div class="review-section"><h3>Supporting Discussion</h3>${optionalDiscussionHtml}</div>`;

    // Internal Voting (Step 4)
    const internalVotesProvided = [
        formData.internal_constitutional_votes, formData.internal_unconstitutional_votes,
        formData.internal_abstain_votes, formData.internal_did_not_vote
    ].some(v => v !== null && v !== undefined && v !== '');

    if (internalVotesProvided) {
        reviewHtml += `<div class="review-section"><h3>Internal Votes</h3><ul class="review-list">`;
        if (formData.internal_constitutional_votes !== null) reviewHtml += `<li><span class="review-label">Constitutional:</span> ${formData.internal_constitutional_votes}</li>`;
        if (formData.internal_unconstitutional_votes !== null) reviewHtml += `<li><span class="review-label">Unconstitutional:</span> ${formData.internal_unconstitutional_votes}</li>`;
        if (formData.internal_abstain_votes !== null) reviewHtml += `<li><span class="review-label">Abstain:</span> ${formData.internal_abstain_votes}</li>`;
        if (formData.internal_did_not_vote !== null) reviewHtml += `<li><span class="review-label">Did Not Vote:</span> ${formData.internal_did_not_vote}</li>`;
        if (formData.internal_against_vote !== null) reviewHtml += `<li><span class="review-label">Votes Against Voting (Not in JSON):</span> ${formData.internal_against_vote}</li>`;
        reviewHtml += `</ul></div>`;
    }

    // **** MODIFIED: References Review (Step 5) ****
    const allAddedReferences = [
        ...formData.manualRelevantArticles,
        ...formData.manualOtherReferences
    ];

    if (allAddedReferences.length > 0) {
        reviewHtml += `<div class="review-section"><h3>References</h3><ul class="review-list review-references">`;

        const displayRefs = (refs, heading) => {
            if (refs.length > 0) {
                 reviewHtml += `<li class="review-subheading">${heading}:</li>`;
                 refs.forEach(ref => {
                    // Display selected articles if it's the constitution
                    let articlesText = '';
                    if (ref.isConstitution && ref.selectedArticles && ref.selectedArticles.length > 0) {
                        articlesText = ` <span class="review-selected-articles">[Articles: ${escapeHtml(ref.selectedArticles.join(', '))}]</span>`;
                    }
                    reviewHtml += `<li><span class="review-label">${escapeHtml(ref.label)}:</span> <span class="ref-uri">${escapeHtml(ref.uri)}</span>${articlesText}</li>`;
                 });
            }
        };

        displayRefs(formData.manualRelevantArticles, 'Relevant Articles');
        displayRefs(formData.manualOtherReferences, 'Other References');

        reviewHtml += `</ul></div>`;
    }
    // **** END MODIFICATION ****

    reviewArea.innerHTML = reviewHtml;
}

/**
 * Simple HTML escaping function to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  // Ensure input is a string before replacing
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/**
 * Performs final validation and updates the UI accordingly.
 * Enables the generate button only if validation passes.
 */
function verifyMetadata() {
    const verificationStatusDiv = document.getElementById('verification-status');
    const generateButton = document.getElementById('generate-button');
    const { isValid, message } = runFinalValidation(); // Run silent validation

    verificationStatusDiv.textContent = message; // Display the result message
    if (isValid) {
        verificationStatusDiv.className = 'success'; // Style as success
        generateButton.disabled = false; // Enable generate button
    } else {
        verificationStatusDiv.className = 'failure'; // Style as failure
        generateButton.disabled = true; // Ensure generate button is disabled
    }
}


/**
 * Generates the final JSON metadata file and triggers its download.
 * Assumes verification has already passed.
 */
function generateJson() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = ''; // Clear previous errors
    errorMessageDiv.style.display = 'none'; // Hide error div


    // Verification should have happened already, but double-check button state
    if (document.getElementById('generate-button').disabled) {
        errorMessageDiv.textContent = 'Please verify the metadata successfully before generating.';
         errorMessageDiv.style.display = 'block'; // Show error div
        return;
    }

    try {
        const metadataObject = buildMetadata();
        const jsonString = JSON.stringify(metadataObject, null, 2); // Pretty print JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'cip136_metadata.json';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(link.href); // Release object URL
    } catch (error) {
        console.error("Error generating JSON:", error);
        errorMessageDiv.textContent = `Error generating JSON: ${error.message}`;
         errorMessageDiv.style.display = 'block'; // Show error div
    }
}
