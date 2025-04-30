let currentStep = 1;
const formData = {}; // Object to store input data across steps
const totalSteps = 6;

// Add character counter for summary
const summaryTextarea = document.getElementById('summary');
const summaryCharCount = document.getElementById('summary-char-count');
if (summaryTextarea) {
    summaryTextarea.addEventListener('input', () => {
        const count = summaryTextarea.value.length;
        summaryCharCount.textContent = count;
        if (count > 300) {
            summaryCharCount.style.color = 'red';
        } else {
            summaryCharCount.style.color = 'inherit';
        }
    });
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => step.style.display = 'none');
    // Show the current step
    const stepToShow = document.getElementById(`step-${stepNumber}`);
    if (stepToShow) {
        stepToShow.style.display = 'block';

        // If it's the review step, populate the review area
        if (stepNumber === totalSteps) {
            populateReviewArea();
        }
    }
    currentStep = stepNumber;
}

function validateStep(stepNumber) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    const inputs = stepElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            alert(`Please fill in the required field: ${input.previousElementSibling?.textContent || input.id}`);
            input.focus();
            isValid = false;
        }
    });

    // Specific validation for summary length
    if (stepNumber === 2) {
        const summary = document.getElementById('summary').value;
        if (summary.length > 300) {
             alert('Summary must not exceed 300 characters.');
             document.getElementById('summary').focus();
             isValid = false;
        }
    }

    // Specific validation for number inputs (ensure they are non-negative)
    if (stepNumber === 4) {
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

function collectStepData(stepNumber) {
    const stepElement = document.getElementById(`step-${stepNumber}`);
    const inputs = stepElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value.trim(); // Store trimmed value
    });
     // Special handling for number inputs to store as numbers if valid, else null
     if (stepNumber === 4) {
        const numberIds = [
            'internal_constitutional_votes', 'internal_unconstitutional_votes',
            'internal_abstain_votes', 'internal_did_not_vote', 'internal_against_vote'
        ];
        numberIds.forEach(id => {
            const input = document.getElementById(id);
            const value = parseInt(input.value, 10);
            formData[id] = (!isNaN(value) && value >= 0) ? value : null; // Store valid non-negative int or null
        });
    }
}

