import os
import json
from dotenv import load_dotenv

# LangChain
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.tools import tool
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage

# LangGraph store
from langgraph.store.memory import InMemoryStore

# Pydantic V1
from pydantic.v1 import BaseModel, Field
from typing import List

# -----------------------------
# Load .env
# -----------------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY missing! Add it to .env")

# -----------------------------
# LLM + Embeddings
# -----------------------------
llm = ChatGroq(
    temperature=0,
    groq_api_key=GROQ_API_KEY,
    model_name="openai/gpt-oss-20b"
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -----------------------------
# Load ChromaDB
# -----------------------------
DB_PATH = "./chroma_db"
vector_db = Chroma(
    persist_directory=DB_PATH,
    embedding_function=embeddings
)
retriever = vector_db.as_retriever(search_kwargs={"k": 5})

# -----------------------------
# Pydantic Models
# -----------------------------
class MoodAnalysis(BaseModel):
    mood_level: int = Field(..., ge=1, le=10)
    emotional_topics: List[str]
    student_status: str

class ChatResponse(BaseModel):
    response: str
    mood_data: MoodAnalysis

# -----------------------------
# Tools
# -----------------------------
store = InMemoryStore()

@tool
def save_student_mood_profile(student_id: str, mood_entry: dict) -> str:
    """Store the user's mood entry."""
    existing = store.get(("students",), student_id)
    profile = existing.value if existing else {"mood_history": []}
    profile["mood_history"].append(mood_entry)
    store.put(("students",), student_id, profile)
    return "Mood saved."

@tool
def retrieval_tool(query: str) -> str:
    """Retrieve relevant docs."""
    docs = retriever.invoke(query)
    return "\n\n".join([d.page_content for d in docs])

tools = [save_student_mood_profile, retrieval_tool]

# -----------------------------
# System Prompt
# -----------------------------
system_prompt = """
You are a compassionate Mental Health Chatbot.

Your final output MUST be a valid JSON matching:

{
  "response": "...",
  "mood_data": {
      "mood_level": 1-10,
      "emotional_topics": [],
      "student_status": "struggling/managing/thriving"
  }
}
"""

# -----------------------------
# Agent
# -----------------------------
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=system_prompt
)

# -----------------------------
# Main Function
# -----------------------------
def chat(query: str, user_id="student_1"):
    """Send user message to agent and return JSON response."""
    result = agent.invoke(
        {"messages": [HumanMessage(content=query)]},
        {"store": store, "configurable": {"user_id": user_id}}
    )

    # Extract last AI message
    final_msg = None
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage):
            final_msg = msg.content
            break

    # Extract JSON
    if "```json" in final_msg:
        start = final_msg.find("```json") + 7
        end = final_msg.find("```", start)
        json_block = final_msg[start:end].strip()
    else:
        json_block = final_msg.strip()

    try:
        data = json.loads(json_block)
        parsed = ChatResponse(**data)
        return parsed.dict()

    except Exception as e:
        return {"error": "Invalid JSON from model", "raw": final_msg}


if __name__ == "__main__":
    print("Chatbot loaded. Type 'exit' to quit.")
    while True:
        q = input("You: ")
        if q == "exit":
            break
        print("Bot:", chat(q))
