// Global variable to track the current step
let currentStep = 1;
// Object to store input data collected from all steps
const formData = {};
// Total number of steps in the form
const totalSteps = 6; // Remains 6 steps (incl. review)
// Object to track the validation status of each step
const stepValidity = {};

// --- DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    showStep(1); // Show the first step on load

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
});


// --- Step Navigation and Validation Functions ---

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

        // If showing Step 6, reset verification state
        if (stepNumber === totalSteps) {
            populateReviewArea();
            document.getElementById('generate-button').disabled = true; // Disable generate button
            const verificationStatusDiv = document.getElementById('verification-status');
            verificationStatusDiv.textContent = ''; // Clear verification message
            verificationStatusDiv.className = ''; // Clear status styling
            document.getElementById('error-message').textContent = ''; // Clear generation errors
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
    let isValid = true;
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
        stepValidity[stepNumber] = false;
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
    // Add more specific validation rules here if needed

    stepValidity[stepNumber] = isValid; // Store final result
    return isValid;
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
            const firstInvalidInput = stepElement.querySelector('input:invalid, textarea:invalid, input[type="number"]:invalid'); // Basic check, might need refinement
            const fieldName = firstInvalidInput?.previousElementSibling?.textContent || `Step ${stepNum}`;
            finalMessage = `Verification failed: Please check required fields or constraints in ${fieldName}.`;
            break; // Stop on first failure
        }
    }

    // Also check specific constraints again (e.g., summary length)
    if (overallValid) {
        const summary = document.getElementById('summary').value;
        if (summary.length > 300) {
            overallValid = false;
            finalMessage = 'Verification failed: Summary exceeds 300 characters.';
        }
        // Add checks for negative numbers in step 4 if needed, even though optional
        const numberInputs = document.querySelectorAll('#step-4 input[type="number"]');
         numberInputs.forEach(input => {
             if (overallValid && input.value && parseInt(input.value, 10) < 0) {
                 overallValid = false;
                 finalMessage = `Verification failed: Internal vote count for ${input.previousElementSibling?.textContent || input.id} cannot be negative.`;
             }
         });
    }


    return { isValid: overallValid, message: finalMessage };
}


/**
 * Collects data from all input fields within the specified step number
 * and stores it in the global `formData` object.
 * @param {number} stepNumber - The step number to collect data from.
 */
