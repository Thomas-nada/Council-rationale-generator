// Global variable to track the current step
let currentStep = 1;
// Object to store input data collected from all steps
const formData = {};
// Total number of steps in the form
const totalSteps = 6; // Remains 6 steps (incl. review)

// --- DOMContentLoaded Listener ---
// Ensures the script runs after the HTML is fully loaded.
// Initializes the first step and sets up the summary character counter.
document.addEventListener('DOMContentLoaded', () => {
    // Display the first step when the page loads
    showStep(1);

    // --- Summary Character Counter Setup ---
    const summaryTextarea = document.getElementById('summary');
    const summaryCharCount = document.getElementById('summary-char-count');

    if (summaryTextarea && summaryCharCount) {
        // Initial count update on load
        summaryCharCount.textContent = summaryTextarea.value.length;

        // Update count on every input event in the summary textarea
        summaryTextarea.addEventListener('input', () => {
            const count = summaryTextarea.value.length;
            summaryCharCount.textContent = count;
            // Change color to red if character limit is exceeded
            if (count > 300) {
                summaryCharCount.style.color = 'red';
            } else {
                summaryCharCount.style.color = 'inherit'; // Reset color if within limit
            }
        });
    }
});


// --- Step Navigation Functions ---

/**
 * Hides all form steps and displays the specified step number.
 * If the target step is the final review step, it populates the review area.
 * @param {number} stepNumber - The step number to display.
 */
function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    const stepToShow = document.getElementById(`step-${stepNumber}`);
    if (stepToShow) {
        stepToShow.style.display = 'block';
        if (stepNumber === totalSteps) {
            populateReviewArea();
        }
    }
    currentStep = stepNumber;
}

/**
 * Validates the input fields within the specified step number.
 * Checks for required fields and specific constraints.
 * @param {number} stepNumber - The step number to validate.
 * @returns {boolean} - True if the step is valid, false otherwise.
 */
function validateStep(stepNumber) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (!stepElement) return false;

    const requiredInputs = stepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            // Added check for hashAlgorithm specifically
            const fieldName = input.id === 'hashAlgorithm' ? 'Hash Algorithm' : (input.previousElementSibling?.textContent || input.id);
             alert(`Please fill in the required field: ${fieldName}`);
            input.focus();
            isValid = false;
        }
    });

    if (!isValid) return false;

    // Specific Step Validations
    if (stepNumber === 2) { // Summary length
        const summary = document.getElementById('summary').value;
        if (summary.length > 300) {
             alert('Summary must not exceed 300 characters.');
             document.getElementById('summary').focus();
             isValid = false;
        }
    } else if (stepNumber === 4) { // Internal votes non-negative
         const numberInputs = stepElement.querySelectorAll('input[type="number"]');
         numberInputs.forEach(input => {
             if (input.value && parseInt(input.value, 10) < 0) {
                 alert(`Internal vote count for ${input.previousElementSibling?.textContent || input.id} cannot be negative.`);
                 input.focus();
                 isValid = false;
             }
         });
    }

    return isValid;
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
            'internal_abstain_votes', 'internal_did_not_vote', 'internal_against_vote' // Note: 'againstVote' is not in the reference context, but keeping input for now
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
 * Validates the current step, collects its data, and moves to the next step if valid.
 */
