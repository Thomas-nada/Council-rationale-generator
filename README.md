# CC Rationale Metadata Generator

This tool helps Constitutional Committee (CC) members generate CIP-136 compliant metadata for their vote rationales. It provides a step-by-step web interface to input necessary information and produces downloadable JSON and Markdown files.

The generator is located within the `cc-rationale-generator` directory of the [Tingvard-cc/tools](https://github.com/Tingvard-cc/tools/tree/main/cc-rationale-generator) repository.

## Live Access / How to Use

To use the tool, simply open the `index.html` file from the `cc-rationale-generator` directory in your web browser.

[Direct link to the tool](https://tingvard-cc.github.io/tools/cc-rationale-generator/index.html)
*(Note: If the above link doesn't work, you'll need to clone the repository and open `cc-rationale-generator/index.html` locally.)*

## Features

* **Step-by-Step Form:** Guides users through 6 steps to input all required and optional metadata fields.
* **CIP-136 Compliance:** Generates JSON output structured according to the CIP-136 (Constitutional Committee Vote Metadata) standard.
* **Markdown Export:** Generates a human-readable Markdown (.md) version of the rationale alongside the JSON file.
* **Reference Management:**
    * Includes a pre-defined library of common references (e.g., Cardano Constitution, CIPs).
    * Allows manual addition of custom references.
    * Supports linking specific articles/sections of the Cardano Constitution to the rationale.
* **Input Validation:** Basic validation for required fields and constraints (e.g., summary length).
* **Review Stage:** A dedicated step to review all entered information before generating the output files.
* **Custom Filename Generation:** Output files (JSON and Markdown) are automatically named using the format `YYYY-MM-DD - Subject.ext`.
* **Dark Mode:** Includes a theme toggle for user preference (light/dark mode), with the choice saved in local storage.
* **Responsive Design:** The interface is designed to be usable across different screen sizes.

## How to Use the Generator

1.  **Open `index.html`:** Access the tool by opening the `index.html` file in your browser.
2.  **Step 1: Basic Information:**
    * **Hash Algorithm:** Confirm or edit the default hashing algorithm (e.g., `blake2b-256`).
    * **Subject:** (Optional) Enter a concise subject for your rationale. This will be used in the generated filenames.
    * **Author(s):** Enter the name(s) of the CC member(s) authoring the rationale. This is a required field.
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
    * Click "Generate JSON File" to download the `YYYY-MM-DD - Subject.JSON` file.
    * Click "Generate Markdown File" to download the `YYYY-MM-DD - Subject.md` file.

## File Structure

The tool is a single HTML file:

* `index.html`: This file contains all the necessary HTML for structure, CSS for styling (including light and dark mode themes), and JavaScript for the application's logic (multi-step form, data collection, validation, reference management, theme toggling, JSON and Markdown generation).

## Customization & Contribution

### Adding to the Reference Library

The reference library is defined as an array of objects within the `<script>` section of `index.html` (the `referenceLibrary` constant). To add new common references:

1.  Open `index.html` and find the `<script>` tag.
2.  Locate the `referenceLibrary` array within the JavaScript code.
3.  Add a new object to the array with `label` (display name) and `uri` (the link) properties.
    ```javascript
    // Example:
    { label: "New Important Document", uri: "[https://example.com/new-doc](https://example.com/new-doc)" },
    ```
4.  If the reference is the Cardano Constitution (or a version of it that should trigger the article selector), also add `isConstitution: true`.

### General Contributions

Contributions to improve the tool are welcome! Please feel free to fork the repository, make your changes, and submit a pull request. You can also open issues for bugs or feature requests.

## Recent Updates (as of May 24, 2025)

* **Markdown Export:** Added functionality to generate and download a human-readable Markdown file of the rationale.
* **Dark Mode:** Added a theme toggle for light and dark modes, with preferences saved.
* **Custom Filename:** JSON and Markdown files are now saved with a `YYYY-MM-DD - Subject.ext` naming convention.
* **Button Styling:** Ensured consistent styling for navigation buttons across all steps.
* **Single File Structure:** HTML, CSS, and JavaScript have been consolidated into a single `index.html` for easier distribution and use.
* **Minor UI Enhancements:** Including fixes for character counter color in dark mode.

## License

This project is licensed under the Apache License 2.0 - see the `LICENSE` file for details.
