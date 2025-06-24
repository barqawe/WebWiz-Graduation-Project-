using App.Dto_s.TaskDto;
using App.Repository;
using Domain.Entities;
using Infrastructure.DataHandler;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Text.Json;


namespace Infrastructure.ExternalServices
{
  public class ExternalApiService : IExternalApiService
  {
    private readonly string _apiKey;
    private readonly string _url;

    private static string? _TaskDescription = string.Empty;
    private static string? _HtmlCode = string.Empty;
    private static string? _CssCode = string.Empty;
    private static string? _JavaScriptCode = string.Empty;
    private static string? _JsxCode = string.Empty;
    private readonly IWebHostEnvironment _webHostEnvironment;

    private readonly IDesignTaskRepository _designTaskRepository;
    private readonly IOptimalTaskSolutionRepository _optimalTaskSolutionRepository;
    private readonly AppDbContext _context;
    private readonly ILogger<ExternalApiService> _logger;

    private readonly Dictionary<int, string> PromptTemplates = new Dictionary<int, string>()

        {
            { 1, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include any or all of: HTML, CSS, and JavaScript. Evaluate **only** the provided parts.
---

## Input:
---
* HTML Code:
  {1}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the HTML provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

Do not make assumptions, interpolations, or inferred corrections.

the submission — HTML — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---
---
* Optimal Solution:
  HTML content representing the correct solution.
---
* HTML Code:
{2}
---

---

### 1. HTML Quality
Does the HTML structure match the optimal solution in purpose and function — not just appearance?
Are all required containers, content blocks, and layout hierarchy elements present and in the correct order?
Compare the submitted HTML directly with the optimal solution. Any missing or misused elements must reduce the score.
Do not give credit for approximate or guessed structure — only what is explicitly correct.


### 5. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.

* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If HTML section lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---
# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""HTML"",
  ""code"": {{
    ""html"": {{
      ""layoutStructureMatch"": {{ ""commentary"": ""..."" }},
      ""requiredElementsPresent"": {{ ""commentary"": ""..."" }}
    }}
  }},
  ""issues"": [
    {{ ""type"": ""HTML"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },

            { 2, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include any or all of: HTML and CSS. Evaluate **only** the provided parts.
---

## Input:
---
* HTML Code:
  {1}
---
---
* CSS Code:
  {2}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the HTML and CSS provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

Do not make assumptions, interpolations, or inferred corrections.

Each part of the submission — HTML and CSS — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---

---
* Optimal Solution:
  HTML and CSS content representing the correct solution.
---
* HTML Code:
{3}
---
---
* CSS Code:
{4}
---

---

### 1. HTML Quality
Does the HTML structure match the optimal solution in purpose and function — not just appearance?
Are all required containers, content blocks, and layout hierarchy elements present and in the correct order?
Compare the submitted HTML directly with the optimal solution. Any missing or misused elements must reduce the score.
Do not give credit for approximate or guessed structure — only what is explicitly correct.

### 2. CSS Quality
* Compare the submitted CSS directly against both the optimal solution and the reference image (provided as base64).
  
* The rendered output must visually match the reference in terms of:
  
* Layout (using Flexbox, Grid, or other techniques)
  
* Spacing and alignment
  
* Color scheme and contrast
  
* Typography (fonts, weights, sizes)
  
* Responsiveness and adaptive behavior
  
* Do not award high scores unless the rendered layout is visually and structurally aligned with the optimal output.
  
* Minor mismatches — such as padding, alignment, hover states, font inconsistencies, or responsiveness issues — must significantly lower the score.
  
* If the CSS fails to recreate the required design, visualMatch-related scores should be low or near zero.
  
* Clean code or naming conventions are not enough — the final visual result must match.

### 3. Functional Match
* Do all interactive elements behave exactly as expected in the optimal solution?

* Compare the rendered behavior of the user’s code with the optimal solution and reference image to ensure feature parity.

* Any missing, broken, or inconsistent interactivity must result in a significantly lower score.

* Do not award points for partially working or placeholder interactivity. Behavior must be complete and match task expectations.

### 4. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.

* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If any section (HTML, CSS, JS) lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---

# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""HTML,CSS"",
  ""code"": {{
    ""HTML"": {{
      ""layoutStructureMatch"": {{ ""commentary"": ""..."" }},
      ""requiredElementsPresent"": {{ ""commentary"": ""..."" }}
    }},
    ""CSS"": {{
      ""codeQuality"": {{ ""commentary"": ""..."" }},
      ""visualMatch"": {{ ""commentary"": ""..."" }}
    }},
  }},
  ""issues"": [
    {{ ""type"": ""HTML"", ""description"": ""..."", ""recommendation"": ""..."" }},
    {{ ""type"": ""CSS"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },

            { 3, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include any or all of: HTML, CSS, and JavaScript. Evaluate **only** the provided parts.
---

## Input:
---
* HTML Code:
  {1}
---
---
* CSS Code:
  {2}
---
---
* JavaScript Code:
  {3}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the HTML, CSS, and JavaScript provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

Do not make assumptions, interpolations, or inferred corrections.

Each part of the submission — HTML, CSS, and JavaScript — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---
---
* Optimal Solution:
  HTML, CSS, and JS content representing the correct solution.
---
* HTML Code:
{4}
---
---
* CSS Code:
{5}
---
---
*JavaScript Code:
{6}
---

---

### 1. HTML Quality
Does the HTML structure match the optimal solution in purpose and function — not just appearance?
Are all required containers, content blocks, and layout hierarchy elements present and in the correct order?
Compare the submitted HTML directly with the optimal solution. Any missing or misused elements must reduce the score.
Do not give credit for approximate or guessed structure — only what is explicitly correct.

### 2. CSS Quality
* Compare the submitted CSS directly against both the optimal solution and the reference image (provided as base64).
  
* The rendered output must visually match the reference in terms of:
  
* Layout (using Flexbox, Grid, or other techniques)
  
* Spacing and alignment
  
* Color scheme and contrast
  
* Typography (fonts, weights, sizes)
  
* Responsiveness and adaptive behavior
  
* Do not award high scores unless the rendered layout is visually and structurally aligned with the optimal output.
  
* Minor mismatches — such as padding, alignment, hover states, font inconsistencies, or responsiveness issues — must significantly lower the score.
  
* If the CSS fails to recreate the required design, visualMatch-related scores should be low or near zero.
  
* Clean code or naming conventions are not enough — the final visual result must match.


### 3. JavaScript Logic (If JavaScript is provided)
* Evaluate whether the JavaScript is functional, purposeful, and directly aligned with the expected behavior defined in the optimal solution.

* Check if DOM selection, event handling, and dynamic interactions (e.g. form handling, state updates, or element toggling) are correctly implemented.

* Code must be modular, clean, and include basic error tolerance (e.g. handling invalid states, preventing default issues).

* Compare the submitted JavaScript directly against the optimal solution and test whether it produces the same interactive behavior.

* If the JavaScript is trivial, unrelated to the task, or fails to achieve the expected interactivity, score this section low or zero — regardless of code style or formatting.

### 4. Functional Match
* Do all interactive elements behave exactly as expected in the optimal solution?

* Buttons, forms, toggles, or other dynamic elements must respond correctly to user actions (e.g., click, focus, submit, keyboard navigation).

* Compare the rendered behavior of the user’s code with the optimal solution and reference image to ensure feature parity.

* Any missing, broken, or inconsistent interactivity must result in a significantly lower score.

* Do not award points for partially working or placeholder interactivity. Behavior must be complete and match task expectations.

### 5. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.

* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If any section (HTML, CSS, JS) lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---

# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""HTML,CSS,JS"",
  ""code"": {{
    ""HTML"": {{
      ""layoutStructureMatch"": {{ ""commentary"": ""..."" }},
      ""requiredElementsPresent"": {{ ""commentary"": ""..."" }}
    }},
    ""CSS"": {{
      ""codeQuality"": {{ ""commentary"": ""..."" }},
      ""visualMatch"": {{ ""commentary"": ""..."" }}
    }},
    ""JS"": {{
      ""domManipulation"": {{ ""commentary"": ""..."" }},
      ""logic"": {{ ""commentary"": ""..."" }},
      ""errorHandling"": {{ ""commentary"": ""..."" }}
    }}
  }},
  ""issues"": [
    {{ ""type"": ""HTML"", ""description"": ""..."", ""recommendation"": ""..."" }},
    {{ ""type"": ""CSS"", ""description"": ""..."", ""recommendation"": ""..."" }},
    {{ ""type"": ""JS"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },

            { 4, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include JSX only. Evaluate the provided JSX.
---

## Input:
---
* JSX Code:
  {1}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the JSX provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

---
Do not make assumptions, interpolations, or inferred corrections.

the submission - JSX — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---

---
* Optimal Solution:
  JSX content representing the correct solution.
---
* JSX Code:
{2}
---
---  

## Evaluation Guidelines:

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on the code provided.

### 1. JSX Structure & Hierarchy

* Are elements structured as expected?
* Are components organized logically and match the intended layout?

### 2. Correct Use of JSX Syntax

* Are components returning valid JSX?
* Are tags properly closed and structured?

### 3. Required Elements Present

* Are key tags like `<div>`, `<h1>`, `<button>`, etc., included as needed?
* Are `className`, `props`, and other JSX-specific features used correctly?

---


### 4. Functional Match
* Do all interactive elements behave exactly as expected in the optimal solution?

* Buttons, forms, toggles, or other dynamic elements must respond correctly to user actions (e.g., click, focus, submit, keyboard navigation).

* Compare the rendered behavior of the user’s code with the optimal solution and reference image to ensure feature parity.

* Any missing, broken, or inconsistent interactivity must result in a significantly lower score.

* Do not award points for partially working or placeholder interactivity. Behavior must be complete and match task expectations.

### 5. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.
    
* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If any section (HTML, CSS, JS) lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---

# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""JSX"",
  ""code"": {{
    ""JSX"": {{
        ""structureMatch"": {{ ""commentary"": ""..."" }},
        ""requiredElementsPresent"": {{ ""commentary"": ""..."" }},
        ""jsxSyntaxCorrectness"": {{ ""commentary"": ""..."" }},
    }},
    
  }},
  ""issues"": [
    {{ ""type"": ""JSX"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },

            { 5, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include JSX only. Evaluate the provided JSX.
---

## Input:
---
* JSX Code:
  {1}
---
---
* CSS Code:
  {2}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the JSX provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

---
Do not make assumptions, interpolations, or inferred corrections.

the submission - JSX — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---

---
* Optimal Solution:
  JSX content representing the correct solution.
---
* JSX Code:
{3}
---
* CSS Code:
{4}
---  

## Evaluation Guidelines:

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on the code provided.

### 1. JSX Structure & Hierarchy

* Are elements structured as expected?
* Are components organized logically and match the intended layout?

### 2. Correct Use of JSX Syntax

* Are components returning valid JSX?
* Are tags properly closed and structured?

### 3. Required Elements Present

* Are key tags like `<div>`, `<h1>`, `<button>`, etc., included as needed?
* Are `className`, `props`, and other JSX-specific features used correctly?
---
---
### 4. CSS Quality
* Compare the submitted CSS directly against both the optimal solution and the reference image (provided as base64).
  
* The rendered output must visually match the reference in terms of:
  
* Layout (using Flexbox, Grid, or other techniques)
  
* Spacing and alignment
  
* Color scheme and contrast
  
* Typography (fonts, weights, sizes)
  
* Responsiveness and adaptive behavior
  
* Do not award high scores unless the rendered layout is visually and structurally aligned with the optimal output.
  
* Minor mismatches — such as padding, alignment, hover states, font inconsistencies, or responsiveness issues — must significantly lower the score.
  
* If the CSS fails to recreate the required design, visualMatch-related scores should be low or near zero.
  
* Clean code or naming conventions are not enough — the final visual result must match.
---
---


### 4. Functional Match
* Do all interactive elements behave exactly as expected in the optimal solution?

* Buttons, forms, toggles, or other dynamic elements must respond correctly to user actions (e.g., click, focus, submit, keyboard navigation).

* Compare the rendered behavior of the user’s code with the optimal solution and reference image to ensure feature parity.

* Any missing, broken, or inconsistent interactivity must result in a significantly lower score.

* Do not award points for partially working or placeholder interactivity. Behavior must be complete and match task expectations.

### 5. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.

* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If any section (HTML, CSS, JS) lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---

# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""JSX"",
  ""code"": {{
    ""JSX"": {{
        ""structureMatch"": {{ ""commentary"": ""..."" }},
        ""requiredElementsPresent"": {{ ""commentary"": ""..."" }},
        ""jsxSyntaxCorrectness"": {{ ""commentary"": ""..."" }},
    }},
    ""CSS"": {{
        ""codeQuality"": {{ ""commentary"": ""..."" }},
        ""visualMatch"": {{ ""commentary"": ""..."" }}
    }},
  ""issues"": [
    {{ ""type"": ""JSX"", ""description"": ""..."", ""recommendation"": ""..."" }},
    {{ ""type"": ""CSS"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },

            { 6, @"
You are an automated front-end evaluation engine. Your role is to strictly and objectively score the user's submitted code and design screenshot against the optimal solution, based on the task description and the required final design.

IMPORTANT: Do not make assumptions about the user's intent or code quality. Evaluate strictly and only based on what is explicitly provided in the code. If the submission is incomplete, trivial (e.g., ""a"",""sldjfsafkjla;sd"",inmeanning language), or non-functional, do not infer structure, purpose, or intent.
---
## Task Overview:
{0}
---
The submission may include any or all of: HTML and JS. Evaluate **only** the provided parts.
---

## Input:
---
* HTML Code:
  {1}
---
---
* JS Code:
  {2}
---

---
This is the user's code submission and must be evaluated as-is.
Focus strictly on the quality and functionality of the HTML and JS provided.
You must compare the user's submission directly against the optimal solution and required design to assess both functional behavior and visual accuracy.
This includes comparing the rendered result of the user's submission with the base64-encoded screenshot of the required design (provided as the Reference Image).

Do not make assumptions, interpolations, or inferred corrections.

Each part of the submission — HTML and JS — must be evaluated for:

Functional equivalence to the optimal solution

Visual layout and styling accuracy

Interactive behavior and output correctness

If any part does not match the required behavior or visual structure, scores must reflect that strictly.
---

---
* Optimal Solution:
  HTML and JS content representing the correct solution.
---
* HTML Code:
{3}
---
---
* JS Code:
{4}
---

---

### 1. HTML Quality
Does the HTML structure match the optimal solution in purpose and function — not just appearance?
Are all required containers, content blocks, and layout hierarchy elements present and in the correct order?
Compare the submitted HTML directly with the optimal solution. Any missing or misused elements must reduce the score.
Do not give credit for approximate or guessed structure — only what is explicitly correct.

### 2. JavaScript Logic (If JavaScript is provided)
* Evaluate whether the JavaScript is functional, purposeful, and directly aligned with the expected behavior defined in the optimal solution.

* Check if DOM selection, event handling, and dynamic interactions (e.g. form handling, state updates, or element toggling) are correctly implemented.

* Code must be modular, clean, and include basic error tolerance (e.g. handling invalid states, preventing default issues).

* Compare the submitted JavaScript directly against the optimal solution and test whether it produces the same interactive behavior.

* If the JavaScript is trivial, unrelated to the task, or fails to achieve the expected interactivity, score this section low or zero — regardless of code style or formatting.

### 3. Functional Match
* Do all interactive elements behave exactly as expected in the optimal solution?

* Compare the rendered behavior of the user’s code with the optimal solution and reference image to ensure feature parity.

* Any missing, broken, or inconsistent interactivity must result in a significantly lower score.

* Do not award points for partially working or placeholder interactivity. Behavior must be complete and match task expectations.

### 4. Task Relevancy
* The user's submission must directly fulfill the task description and visually match the required design.

* Regardless of code style or formatting, the execution must demonstrate the correct functionality and appearance.

* You must evaluate this by comparing the rendered output (from the user's code) to the provided reference screenshot (base64 image).

* The closer the output matches the required UI and behavior, the higher the score.

* Submissions that diverge from the task’s purpose — even if syntactically clean — must receive a low task relevancy score.


---

## Special Scoring Rules
* # IMPORTANT: Do not assume the user's intent, functionality, or correctness for any missing, broken, or incomplete code.

* Evaluate only what is explicitly written in the submission — not what the user might have meant to do.

* Placeholder, trivial, or non-functional code (e.g., ""a"", {{}}, // TODO) must receive a score of 0 in all related categories.

* If any section (HTML, CSS, JS) lacks meaningful implementation, its scores must reflect that strictly.

* The total score must be calculated only from the numeric score fields inside the taskCompletion object in the JSON output.

* Do not base the total on subjective impressions, formatting, or inferred logic — it must reflect actual correctness and completeness.

---

## Grade Assignment:

* 0–59: Fail
* 60–69: Poor
* 70–77: Fair
* 78–84: Good
* 85–93: Very Good
* 94–100: Excellent

---

# Output Format
* Return only a JSON object using the format shown below.

* The JSON must be:

* Fully escaped using double quotes ("")

* Syntactically valid (no missing commas or braces)

* Complete (no missing fields, no placeholder keys like ""score"": ""x"")

* Do not include any extra text, commentary, or explanations outside the JSON object.

* This JSON must be fully self-contained and ready for automated parsing.

* Escaped braces ({{ }}) are required where indicated to ensure compatibility with systems that generate or render template strings.

* ""totalScore"" should equal the sum of all ""score"" values inside ""taskCompletion"".

---
{{
  ""type"": ""HTML,JS"",
  ""code"": {{
    ""HTML"": {{
      ""layoutStructureMatch"": {{ ""commentary"": ""..."" }},
      ""requiredElementsPresent"": {{ ""commentary"": ""..."" }}
    }},
    ""JS"": {{
      ""codeQuality"": {{ ""commentary"": ""..."" }},
      ""visualMatch"": {{ ""commentary"": ""..."" }}
    }},
  }},
  ""issues"": [
    {{ ""type"": ""HTML"", ""description"": ""..."", ""recommendation"": ""..."" }},
    {{ ""type"": ""JS"", ""description"": ""..."", ""recommendation"": ""..."" }}
  ],
  ""taskCompletion"": {{
    ""visualMatch"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }},
    ""functionality"": {{ ""score"": x, ""outOf"": 50, ""commentary"": ""..."" }}
  }},
  ""overallRecommendation"": ""...summary and suggestions..."",
  ""totalScore"": x,
  ""grade"": ""Fail"" | ""Poor"" | ""Fair"" | ""Good"" | ""Very Good"" | ""Excellent""
}}
"
 },
        };

    public ExternalApiService(IOptions<ExternalApiSettings> options, AppDbContext context, ILogger<ExternalApiService> logger,
     IDesignTaskRepository designTaskRepository, IOptimalTaskSolutionRepository optimalTaskSolutionRepository, IWebHostEnvironment webHostEnvironment)
    {
      ExternalApiSettings config = options.Value;
      _apiKey = config.ApiKey;
      _url = $"{config.BaseUrl}?key={_apiKey}";
      _context = context;
      _logger = logger;
      _designTaskRepository = designTaskRepository;
      _optimalTaskSolutionRepository = optimalTaskSolutionRepository;

      _webHostEnvironment = webHostEnvironment;

    }

    public async Task<string?> GetExternalDataAsync(AIEvaluationDtoReq req, Guid ID)
    {
      DesignTask? task = await _designTaskRepository.GetTaskByIdAsync(ID);

      if (task is null)
      {
        _logger.LogWarning("Task not found: {TaskId}", ID);
        return null;
      }

      OptimalTaskSolution? solution = await _optimalTaskSolutionRepository.GetOptimalTaskSolutionByTaskIdAsync(ID);
      if (solution == null)
        return null;

      List<TaskImage> taskImages = await _context.TaskImages
          .Where(ti => ti.TaskId == ID)
          .ToListAsync();
      TaskImage? taskImage = taskImages[0];
      using HttpClient _httpClient = new HttpClient();

      HttpResponseMessage imageResponse = await _httpClient.GetAsync(taskImage.ImageUrl);
      imageResponse.EnsureSuccessStatusCode();

      byte[] imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();
      string OptimalImageBase64String = Convert.ToBase64String(imageBytes);

      string? SubmittedImage = await ConvertIFormFileToBase64Async(req.SubmittedImage);
      if (taskImage is null)
      {
        _logger.LogWarning("Task image not found for task ID: {TaskId}", ID);
        return null;
      }
      int PromptNumber = 1;
      if (task.ProgrammingLanguage.Contains("react") &&
          task.ProgrammingLanguage.Contains("css"))
      {
        PromptNumber = 5;
        _JsxCode = solution.React;
        _CssCode = solution.CSS;
      }
      else if (task.ProgrammingLanguage.Contains("react"))
      {
        PromptNumber = 4;
        _JsxCode = solution.React;
      }
      else if (task.ProgrammingLanguage.Contains("javascript") &&
          task.ProgrammingLanguage.Contains("html") &&
          task.ProgrammingLanguage.Contains("css"))
      {
        PromptNumber = 3;
        _JavaScriptCode = solution.JavaScript;
        _CssCode = solution.CSS;
        _HtmlCode = solution.HTML;
      }
      else if (task.ProgrammingLanguage.Contains("javascript") &&
          task.ProgrammingLanguage.Contains("html"))
      {
        PromptNumber = 6;
        _JavaScriptCode = solution.JavaScript;
        _HtmlCode = solution.HTML;
      }
      else if (task.ProgrammingLanguage.Contains("css") &&
      task.ProgrammingLanguage.Contains("html"))
      {
          PromptNumber = 2;
          _CssCode = solution.CSS;
          _HtmlCode = solution.HTML;
      }
      else if (task.ProgrammingLanguage.Contains("html"))
      {
          PromptNumber = 1;
          _HtmlCode = solution.HTML;
      }
      string prompt = string.Empty;

      if (!PromptTemplates.TryGetValue(PromptNumber, out string? template))
      {
        _logger.LogWarning("Prompt template not found for number: {PromptNumber}", PromptNumber);
        return null;
      }

      switch (PromptNumber)
      {
          case 1:
              prompt = string.Format(template, task.Description, req.HTML, _HtmlCode);
              break;
          case 2:
              prompt = string.Format(template, task.Description, req.HTML, req.CSS, _HtmlCode, _CssCode);
              break;
          case 3:
              prompt = string.Format(template, task.Description, req.HTML, req.CSS, req.JS, _HtmlCode, _CssCode, _JavaScriptCode);
              break;
          case 4:
              prompt = string.Format(template, task.Description, req.JSX, _JsxCode);
              break;
          case 5:
              prompt = string.Format(template, task.Description, req.JSX, req.CSS, _JsxCode, _CssCode);
              break;
          case 6:
              prompt = string.Format(template, task.Description, req.HTML, req.JS, _HtmlCode, _JavaScriptCode);
              break;
      }

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new object[]
                        {
                            new { text = prompt },
                            new {text= "the required design:"},
                            new
                            {
                                inlineData = new
                                {
                                    mimeType = "image/png",
                                    data = OptimalImageBase64String
                                }
                            },
                            new {text= "the screenshot:"},
                            new
                            {
                                inlineData = new
                                {
                                    mimeType = "image/png",
                                    data = SubmittedImage
                                }
                            }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.2,
                    maxOutputTokens = 1024,
                    topP = 1
                }
            };


      var options = new JsonSerializerOptions
      {
          PropertyNamingPolicy = JsonNamingPolicy.CamelCase
      };
      string jsonPayload = JsonSerializer.Serialize(payload, options);

      using (HttpClient client = new HttpClient())
      {
        StringContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
        try
        {
          HttpResponseMessage response = await client.PostAsync(_url, content);
          if (response.IsSuccessStatusCode)
          {
            string result = await response.Content.ReadAsStringAsync();
            JObject jsonObject = JObject.Parse(result);

            string? answer = (string?)jsonObject["candidates"]?[0]?["content"]?["parts"]?[0]?["text"];

            if (!string.IsNullOrWhiteSpace(answer))
            {
              answer = answer.Trim();

              if (answer.StartsWith("```json") && answer.EndsWith("```"))
              {
                var lines = answer.Split('\n').ToList();
                lines.RemoveAt(0); // remove ```json
                lines.RemoveAt(lines.Count - 1); // remove ```
                answer = string.Join("\n", lines);
              }
              return answer;
            }
            else
            {
              return null;
            }
          }
          else
          {
            return null;
          }
        }
        catch (Exception ex)
        {
          return $"Exception occurred: {ex.Message}";
        }
      }

    }
    private async Task<string?> ConvertIFormFileToBase64Async(IFormFile? file)
    {
      if (file == null)
        return null;

      using (var memoryStream = new MemoryStream())
      {
        await file.CopyToAsync(memoryStream);
        byte[] fileBytes = memoryStream.ToArray();
        return Convert.ToBase64String(fileBytes);
      }
    }


  }

}