function nextStep() {
    if (validateStep(currentStep)) {
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
    collectStepData(currentStep); // Collect data even when going back
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}


// --- Data Parsing Functions ---

/**
 * Parses the authors string into an array of simple author objects { name: "..." }.
 * @param {string} authorsString - Raw string from the authors textarea.
 * @returns {object[]} - Array of author objects.
 */
function parseAuthors(authorsString) {
    if (!authorsString) return [];
    // Split by newline or semicolon, trim, filter empty, map to objects
    return authorsString.split(/[\n;]+/)
                      .map(a => a.trim())
                      .filter(a => a)
                      .map(name => ({ name: name })); // Create object structure
}

/**
 * Parses reference strings (Label | URI format) into an array of reference objects
 * suitable for placement within body.references, using @type "Other".
 * @param {string} referencesString - Raw string from a references textarea.
 * @returns {object[]} - Array of reference objects { @type, label, uri }.
 */
function parseBodyReferences(referencesString) {
     if (!referencesString) return [];
    return referencesString.split('\n')
                           .map(line => line.trim())
                           .filter(line => line)
                           .map(line => {
                               const parts = line.split('|');
                               const label = parts[0].trim();
                               // Use part after pipe as URI, default to label if no pipe
                               const uri = parts.length > 1 ? parts[1].trim() : label;
                               // Use "@type": "Other" as seen in the reference example
                               return { "@type": "Other", label: label, uri: uri };
                           })
                           .filter(ref => ref.label && ref.uri); // Ensure both label and uri exist
}

// --- Metadata Generation Functions ---

/**
 * Constructs the final metadata object strictly following the user-provided reference structure,
 * placing references after internalVote within the body.
 * @returns {object} - The complete metadata object.
 */
function buildMetadata() {
    // Ensure data from the last input step (before review) is collected
    collectStepData(totalSteps - 1);

    // --- Define the complex @context from the reference ---
    const context = {
        "@language": "en-us",
        "CIP100": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0100/README.md#",
        "CIP136": "https://github.com/cardano-foundation/CIPs/blob/master/CIP-0136/README.md#",
        "hashAlgorithm": "CIP100:hashAlgorithm",
        "body": {
            "@id": "CIP136:body",
            "@context": {
                "references": { // Context for references array
                    "@id": "CIP100:references",
                    "@container": "@set",
                    "@context": {
                        "GovernanceMetadata": "CIP100:GovernanceMetadataReference",
                        "Other": "CIP100:OtherReference",
                        "label": "CIP100:reference-label",
                        "uri": "CIP100:reference-uri",
                        "RelevantArticles": "CIP136:RelevantArticles"
                    }
                },
                "summary": "CIP136:summary",
                "rationaleStatement": "CIP136:rationaleStatement",
                "precedentDiscussion": "CIP136:precedentDiscussion",
                "counterargumentDiscussion": "CIP136:counterargumentDiscussion",
                "conclusion": "CIP136:conclusion",
                "internalVote": { // Context for internalVote object
                    "@id": "CIP136:internalVote",
                    "@context": {
                        "constitutional": "CIP136:constitutional",
                        "unconstitutional": "CIP136:unconstitutional",
                        "abstain": "CIP136:abstain",
                        "didNotVote": "CIP136:didNotVote"
                    }
                }
            }
        },
        "authors": {
            "@id": "CIP100:authors",
            "@container": "@set",
            "@context": {
                "did": "@id",
                "name": "http://xmlns.com/foaf/0.1/name",
                "witness": {
                    "@id": "CIP100:witness",
                    "@context": {
                        "witnessAlgorithm": "CIP100:witnessAlgorithm",
                        "publicKey": "CIP100:publicKey",
                        "signature": "CIP100:signature"
                    }
                }
            }
        }
    };

    // --- Assemble the main metadata object ---
    const metadata = {
        "@context": context,
        "hashAlgorithm": formData.hashAlgorithm || "blake2b-256",
        "body": {
            // Add compulsory fields first
            "summary": formData.summary || "",
            "rationaleStatement": formData.rationaleStatement || "",
            // Initialize references array *later*
        },
        "authors": parseAuthors(formData.authors || "")
    };

    // --- Populate Optional Body Fields (before internalVote and references) ---
    const body = metadata.body; // Reference for convenience
    if (formData.precedentDiscussion) body.precedentDiscussion = formData.precedentDiscussion;
    if (formData.counterargumentDiscussion) body.counterargumentDiscussion = formData.counterargumentDiscussion;
    if (formData.conclusion) body.conclusion = formData.conclusion;

    // --- Assemble and add internalVote object (if applicable) ---
    const internalVoteData = {};
    if (formData.internal_constitutional_votes !== null) internalVoteData.constitutional = formData.internal_constitutional_votes;
    if (formData.internal_unconstitutional_votes !== null) internalVoteData.unconstitutional = formData.internal_unconstitutional_votes;
    if (formData.internal_abstain_votes !== null) internalVoteData.abstain = formData.internal_abstain_votes;
    if (formData.internal_did_not_vote !== null) internalVoteData.didNotVote = formData.internal_did_not_vote;

    if (Object.keys(internalVoteData).length > 0) {
        body.internalVote = internalVoteData; // Add the object if not empty
    }

    // --- Assemble and add References *after* internalVote ---
    const relevantArticlesRefs = parseBodyReferences(formData.relevantArticles || "");
    const otherReferencesRefs = parseBodyReferences(formData.otherReferences || "");
    const allReferences = [...relevantArticlesRefs, ...otherReferencesRefs];

    // Add the references array to the body only if it contains items
    if (allReferences.length > 0) {
        body.references = allReferences;
    }

    // --- Clean up empty top-level arrays ---
    if (metadata.authors.length === 0) {
        // Keep authors array even if empty, as per reference example
        // delete metadata.authors; // Or keep it empty: metadata.authors = [];
    }

    return metadata; // Return the fully constructed metadata object
}

/**
 * Populates the review area (Step 6) with the data collected in `formData`.
 * Generates HTML content WITH explicit labels, organized into sections.
 */
function populateReviewArea() {
    const reviewArea = document.getElementById('review-area');
    if (!reviewArea) return;

    // Ensure data from the step before review is collected
    collectStepData(currentStep - 1);

    let reviewHtml = '';

    // --- Basic Info Section ---
    if (formData.subject || formData.authors || formData.hashAlgorithm) {
        reviewHtml += `<div class="review-section">`;
        reviewHtml += `  <h3>Basic Information</h3>`;
         if (formData.hashAlgorithm) {
            reviewHtml += `  <p><span class="review-label">Hash Algorithm:</span> <span class="review-value">${escapeHtml(formData.hashAlgorithm)}</span></p>`;
        }
        if (formData.subject) {
            reviewHtml += `  <p><span class="review-label">Subject:</span> <span class="review-value">${escapeHtml(formData.subject)}</span></p>`;
        }
        if (formData.authors) {
            reviewHtml += `  <p><span class="review-label">Authors:</span> <span class="review-value">${escapeHtml(formData.authors)}</span></p>`;
        }
        reviewHtml += `</div>`;
    }

    // --- Core Rationale Section ---
    if (formData.summary || formData.rationaleStatement) {
        reviewHtml += `<div class="review-section">`;
        reviewHtml += `  <h3>Core Rationale</h3>`;
        if (formData.summary) {
            reviewHtml += `  <p><span class="review-label">Summary:</span></p>`;
            reviewHtml += `  <pre class="review-value review-block">${escapeHtml(formData.summary)}</pre>`;
        }
         if (formData.rationaleStatement) {
            reviewHtml += `  <p><span class="review-label">Rationale Statement:</span></p>`;
            reviewHtml += `  <pre class="review-value review-block">${escapeHtml(formData.rationaleStatement)}</pre>`;
        }
        reviewHtml += `</div>`;
    }

    // --- Optional Discussions Section ---
    let optionalDiscussionHtml = '';
    if (formData.precedentDiscussion) {
        optionalDiscussionHtml += `<p><span class="review-label">Precedent Discussion:</span></p>`;
        optionalDiscussionHtml += `<pre class="review-value review-block">${escapeHtml(formData.precedentDiscussion)}</pre>`;
    }
    if (formData.counterargumentDiscussion) {
        optionalDiscussionHtml += `<p><span class="review-label">Counterargument Discussion:</span></p>`;
        optionalDiscussionHtml += `<pre class="review-value review-block">${escapeHtml(formData.counterargumentDiscussion)}</pre>`;
    }
    if (formData.conclusion) {
        optionalDiscussionHtml += `<p><span class="review-label">Conclusion:</span></p>`;
        optionalDiscussionHtml += `<pre class="review-value review-block">${escapeHtml(formData.conclusion)}</pre>`;
    }

    if (optionalDiscussionHtml) {
        reviewHtml += `<div class="review-section">`;
        reviewHtml += `  <h3>Supporting Discussion</h3>`;
        reviewHtml += optionalDiscussionHtml;
        reviewHtml += `</div>`;
    }

    // --- Internal Voting Section ---
    const internalVotesProvided = [
        formData.internal_constitutional_votes, formData.internal_unconstitutional_votes,
        formData.internal_abstain_votes, formData.internal_did_not_vote
    ].some(v => v !== null && v !== undefined && v !== '');

    if (internalVotesProvided) {
        reviewHtml += `<div class="review-section">`;
        reviewHtml += `  <h3>Internal Votes</h3>`;
        reviewHtml += `  <ul class="review-list">`;
        if (formData.internal_constitutional_votes !== null) reviewHtml += `<li><span class="review-label">Constitutional:</span> ${formData.internal_constitutional_votes}</li>`;
        if (formData.internal_unconstitutional_votes !== null) reviewHtml += `<li><span class="review-label">Unconstitutional:</span> ${formData.internal_unconstitutional_votes}</li>`;
        if (formData.internal_abstain_votes !== null) reviewHtml += `<li><span class="review-label">Abstain:</span> ${formData.internal_abstain_votes}</li>`;
        if (formData.internal_did_not_vote !== null) reviewHtml += `<li><span class="review-label">Did Not Vote:</span> ${formData.internal_did_not_vote}</li>`;
        reviewHtml += `  </ul>`;
        reviewHtml += `</div>`;
    }

    // --- References Section ---
    const relevantArticlesList = parseBodyReferences(formData.relevantArticles || "");
    const otherReferencesList = parseBodyReferences(formData.otherReferences || "");
    const allReferences = [...relevantArticlesList, ...otherReferencesList];


    if (allReferences.length > 0) {
        reviewHtml += `<div class="review-section">`;
        reviewHtml += `  <h3>References</h3>`;
        reviewHtml += `  <ul class="review-list review-references">`;
        allReferences.forEach(ref => {
             reviewHtml += `<li><span class="review-label">${escapeHtml(ref.label)}:</span> <span class="ref-uri">${escapeHtml(ref.uri)}</span></li>`;
        });
        reviewHtml += `  </ul>`;
        reviewHtml += `</div>`;
    }

    // --- Update the DOM ---
    reviewArea.innerHTML = reviewHtml;
}

/**
 * Simple HTML escaping function to prevent XSS.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}


/**
 * Generates the final JSON metadata file and triggers its download.
 */
function generateJson() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';

    // --- Final Validation ---
    if (!formData.hashAlgorithm || !formData.authors || !formData.summary || !formData.rationaleStatement) {
         errorMessageDiv.textContent = 'Error: Please ensure Hash Algorithm, Authors, Summary, and Rationale Statement are filled in before generating.';
         if (!formData.hashAlgorithm || !formData.authors) showStep(1);
         else if (!formData.summary || !formData.rationaleStatement) showStep(2);
         return;
    }

    try {
        const metadataObject = buildMetadata();
        const jsonString = JSON.stringify(metadataObject, null, 2); // Pretty print

        // --- File Download Logic ---
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
