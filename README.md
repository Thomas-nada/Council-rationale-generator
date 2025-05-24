# CC Rationale Metadata Generator

This tool helps Constitutional Committee (CC) members generate CIP-136 compliant metadata for their vote rationales. It provides a step-by-step web interface to input necessary information and produces downloadable JSON and Markdown files.

The generator is located within the [thomas-nada/Council-rationale-generator](https://github.com/thomas-nada/Council-rationale-generator) repository.

## Live Access / How to Use

To use the tool, simply open the `index.html` file from the repository in your web browser.

[Direct link to the tool](https://thomas-nada.github.io/Council-rationale-generator/)
*(Note: If the above link doesn't work, you'll need to clone the repository and open `index.html` locally.)*

## Features

* **Step-by-Step Form:** Guides users through 6 steps to input all required and optional metadata fields.
* **Governance Action Type Selection:** Allows users to specify the type of governance action (e.g., No-Confidence, Hard-Fork) in Step 1.
* **CIP-136 Compliance:** Generates JSON output structured according to the CIP-136 (Constitutional Committee Vote Metadata) standard.
* **Markdown Export:** Generates a human-readable Markdown (.md) version of the rationale alongside the JSON file.
* **User-Friendly Author Selection:** Authors are selected via a clear checkbox list.
* **Reference Management:**
    * Includes a pre-defined library of common references (e.g., Cardano Constitution, CIPs).
    * Allows manual addition of custom references.
    * Supports linking specific articles/sections of the Cardano Constitution to the rationale.
* **Input Validation:** Basic validation for required fields and constraints (e.g., summary length, selection of governance action type and authors).
* **Review Stage:** A dedicated step to review all entered information before generating the output files.
* **Custom Filename Generation:** Output files (JSON and Markdown) are automatically named using the format `yyyy-mm-dd-govactiontype-subject.ext` (all lowercase).
* **Dark Mode:** Includes a theme toggle for user preference (light/dark mode), with the choice saved in local storage.
* **Responsive Design:** The interface is designed to be usable across different screen sizes.

## How to Use the Generator

1.  **Access the Tool:**
    * **Online:** Visit [https://thomas-nada.github.io/Council-rationale-generator/](https://thomas-nada.github.io/Council-rationale-generator/)
    * **Locally:** Clone the [repository](https://github.com/thomas-nada/Council-rationale-generator) and open the `index.html` file in your browser.
2.  **Step 1: Basic Information:**
    * **Hash Algorithm:** Confirm or edit the default hashing algorithm (e.g., `blake2b-256`).
    * **Governance Action Type:** Select the appropriate type of governance action from the dropdown menu. This is a required field.
    * **Subject:** Enter a concise name for the governance action (e.g., 'update-cip-xxxx', 'treasury-withdrawal-project-y'). This should reflect the governance action itself and will be part of the filename.
    * **Author(s):** Select one or more authors from the provided checkbox list. This is a required field.
3.  **Step 2: Core Rationale (Compulsory):**
    * **Summary:** Provide a short summary (max 300 characters).
    * **Rationale Statement:** Enter the full rationale. Markdown is supported.
4.  **Step 3: Supporting Discussion (Optional):**
    * Enter details for Precedent Discussion, Counterargument Discussion, and Conclusion if applicable.
5.  **Step 4: Internal Voting (Optional):**
    * If applicable, provide a breakdown of internal voting within your organization/consortium.
6.  **Step 5: References:**
    * **Reference Library:** Select common references from the dropdown and add them as "Relevant Articles" or "Other References."
    * **Manual Reference:** Add any other references by providing a label and URI.
    * **Constitution Articles:** If the Cardano Constitution is added as a relevant article, a selector will appear allowing you to check specific articles/sections relevant to your rationale.
7.  **Step 6: Review and Generate:**
    * Carefully review all the information you've entered.
    * Click "Verify Metadata" to check for any missing required fields or validation errors.
    * Once verified successfully, the "Generate JSON File" and "Generate Markdown File" buttons will be enabled.
    * Click "Generate JSON File" to download the `yyyy-mm-dd-govactiontype-subject.json` file.
    * Click "Generate Markdown File" to download the `yyyy-mm-dd-govactiontype-subject.md` file.

## File Structure

The tool is a single HTML file:

* `index.html`: This file contains all the necessary HTML for structure, CSS for styling (including light and dark mode themes), and JavaScript for the application's logic (multi-step form, data collection, validation, reference management, theme toggling, JSON and Markdown generation).

## Customization & Contribution

### Adding to the Reference Library or Author List

The reference library (`referenceLibrary` constant) and the list of authors for the checkboxes (`authorList` constant) are defined as arrays within the `<script>` section of `index.html`.

**To add new common references:**
1.  Open `index.html` and find the `<script>` tag.
2.  Locate the `referenceLibrary` array.
3.  Add a new object to the array with `label` (display name) and `uri` (the link) properties.
    ```javascript
    // Example:
    { label: "New Important Document", uri: "[https://example.com/new-doc](https://example.com/new-doc)" },
    ```
4.  If the reference is the Cardano Constitution (or a version of it that should trigger the article selector), also add `isConstitution: true`.

**To modify the author list:**
1.  Open `index.html` and find the `<script>` tag.
2.  Locate the `authorList` array.
3.  Add or remove author names (strings) as needed.
    ```javascript
    // Example:
    const authorList = [
        "Intersect Constitutional Council", "Hosky", "New Author Name", /* ... other authors */
    ];
    ```

### General Contributions

Contributions to improve the tool are welcome! Please feel free to fork the [repository](https://github.com/thomas-nada/Council-rationale-generator), make your changes, and submit a pull request. You can also open issues for bugs or feature requests.

## Recent Updates (as of May 24, 2025)

* **Governance Action Type:** Added a dropdown in Step 1 to select the type of governance action.
* **Updated Filename Convention:** Output files are now named `yyyy-mm-dd-govactiontype-subject.ext` (all lowercase).
* **Author Selection via Checkboxes:** Changed author input from a multi-select dropdown to a more user-friendly checkbox list.
* **Markdown Export:** Added functionality to generate and download a human-readable Markdown file of the rationale.
* **Dark Mode:** Added a theme toggle for light and dark modes, with preferences saved.
* **Button Styling:** Ensured consistent styling for navigation buttons across all steps.
* **Single File Structure:** HTML, CSS, and JavaScript have been consolidated into a single `index.html` for easier distribution and use.
* **Minor UI Enhancements:** Including fixes for character counter color in dark mode and button layout adjustments.

## License

This project is licensed under the Apache License 2.0 - see the `LICENSE` file for details.
