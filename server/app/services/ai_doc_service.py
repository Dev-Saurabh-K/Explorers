import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings


class LLMDocGenerator:
    def __init__(self):
        self._llm = None

    def get_llm(self):
        if self._llm is None:
            api_key = settings.google_api_key or os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("Google Gemini API Key is required. Please set GOOGLE_API_KEY in .env or config.")
            self._llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0.2,
                google_api_key=api_key,
            )
        return self._llm

    def generate_feature_doc(self, feature_name: str, feature_summary: str, diff_context: dict) -> str:
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert Staff Technical Writer and Senior Software Engineer.
Your task is to produce a definitive, highly detailed technical specification and documentation file for the feature: `{feature_name}`.

The documentation MUST follow this structured Markdown format:

# Feature Documentation: {feature_name}

## 1. Executive Summary & Purpose
Explain what this feature is, why it was introduced, what user problem it solves, and the high-level business logic.

## 2. Architectural Overview & Workflow
Provide an architectural description of how this feature interacts with the rest of the application.
Include a valid GitHub Flavored Mermaid diagram (e.g., sequenceDiagram or flowchart TD) depicting the runtime flow.

## 3. Implementation Details & File Breakdown
For each primary file modified in this feature:
- `path/to/file`: Detail the responsibilities of this file, the specific changes introduced by the commits, and highlight critical functions or types.

## 4. Key Code Snippets & Explanations
Show key code structures, class definitions, endpoints, or algorithms added, explaining the rationale behind design choices.

## 5. API Endpoints / Data Contracts (If applicable)
Detail request/response models, endpoints, parameters, and database schema modifications introduced.

## 6. Testing, Verification & Edge Cases
Describe how a developer can test or verify this feature, including edge cases handled (error states, token expirations, validations).

Rules:
- Do NOT hallucinate code not present in the diffs or commit messages.
- Format all code blocks with appropriate syntax highlighting (`python`, `javascript`, `json`, `mermaid`).
- Return ONLY the raw markdown content without enclosing the entire response in outer triple backticks."""),
            ("user", """Feature Name: {feature_name}
Summary: {feature_summary}

Commits in this feature:
{commits}

Files Changed & Diffs:
{files}""")
        ])

        chain = prompt | self.get_llm()
        response = chain.invoke({
            "feature_name": feature_name,
            "feature_summary": feature_summary,
            "commits": json.dumps(diff_context.get("commits", []), indent=2),
            "files": json.dumps(diff_context.get("files", []), indent=2)
        })

        content = response.content.strip()

        # Clean outer markdown wrapper fences if LLM wrapped entire markdown in ```markdown ... ```
        if content.startswith("```markdown"):
            content = content[11:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]

        return content.strip()