function collectStepData(stepNumber) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (!stepElement) return;

    const inputs = stepElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value.trim();
    });

     // Special handling for number inputs in Step 4
     if (stepNumber === 4) {
        const numberIds = [
            'internal_constitutional_votes', 'internal_unconstitutional_votes',
            'internal_abstain_votes', 'internal_did_not_vote', 'internal_against_vote'
        ];
        numberIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const value = parseInt(input.value, 10);
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
        collectStepData(currentStep);
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

/**
 * Collects data from the current step and moves to the previous step.
 */
function prevStep() {
    collectStepData(currentStep); // Collect data
    if (currentStep > 1) {
        showStep(currentStep - 1); // Move back
    }
}


// --- Data Parsing Functions ---

function parseAuthors(authorsString) {
    if (!authorsString) return [];
    return authorsString.split(/[\n;]+/)
                      .map(a => a.trim())
                      .filter(a => a)
                      .map(name => ({ name: name }));
}

function parseBodyReferences(referencesString) {
     if (!referencesString) return [];
    return referencesString.split('\n')
                           .map(line => line.trim())
                           .filter(line => line)
                           .map(line => {
                               const parts = line.split('|');
                               const label = parts[0].trim();
                               const uri = parts.length > 1 ? parts[1].trim() : label;
                               return { "@type": "Other", label: label, uri: uri };
                           })
                           .filter(ref => ref.label && ref.uri);
}

// --- Metadata Generation Functions ---

function buildMetadata() {
    collectStepData(totalSteps - 1); // Ensure latest data

    const context = { /* ... context object remains the same ... */
        "@language": "en-us",
        "CIP100": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0100/README.md#",
        "CIP136": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0136/README.md#",
        "hashAlgorithm": "CIP100:hashAlgorithm",
        "body": {
            "@id": "CIP136:body",
            "@context": {
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
    if (formData.precedentDiscussion) body.precedentDiscussion = formData.precedentDiscussion;
    if (formData.counterargumentDiscussion) body.counterargumentDiscussion = formData.counterargumentDiscussion;
    if (formData.conclusion) body.conclusion = formData.conclusion;

    const internalVoteData = {};
    if (formData.internal_constitutional_votes !== null) internalVoteData.constitutional = formData.internal_constitutional_votes;
    if (formData.internal_unconstitutional_votes !== null) internalVoteData.unconstitutional = formData.internal_unconstitutional_votes;
    if (formData.internal_abstain_votes !== null) internalVoteData.abstain = formData.internal_abstain_votes;
    if (formData.internal_did_not_vote !== null) internalVoteData.didNotVote = formData.internal_did_not_vote;
    if (Object.keys(internalVoteData).length > 0) body.internalVote = internalVoteData;

    const relevantArticlesRefs = parseBodyReferences(formData.relevantArticles || "");
    const otherReferencesRefs = parseBodyReferences(formData.otherReferences || "");
    const allReferences = [...relevantArticlesRefs, ...otherReferencesRefs];
    if (allReferences.length > 0) body.references = allReferences;

    // if (metadata.authors.length === 0) metadata.authors = []; // Keep empty authors array

    return metadata;
}

/**
 * Populates the review area (Step 6) with the data collected in `formData`.
 */
function populateReviewArea() {
    const reviewArea = document.getElementById('review-area');
    if (!reviewArea) return;
    collectStepData(currentStep - 1); // Use currentStep - 1 if called from showStep(6)

    let reviewHtml = '';
    // Basic Info
    if (formData.subject || formData.authors || formData.hashAlgorithm) {
        reviewHtml += `<div class="review-section"><h3>Basic Information</h3>`;
        if (formData.hashAlgorithm) reviewHtml += `<p><span class="review-label">Hash Algorithm:</span> <span class="review-value">${escapeHtml(formData.hashAlgorithm)}</span></p>`;
        if (formData.subject) reviewHtml += `<p><span class="review-label">Subject:</span> <span class="review-value">${escapeHtml(formData.subject)}</span></p>`;
        if (formData.authors) reviewHtml += `<p><span class="review-label">Authors:</span> <span class="review-value">${escapeHtml(formData.authors)}</span></p>`;
        reviewHtml += `</div>`;
    }
    // Core Rationale
    if (formData.summary || formData.rationaleStatement) {
        reviewHtml += `<div class="review-section"><h3>Core Rationale</h3>`;
        if (formData.summary) reviewHtml += `<p><span class="review-label">Summary:</span></p><pre class="review-value review-block">${escapeHtml(formData.summary)}</pre>`;
        if (formData.rationaleStatement) reviewHtml += `<p><span class="review-label">Rationale Statement:</span></p><pre class="review-value review-block">${escapeHtml(formData.rationaleStatement)}</pre>`;
        reviewHtml += `</div>`;
    }
    // Supporting Discussion
    let optionalDiscussionHtml = '';
    if (formData.precedentDiscussion) optionalDiscussionHtml += `<p><span class="review-label">Precedent Discussion:</span></p><pre class="review-value review-block">${escapeHtml(formData.precedentDiscussion)}</pre>`;
    if (formData.counterargumentDiscussion) optionalDiscussionHtml += `<p><span class="review-label">Counterargument Discussion:</span></p><pre class="review-value review-block">${escapeHtml(formData.counterargumentDiscussion)}</pre>`;
    if (formData.conclusion) optionalDiscussionHtml += `<p><span class="review-label">Conclusion:</span></p><pre class="review-value review-block">${escapeHtml(formData.conclusion)}</pre>`;
    if (optionalDiscussionHtml) reviewHtml += `<div class="review-section"><h3>Supporting Discussion</h3>${optionalDiscussionHtml}</div>`;
    // Internal Voting
    const internalVotesProvided = [formData.internal_constitutional_votes, formData.internal_unconstitutional_votes, formData.internal_abstain_votes, formData.internal_did_not_vote].some(v => v !== null && v !== undefined && v !== '');
    if (internalVotesProvided) {
        reviewHtml += `<div class="review-section"><h3>Internal Votes</h3><ul class="review-list">`;
        if (formData.internal_constitutional_votes !== null) reviewHtml += `<li><span class="review-label">Constitutional:</span> ${formData.internal_constitutional_votes}</li>`;
        if (formData.internal_unconstitutional_votes !== null) reviewHtml += `<li><span class="review-label">Unconstitutional:</span> ${formData.internal_unconstitutional_votes}</li>`;
        if (formData.internal_abstain_votes !== null) reviewHtml += `<li><span class="review-label">Abstain:</span> ${formData.internal_abstain_votes}</li>`;
        if (formData.internal_did_not_vote !== null) reviewHtml += `<li><span class="review-label">Did Not Vote:</span> ${formData.internal_did_not_vote}</li>`;
        reviewHtml += `</ul></div>`;
    }
    // References
    const relevantArticlesList = parseBodyReferences(formData.relevantArticles || "");
    const otherReferencesList = parseBodyReferences(formData.otherReferences || "");
    const allReferences = [...relevantArticlesList, ...otherReferencesList];
    if (allReferences.length > 0) {
        reviewHtml += `<div class="review-section"><h3>References</h3><ul class="review-list review-references">`;
        allReferences.forEach(ref => {
             reviewHtml += `<li><span class="review-label">${escapeHtml(ref.label)}:</span> <span class="ref-uri">${escapeHtml(ref.uri)}</span></li>`;
        });
        reviewHtml += `</ul></div>`;
    }
    reviewArea.innerHTML = reviewHtml;
}

/**
 * Simple HTML escaping function to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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

    // Verification should have happened already, but double-check button state
    if (document.getElementById('generate-button').disabled) {
        errorMessageDiv.textContent = 'Please verify the metadata successfully before generating.';
        return;
    }

    try {
        const metadataObject = buildMetadata();
        const jsonString = JSON.stringify(metadataObject, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = 'cip136_metadata.json';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error generating JSON:", error);
        errorMessageDiv.textContent = `Error generating JSON: ${error.message}`;
    }
}
