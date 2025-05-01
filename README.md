# Intersect CC Rationale Metadata Generator

A web-based tool for Intersect's Constitutional Committee members to generate CIP-136 compliant JSON metadata for vote rationales via a simple step-by-step process, adhering to the structure used in early examples.

## Motivation

Cardano's governance framework (CIP-1694) introduces on-chain mechanisms, including Constitutional Committee (CC) votes. To ensure transparency and legitimacy, CIP-136 proposes a standard structure for CC members to provide detailed rationales for their votes, extending the base CIP-100 governance metadata standard.

Manually creating this structured JSON metadata, especially with the specific nested context seen in examples, can be tedious and error-prone. This tool aims to:

* **Simplify:** Provide an intuitive step-by-step interface for inputting rationale components.
* **Ensure Compliance:** Guide users to include all necessary fields according to CIP-136 and the reference JSON structure.
* **Improve Consistency:** Help Intersect's CC members produce standardized rationale metadata.
* **Streamline Workflow:** Generate the final JSON file ready for use after verification.

## Features

* **Step-by-Step Guidance:** Breaks down the metadata creation process into 6 logical steps.
* **Reference Structure Adherence:** Generates JSON matching the specific nested `@context` and field placement (e.g., `references` inside `body`) based on CIP-100 and CIP-136 standards.
* **CIP-136 Compliant Fields:** Covers compulsory (`summary`, `rationaleStatement`) and optional (`precedentDiscussion`, `counterargumentDiscussion`, `conclusion`, `internalVote`) body fields defined in CIP-136.
* **CIP-100 Base Fields:** Includes essential fields like `hashAlgorithm` and `authors`.
* **Reference Library:** Provides a dropdown of common references (like CIPs, GovTool, Constitution) to easily add to the metadata's "Relevant Articles" or "Other References" sections.
* **Dynamic Constitution Article Selection:** When the "Cardano Blockchain Ecosystem Constitution" is added to "Relevant Articles," a checkbox section appears, allowing users to select specific articles, tenets, or sections from the Constitution. These selections are then included in the `RelevantArticles` field of the generated metadata for that reference.
* **Live Step Validation:** Performs basic checks (e.g., required fields, summary length, non-negative numbers) directly in the browser as you navigate between steps. A checkmark (✓) appears next to the step title upon successful validation.
* **Final Verification Step:** Requires clicking a "Verify Metadata" button in the final step to perform checks on all required data (`hashAlgorithm`, `authors`, `summary`, `rationaleStatement`) before enabling the download button.
* **Direct JSON Download:** Generates and downloads the complete metadata as a `cip136_metadata.json` file once verified.
* **No Server Needed:** Runs entirely in the user's web browser as a static webpage.

## How Verification Works

This tool employs two levels of client-side validation implemented in JavaScript:

1.  **Live Step Validation:**
    * **Trigger:** When you click the "Next" button on a step.
    * **Checks:** Verifies that all `required` fields within that *specific step* are filled. It also checks basic constraints like the summary's character limit (max 300 chars in Step 2) or non-negative numbers for votes (Step 4).
    * **Feedback:** If validation passes, a checkmark (✓) appears next to the step title. If it fails, an alert message pops up indicating the first issue found, and navigation is blocked. This provides immediate feedback as you progress.
2.  **Final Verification (Step 6):**
    * **Trigger:** When you click the "Verify Metadata" button in Step 6.
    * **Checks:** This performs a more comprehensive check across *all* steps that contain fields mandatory for the final JSON output (specifically Steps 1 and 2 for `hashAlgorithm`, `authors`, `summary`, `rationaleStatement`). It also re-checks critical constraints like summary length and non-negative votes. This check runs *without* generating individual alert popups. (Optional validation for selecting at least one Constitution article if the Constitution reference is added can be enabled in the code).
    * **Feedback:** A status message is displayed below the review area indicating overall success ("Verification successful...") or the first detected failure ("Verification failed: Please check..."). The "Generate JSON File" button is only enabled if this final verification passes. This ensures all core requirements are met before attempting to generate the file.

