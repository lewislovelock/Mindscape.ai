import google.generativeai as genai
import os
from dotenv import load_dotenv
from mistralai import Mistral
from typing import List, Dict
from enum import Enum
from app.config.therapist_config import THERAPISTS

# Load environment variables
load_dotenv()

# Configure APIs
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
mistral_client = Mistral(api_key=os.getenv('MISTRAL_API_KEY'))

class ModelType(Enum):
    GEMINI = "gemini"
    MISTRAL = "mistral"

class AIChat:
    def __init__(self, model_type: ModelType = ModelType.MISTRAL, therapist_name: str = "janet"):
        self.model_type = model_type
        self.history: List[Dict[str, str]] = []
        self.therapist = THERAPISTS[therapist_name]
        
        if model_type == ModelType.GEMINI:
            self.model = genai.GenerativeModel('gemini-pro')
            self.chat = self.model.start_chat(history=[])
        elif model_type == ModelType.MISTRAL:
            self.model = "pixtral-12b-2409"  # or "mistral-small", "mistral-large"

        # Initialize chat with therapist system prompt
        self.history.append({
            "role": "system",
            "content": self.therapist.system_prompt
        })

    async def send_message(self, message: str):
        if self.model_type == ModelType.GEMINI:
            return await self._send_gemini_message(message)
        else:
            return await self._send_mistral_message(message)

    async def _send_gemini_message(self, message: str):
        response = self.chat.send_message(message, stream=True)
        
        full_response = ""
        for chunk in response:
            print(chunk.text, end="", flush=True)
            full_response += chunk.text
        
        print("\n")
        return full_response

    async def _send_mistral_message(self, message: str):
        mistral_messages = []
        for msg in self.history:
            mistral_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        mistral_messages.append({
            "role": "user",
            "content": message
        })
        
        stream = mistral_client.chat.stream(
            model=self.model,
            messages=mistral_messages,
        )

        full_response = ""
        for chunk in stream:
            if chunk.data.choices[0].delta.content:
                content = chunk.data.choices[0].delta.content
                print(content, end="", flush=True)
                full_response += content

        print("\n")
        
        self.history.append({"role": "user", "content": message})
        self.history.append({"role": "assistant", "content": full_response})
        
        return full_response

    def get_chat_history(self):
        if self.model_type == ModelType.GEMINI:
            return self.chat.history
        return self.history

    def switch_model(self, model_type: ModelType):
        self.model_type = model_type
        self.history = []
        if model_type == ModelType.GEMINI:
            self.model = genai.GenerativeModel('gemini-pro')
            self.chat = self.model.start_chat(history=[])
        elif model_type == ModelType.MISTRAL:
            self.model = "pixtral-12b-2409"

def main():
    print("Welcome to AI Therapy Chat! Available therapists:")
    for key, therapist in THERAPISTS.items():
        print(f"- {therapist.name} ({key}): {therapist.description}")
    
    therapist_choice = input("\nChoose your therapist (janet/sanchez/sophia): ").lower()
    while therapist_choice not in THERAPISTS:
        therapist_choice = input("Invalid choice. Please choose janet/sanchez/sophia: ").lower()
    
    chat = AIChat(therapist_name=therapist_choice)
    
    print(f"\nNow chatting with {THERAPISTS[therapist_choice].name}")
    print("Commands:")
    print("- Type 'quit' to exit")
    print("- Type 'switch' to toggle between Gemini and Mistral")
    print("- Type 'model' to see current model")
    print("- Type 'therapist' to switch therapists")
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'quit':
            break
        elif user_input.lower() == 'switch':
            new_model = ModelType.MISTRAL if chat.model_type == ModelType.GEMINI else ModelType.GEMINI
            chat.switch_model(new_model)
            print(f"Switched to {new_model.value}")
            continue
        elif user_input.lower() == 'model':
            print(f"Current model: {chat.model_type.value}")
            continue
        elif user_input.lower() == 'therapist':
            therapist_choice = input("Choose your therapist (janet/sanchez/sophia): ").lower()
            while therapist_choice not in THERAPISTS:
                therapist_choice = input("Invalid choice. Please choose janet/sanchez/sophia: ").lower()
            chat = AIChat(chat.model_type, therapist_choice)
            print(f"\nNow chatting with {THERAPISTS[therapist_choice].name}")
            continue
        
        try:
            import asyncio
            response = asyncio.run(chat.send_message(user_input))
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()