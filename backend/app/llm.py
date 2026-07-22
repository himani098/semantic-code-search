import os
import traceback
from dotenv import load_dotenv
from google import genai

load_dotenv(override=True)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Stores answers for repeated questions
cache = {}

def generate_answer(question, code_chunks):

        # Check if we already answered this question
    if question in cache:
        print("Returning answer from cache...")
        return cache[question]
    
    context = "\n\n---\n\n".join(
        f"File: {c['file']} (function/class: {c['name']}, line {c['start_line']})\n```python\n{c['code']}\n```"
        for c in code_chunks
    )

    prompt = f"""
You are an expert software engineer.

Answer the user's question using ONLY the code snippets below.

Always mention the file name and function/class.

If the answer is not present, say:
'I could not find the answer in the indexed repository.'

CODE:
{context}

QUESTION:
{question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        print("===== GEMINI RESPONSE =====")
        print(response)
        print("===========================")

        answer = response.text

# Save answer for future use
        cache[question] = answer

        return answer

    except Exception:
        traceback.print_exc()
        raise