*Note: Both validation levels run entirely within your browser and do not guarantee perfect compliance with every nuance of the CIPs, but they significantly reduce the chance of errors related to missing required fields or violating basic constraints.*

## How to Use

There are two ways to use this tool:

1.  **Using a Hosted Version (If Deployed)**
    * (If deployed using GitHub Pages or similar) Access the tool directly via the hosted link: `[Link to your hosted tool]` (Update this link if applicable)
2.  **Running Locally**
    * Clone the repository:
        ```bash
        git clone [https://github.com/Thomas-nada/Council-rationale-generator.git](https://github.com/Thomas-nada/Council-rationale-generator.git)
        cd Council-rationale-generator
        ```
        *(Repository URL updated based on `index.html`)*
    * Open the tool: Simply open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge).

### Using the Tool Interface:

*(Steps updated based on `index.html` and `script.js`)*

1.  **Step 1: Basic Information**
    * Enter the **Hash Algorithm** (defaults to `blake2b-256`). *Required*.
    * Optionally enter a **Subject** for your own reference (not included in the final JSON).
    * Enter the **Author(s)** details (one name per line or separated by semicolons). *Required*.
    * Click "Next". A checkmark (✓) will appear by the Step 1 title if required fields are filled.
2.  **Step 2: Core Rationale (Required Fields)**
    * Provide a concise **Summary** (max 300 characters). *Required*. A character counter is displayed.
    * Write the full **Rationale Statement** (Markdown supported). *Required*.
    * Click "Next". A checkmark will appear if required fields are filled and the summary length is valid.
3.  **Step 3: Supporting Discussion (Optional)**
    * Optionally, add discussions on **Precedent** (Markdown supported), **Counterarguments** (Markdown supported), and a **Conclusion** (Markdown *not* supported).
    * Click "Next". A checkmark will appear (as this step has no required fields, it's always considered 'valid' for navigation).
4.  **Step 4: Internal Voting (Optional)**
    * If relevant, enter the non-negative integer counts for internal **Constitutional Votes**, **Unconstitutional Votes**, **Abstain Votes**, and **Did Not Vote**.
    * An additional field **Votes Against Voting** is present but noted as not part of the standard reference JSON.
    * Click "Next". A checkmark will appear if any entered numbers are non-negative.
5.  **Step 5: References (Optional)**
    * Use the **Reference Library** dropdown to select common references (like CIPs, GovTool, Constitution). Click "Add to Relevant Articles" or "Add to Other References".
    * **If you add "Cardano Blockchain Ecosystem Constitution" to "Relevant Articles":** A checkbox section will appear below the list. Check all applicable articles/sections/tenets from the Constitution that support your rationale. The selected items will be included in the generated metadata.
    * Use the **Add Manual Reference** section to add any other references not in the library by providing a Label and URI, then selecting whether to add it to "Relevant Articles" or "Other References".
    * Added references (and selected Constitution articles) will appear in the lists below. You can delete references using the "Delete" button.
    * Click "Next". A checkmark will appear.
6.  **Step 6: Review and Generate**
    * Carefully review all the information displayed in the Review Area, including the selected Constitution articles if applicable.
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

* **CIP-136:** Governance metadata - Constitutional Committee votes ([Link: https://cips.cardano.org/cip/CIP-0136](https://cips.cardano.org/cip/CIP-0136))
* **CIP-100:** Governance Metadata ([Link: https://cips.cardano.org/cip/CIP-0100](https://cips.cardano.org/cip/CIP-0100))

*(Links added based on `script.js`)*

## Contributing

Contributions are welcome! Please feel free to:

* Report bugs or suggest features by opening an issue on the GitHub repository.
* Submit improvements by creating a pull request.
* Create a pull request to update the `constitutionArticles` array in `script.js`

## License

This project is licensed under the Apache License 2.0 - see the `LICENSE` file for details.
