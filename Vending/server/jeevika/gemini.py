import google.generativeai as genai
import os
from dotenv import load_dotenv
genai.configure(api_key= os.environ.get('GEMINI_API'))
model = genai.GenerativeModel('gemini-1.5-pro-002')
# Set your OpenAI API key

# Define the prompt
def getReport(temp,oxygen,heart):
    tempF = (temp * 9)/5 + 32
    # prompt = f"give a health report for me with {heart} bpm heart rate , {oxygen} percent oxygen level and {tempF} F body temperature"
    prompt = f"give a health report for me with assessment of my vitals such as {heart} bpm heart rate , {oxygen} percent oxygen level and {tempF} F body temperature with health recommendations , analysis and a follow up."
    response = model.generate_content(prompt)
    # Call the completion endpoint
    # print(response.text)
    # Print the generated text
    return response.text
