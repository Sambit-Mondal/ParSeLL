from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import TradeBot
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

bot = TradeBot()

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    if not user_input:
        return jsonify({'error': 'No input provided'}), 400
    
    response = bot.get_response(user_input)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(port=5000, debug=True)