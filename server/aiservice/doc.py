import sys
from pathlib import Path

# Ensure root server path is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

from app.database.database import SessionLocal
from app.services.cache_service import CacheService

load_dotenv()


def committodoc(commit_message, filename, file_content):
    payload = {
        "commit_message": commit_message,
        "filename": filename,
        "file_content": file_content
    }
    prompt_hash = CacheService.compute_prompt_hash("committodoc", payload)

    db = SessionLocal()
    try:
        cached_ai = CacheService.get_ai_response(db, prompt_hash)
        if cached_ai:
            return cached_ai

        llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.2)

        prompt_template = PromptTemplate(
            input_variables=["commit_message", "filename", "file_content"],
            template="you are a great documentation writer. I have the {commit_message}, {filename} and the {file_content} of the user. Write a detailed documentation what changes have been done in the file and what is the purpose of the changes.",
        )

        name_chain = prompt_template | llm
        res = name_chain.invoke(payload)
        res_text = res.content if hasattr(res, "content") else str(res)

        CacheService.set_ai_response(
            db=db,
            prompt_hash=prompt_hash,
            prompt_type="committodoc",
            prompt_input=payload,
            response_text=res_text,
            model_name="gemini-3.5-flash"
        )
        return res
    finally:
        db.close()


if __name__ == "__main__":
    print(committodoc("Added a new feature to the application", "main.py", "def new_feature():\n    pass"))

