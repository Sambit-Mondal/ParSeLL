import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

class TradeBot:
    def __init__(self):
        groq_api_key = os.getenv("NEXT_APP_GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("NEXT_APP_GROQ_API_KEY environment variable is not set.")
        self.client = Groq(api_key=groq_api_key)
        self.messages = [{"role": "system", "content": "You are a trade expert named as ParsX. Answer queries related to trade, import, and export. And don't answer any other questions out of context and keep the answer limited to 100words and keep it in bullets if possible."}] 

    def get_response(self, user_input):
        self.messages.append({"role": "user", "content": user_input})
        try:
            completion = self.client.chat.completions.create(
                model="llama3-8b-8192",
                messages=self.messages,
                temperature=1,
                max_tokens=1024,
                top_p=1,
                stream=False,
                stop=None,
            )
            if hasattr(completion, 'choices') and completion.choices:
                reply = completion.choices[0].message.content
                self.messages.append({"role": "assistant", "content": reply})
                return reply
            else:
                return "I couldn't fetch a response. Please try again."
        except Exception as e:
            return f"An error occurred: {str(e)}"

def chatbot():
    bot = TradeBot()
    print("TradeBot: Welcome! I can answer your queries related to trade, import, and export.")
    print("Type 'exit' to end the chat.\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("TradeBot: Goodbye! Have a great day!")
            break
        response = bot.get_response(user_input)
        print(f"TradeBot: {response}")

if __name__ == "__main__":
    chatbot()