function nextStep() {
    if (validateStep(currentStep)) {
        collectStepData(currentStep);
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
}

function prevStep() {
    // No need to validate when going back, but still collect data in case changes were made
    collectStepData(currentStep);
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function parseAuthors(authorsString) {
    // Simple parsing: split by newline or semicolon, trim whitespace
    // Returns array of strings. Could be enhanced to parse structured {name, contact}.
    return authorsString.split(/[\n;]+/)
                      .map(a => a.trim())
                      .filter(a => a); // Remove empty entries
}

function parseReferences(referencesString) {
    // Simple parsing: split by newline
    // Returns array of objects { uri: "...", description: "..." }
    return referencesString.split('\n')
                           .map(line => line.trim())
                           .filter(line => line) // Remove empty lines
                           .map(line => {
                               const parts = line.split('|');
                               const uri = parts[0].trim();
                               const description = parts.length > 1 ? parts[1].trim() : undefined;
                               return { "@type": "Reference", uri, description };
                           })
                           .filter(ref => ref.uri); // Ensure there's a URI
}

function parseRelevantArticles(articlesString) {
     // Simple parsing: split by newline, trim whitespace
    return articlesString.split('\n')
                       .map(a => a.trim())
                       .filter(a => a); // Remove empty entries
}


function buildMetadata() {
    // Collect data from the final step just in case
    collectStepData(currentStep);

    // --- Assemble CIP-100 Base ---
    const metadata = {
        "@context": [
            "https://cardano.org/governance/metadata/cip-100/contexts/governance-metadata",
            // Add CIP-136 context URL here if/when available
        ],
        "cip100_version": "1.0", // Or update as needed
        "subject": formData.subject || "N/A",
        // Process authors: For simplicity, just joining parsed array back.
        // Could be [{name: "...", contact: "..."}] with more complex parsing.
        "authors": parseAuthors(formData.authors || ""),
        "body": {},
        "references": [] // Initialize empty
    };

    // --- Add Other References (CIP-100) ---
    if (formData.otherReferences) {
         metadata.references.push(...parseReferences(formData.otherReferences));
    }

    // --- Assemble CIP-136 Body Extensions ---
    const body = metadata.body; // Reference for easier access
    body.summary = formData.summary || ""; // Compulsory
    body.rationaleStatement = formData.rationaleStatement || ""; // Compulsory

    if (formData.precedentDiscussion) body.precedentDiscussion = formData.precedentDiscussion;
    if (formData.counterargumentDiscussion) body.counterargumentDiscussion = formData.counterargumentDiscussion;
    if (formData.conclusion) body.conclusion = formData.conclusion;

    // Assemble internalVote object
    const internalVoteData = {};
    if (formData.internal_constitutional_votes !== null) internalVoteData.constitutional = formData.internal_constitutional_votes;
    if (formData.internal_unconstitutional_votes !== null) internalVoteData.unconstitutional = formData.internal_unconstitutional_votes;
    if (formData.internal_abstain_votes !== null) internalVoteData.abstain = formData.internal_abstain_votes;
    if (formData.internal_did_not_vote !== null) internalVoteData.didNotVote = formData.internal_did_not_vote;
    if (formData.internal_against_vote !== null) internalVoteData.againstVote = formData.internal_against_vote;

    if (Object.keys(internalVoteData).length > 0) {
        body.internalVote = internalVoteData;
    }

    // --- Assemble CIP-136 References Extension ---
    const relevantArticlesList = parseRelevantArticles(formData.relevantArticles || "");
    if (relevantArticlesList.length > 0) {
        metadata.references.push({
            "@type": "RelevantArticles",
            "uris": relevantArticlesList
            // "description": "Relevant articles from the Cardano Interim Constitution" // Optional description
        });
    }

     // Add publication timestamp
     metadata.publishedAt = new Date().toISOString();


    return metadata;
}

function populateReviewArea() {
    const reviewArea = document.getElementById('review-area');
    collectStepData(currentStep -1); // Collect data from the last input step before review
    let reviewContent = '';

    reviewContent += `<strong>Subject:</strong> ${formData.subject || 'Not provided'}\n`;
    reviewContent += `<strong>Authors:</strong> ${formData.authors || 'Not provided'}\n\n`;

    reviewContent += `<strong>Summary:</strong>\n${formData.summary || 'Not provided'}\n\n`;
    reviewContent += `<strong>Rationale Statement:</strong>\n${formData.rationaleStatement || 'Not provided'}\n\n`;

    if (formData.precedentDiscussion) reviewContent += `<strong>Precedent Discussion:</strong>\n${formData.precedentDiscussion}\n\n`;
    if (formData.counterargumentDiscussion) reviewContent += `<strong>Counterargument Discussion:</strong>\n${formData.counterargumentDiscussion}\n\n`;
    if (formData.conclusion) reviewContent += `<strong>Conclusion:</strong>\n${formData.conclusion}\n\n`;

    const internalVotesProvided = [
        formData.internal_constitutional_votes, formData.internal_unconstitutional_votes,
        formData.internal_abstain_votes, formData.internal_did_not_vote, formData.internal_against_vote
    ].some(v => v !== null && v !== ''); // Check if any vote count is entered

    if (internalVotesProvided) {
         reviewContent += `<strong>Internal Votes:</strong>\n`;
         if (formData.internal_constitutional_votes !== null) reviewContent += `  Constitutional: ${formData.internal_constitutional_votes}\n`;
         if (formData.internal_unconstitutional_votes !== null) reviewContent += `  Unconstitutional: ${formData.internal_unconstitutional_votes}\n`;
         if (formData.internal_abstain_votes !== null) reviewContent += `  Abstain: ${formData.internal_abstain_votes}\n`;
         if (formData.internal_did_not_vote !== null) reviewContent += `  Did Not Vote: ${formData.internal_did_not_vote}\n`;
         if (formData.internal_against_vote !== null) reviewContent += `  Against Voting: ${formData.internal_against_vote}\n`;
         reviewContent += '\n';
    }

    const relevantArticlesList = parseRelevantArticles(formData.relevantArticles || "");
    if (relevantArticlesList.length > 0) {
        reviewContent += `<strong>Relevant Articles:</strong>\n  ${relevantArticlesList.join('\n  ')}\n\n`;
    }

     const otherReferencesList = parseReferences(formData.otherReferences || "");
    if (otherReferencesList.length > 0) {
        reviewContent += `<strong>Other References:</strong>\n`;
        otherReferencesList.forEach(ref => {
             reviewContent += `  URI: ${ref.uri}${ref.description ? ` | Description: ${ref.description}` : ''}\n`
        });
        reviewContent += '\n';
    }

    reviewArea.textContent = reviewContent.trim(); // Use textContent to prevent HTML injection from input
}


function generateJson() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = ''; // Clear previous errors

    // Final validation check on crucial fields before generating
    if (!formData.subject || !formData.authors || !formData.summary || !formData.rationaleStatement) {
         errorMessageDiv.textContent = 'Error: Please ensure Subject, Authors, Summary, and Rationale Statement are filled in before generating.';
         // Optionally, navigate back to the first step with missing required fields
         if (!formData.subject || !formData.authors) showStep(1);
         else if (!formData.summary || !formData.rationaleStatement) showStep(2);
         return;
    }

    try {
        const metadataObject = buildMetadata();
        const jsonString = JSON.stringify(metadataObject, null, 2); // Pretty print JSON

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element
        const link = document.createElement('a');

        // Set the download attribute with a filename
        link.download = 'cip136_metadata.json';

        // Create a URL for the Blob and set it as the href attribute
        link.href = URL.createObjectURL(blob);

        // Append the link to the body (required for Firefox)
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);

        // Optional: Revoke the Blob URL to free up resources
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Error generating JSON:", error);
        errorMessageDiv.textContent = `Error generating JSON: ${error.message}`;
    }
}

// Initialize the first step
document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
});