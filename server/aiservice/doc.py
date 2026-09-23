from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv


load_dotenv()

def committodoc(commit_message, filename, file_content):
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.2)

    prompt_template = PromptTemplate(
        input_variables=["commit_message", "filename", "file_content"],
        template="you are a great documentation writer. I have the {commit_message}, {filename} and the {file_content} of the user. Write a detailed documentation what changes have been done in the file and what is the purpose of the changes.",
    )

    name_chain = prompt_template | llm

    res = name_chain.invoke({"commit_message": commit_message, "filename": filename, "file_content": file_content})
    return res

if __name__ == "__main__":
    print(committodoc("Added a new feature to the application", "main.py", "def new_feature():\n    pass"))
