# Intersect Council Rationale Generator

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) A web-based tool for Intersect's Cardano Constitutional Committee members to generate CIP-136 compliant JSON metadata for vote rationales via a simple step-by-step process.

## Motivation

Cardano's governance framework (CIP-1694) introduces on-chain mechanisms, including Constitutional Committee (CC) votes. To ensure transparency and legitimacy, CIP-136 proposes a standard structure for CC members to provide detailed rationales for their votes, extending the base CIP-100 governance metadata standard.

Manually creating this structured JSON metadata can be tedious and error-prone. This tool aims to:

* **Simplify:** Provide an intuitive step-by-step interface for inputting rationale components.
* **Ensure Compliance:** Guide users to include all necessary fields according to CIP-136 and CIP-100.
* **Improve Consistency:** Help Intersect's CC members produce standardized rationale metadata.
* **Streamline Workflow:** Generate the final JSON file ready for use.

## Features

* **Step-by-Step Guidance:** Breaks down the metadata creation process into logical steps.
* **CIP-136 Compliant:** Covers all compulsory (`summary`, `rationaleStatement`) and optional (`precedentDiscussion`, `counterargumentDiscussion`, `conclusion`, `internalVote`, `RelevantArticles`) fields defined in CIP-136.
* **CIP-100 Base Fields:** Includes essential fields like `subject`, `authors`, `@context`, and standard `references`.
* **Client-Side Validation:** Performs basic checks (e.g., required fields, summary length) directly in the browser.
* **Direct JSON Download:** Generates and downloads the complete metadata as a `.json` file.
* **No Server Needed:** Runs entirely in the user's web browser as a static webpage.
* **Timestamping:** Automatically adds a `publishedAt` timestamp to the metadata.

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
    * Enter the `Subject` for the rationale (e.g., "Rationale for Vote on GovAction XYZ-123").
    * Enter the `Author(s)` details (name and optional contact). Separate multiple authors with semicolons or new lines.
    * Click "Next".
2.  **Step 2: Core Rationale (Compulsory)**
    * Provide a concise `Summary` (max 300 characters). A character counter is provided.
    * Write the full `Rationale Statement`. Markdown formatting is supported here.
    * Click "Next".
3.  **Step 3: Supporting Discussion (Optional)**
    * Optionally, add discussions on `Precedent` (Markdown supported), `Counterarguments` (Markdown supported), and a `Conclusion` (Markdown *not* supported).
    * Click "Next".
4.  **Step 4: Internal Voting (Optional)**
    * If relevant (e.g., for an organizational CC member), enter the non-negative integer counts for internal votes (`Constitutional`, `Unconstitutional`, `Abstain`, `Did Not Vote`, `Votes Against Voting`). Leave blank or 0 if not applicable.
    * Click "Next".
5.  **Step 5: References**
    * List relevant Constitution article identifiers (one per line) under `Relevant Constitution Articles`. These will be formatted according to CIP-136 (`RelevantArticles` type).
    * List other relevant URIs (one per line) under `Other References`. You can optionally add a description after a pipe symbol (`|`), e.g., `https://link.to/govaction | Link to GovAction XYZ-123`. These will be formatted as standard CIP-100 `Reference` types.
    * Click "Next".
6.  **Step 6: Review and Generate**
    * Carefully review all the information displayed.
    * Use the "Previous" button to go back and make corrections if needed.
    * Click "Generate JSON File".
    * Your browser will download the complete metadata as a `cip136_metadata.json` file.

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

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. ```

**Important:** Remember to also replace the actual content of the `LICENSE` file in your repository with the full text of the Apache License 2.0 (you can easily find the standard text online, for example, at the Apache Foundation website or choosealicense.com).
