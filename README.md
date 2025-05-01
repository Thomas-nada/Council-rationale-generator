# Intersect CC Rationale Metadata Generator

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A web-based tool for Intersect's Constitutional Council members to generate CIP-136 compliant JSON metadata for vote rationales via a simple step-by-step process, adhering to the structure used in early examples.

## Motivation

Cardano's governance framework (CIP-1694) introduces on-chain mechanisms, including Constitutional Committee (CC) votes. To ensure transparency and legitimacy, CIP-136 proposes a standard structure for CC members to provide detailed rationales for their votes, extending the base CIP-100 governance metadata standard.

Manually creating this structured JSON metadata, especially with the specific nested context seen in examples, can be tedious and error-prone. This tool aims to:

* **Simplify:** Provide an intuitive step-by-step interface for inputting rationale components.
* **Ensure Compliance:** Guide users to include all necessary fields according to CIP-136 and the reference JSON structure.
* **Improve Consistency:** Help Intersect's CC members produce standardized rationale metadata.
* **Streamline Workflow:** Generate the final JSON file ready for use after verification.

## Features

* **Step-by-Step Guidance:** Breaks down the metadata creation process into logical steps.
* **Reference Structure Adherence:** Generates JSON matching the specific nested `@context` and field placement (e.g., `references` inside `body`) seen in provided examples.
* **CIP-136 Compliant Fields:** Covers all compulsory (`summary`, `rationaleStatement`) and optional (`precedentDiscussion`, `counterargumentDiscussion`, `conclusion`, `internalVote`) body fields defined in CIP-136.
* **CIP-100 Base Fields:** Includes essential fields like `hashAlgorithm` and `authors`.
* **Live Step Validation:** Performs basic checks (e.g., required fields, summary length) directly in the browser as you navigate between steps. A checkmark (✓) appears next to the step title upon successful validation.
* **Final Verification Step:** Requires clicking a "Verify Metadata" button in the final step to perform checks on all required data before enabling the download button.
* **Direct JSON Download:** Generates and downloads the complete metadata as a `cip136_metadata.json` file once verified.
* **No Server Needed:** Runs entirely in the user's web browser as a static webpage.

## How Verification Works

This tool employs two levels of client-side validation:

1.  **Live Step Validation:**
    * **Trigger:** When you click the "Next" button on a step.
    * **Checks:** Verifies that all `required` fields within that *specific step* are filled. It also checks basic constraints like the summary's character limit (Step 2) or non-negative numbers for votes (Step 4).
    * **Feedback:** If validation passes, a checkmark (✓) appears next to the step title. If it fails, an alert message pops up indicating the first issue found, and navigation is blocked. This provides immediate feedback as you progress.

2.  **Final Verification (Step 6):**
    * **Trigger:** When you click the "Verify Metadata" button in Step 6.
    * **Checks:** This performs a more comprehensive check across *all* steps that contain fields mandatory for the final JSON output (specifically Steps 1 and 2 for `hashAlgorithm`, `authors`, `summary`, `rationaleStatement`). It also re-checks critical constraints like summary length and non-negative votes. This check runs *without* generating individual alert popups.
    * **Feedback:** A status message is displayed below the review area indicating overall success ("Verification successful...") or the first detected failure ("Verification failed: Please check..."). The "Generate JSON File" button is only enabled if this final verification passes. This ensures all core requirements are met before attempting to generate the file.

*Note: Both validation levels run entirely within your browser and do not guarantee perfect compliance with every nuance of the CIPs, but they significantly reduce the chance of errors related to missing required fields or violating basic constraints.*

## How to Use

There are two ways to use this tool:

**1. Using a Hosted Version (If Deployed)**

* (If you deploy this using GitHub Pages or similar)
    Access the tool directly via your hosted link: `[Link to your hosted tool]`

**2. Running Locally**

* **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/intersect-council-rationale-generator.git](https://github.com/your-username/intersect-council-rationale-generator.git)
    cd intersect-council-rationale-generator
    ```
* **Open the tool:**
    Simply open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge).

**Using the Tool Interface:**

1.  **Step 1: Basic Information**
    * Enter the `Hash Algorithm` (defaults to `blake2b-256`).
    * Enter the `Author(s)` details (one name per line or separated by semicolons).
    * Optionally enter a `Subject` for your own reference (not included in the final JSON).
    * Click "Next". A checkmark (✓) will appear by the Step 1 title if required fields are filled.
2.  **Step 2: Core Rationale (Compulsory)**
    * Provide a concise `Summary` (max 300 characters).
    * Write the full `Rationale Statement`.
    * Click "Next". A checkmark will appear if required fields are filled and the summary length is valid.
3.  **Step 3: Supporting Discussion (Optional)**
    * Optionally, add discussions on `Precedent`, `Counterarguments`, and a `Conclusion`.
    * Click "Next". A checkmark will appear (as this step has no required fields, it's always considered 'valid' for navigation).
4.  **Step 4: Internal Voting (Optional)**
    * If relevant, enter the non-negative integer counts for internal votes.
    * Click "Next". A checkmark will appear if any entered numbers are non-negative.
5.  **Step 5: References**
    * List relevant Constitution articles and other references using the format **`Label | URI`** (one per line).
    * Click "Next". A checkmark will appear (this step is also considered 'valid' for navigation, though references might be desired).
6.  **Step 6: Review and Generate**
    * Carefully review all the information displayed.
    * Use the "Previous" button to go back and make corrections if needed. Checkmarks on previous steps will update if changes affect their validity.
    * Click the **"Verify Metadata"** button.
    * A status message will appear indicating success or failure. Failures will point towards the likely step needing correction.
    * If verification is successful, the **"Generate JSON File"** button will become enabled.
    * Click "Generate JSON File" to download the complete metadata as `cip136_metadata.json`.

## Technology Stack

* HTML
* CSS
* JavaScript (Vanilla)

## Based On

This tool implements the metadata structure defined in:

* **CIP-136:** Governance metadata - Constitutional Committee votes
* **CIP-100:** Governance Metadata

*(You might want to add direct links to the CIPs here if available, e.g., from the Cardano Foundation's CIP repository)*

## Contributing

Contributions are welcome! Please feel free to:

* Report bugs or suggest features by opening an issue.
* Submit improvements by creating a pull request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
