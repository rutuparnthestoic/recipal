#main python file

from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import uuid
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
model_folder = "./recipal"
tokenizer = AutoTokenizer.from_pretrained(model_folder)
model = AutoModelForCausalLM.from_pretrained(model_folder, torch_dtype=torch.float16)
model = model.to("cuda" if torch.cuda.is_available() else "cpu")  # Use GPU if available

# In-memory storage for recipes (use a database in production)
recipes_storage = {}

# Helper function to create prompt
def create_prompt(ingredients, protein, fat, carbs, texture, taste, cholesterol, calories):
    # Format the input prompt with the additional information
    ingredients = ', '.join([x.strip().lower() for x in ingredients.split(',')])
    s = (f"<|startoftext|>Ingredients:\n{ingredients}\n"
         f"Protein Level: {protein}\n"
         f"Fat Level: {fat}\n"
         f"Carbohydrate Level: {carbs}\n"
         f"Texture: {texture}\n"
         f"Taste: {taste}\n"
         f"Cholesterol: {cholesterol}\n"
         f"Calories: {calories}\n" 
         )
    return s

# Define a route for generating and storing a recipe
@app.route('/api/generate', methods=['POST'])
def generate_recipe():
    data = request.json  # Get data sent by the client
    ingredients = data.get("ingredients")
    protein = data.get("protein")
    fat = data.get("fat")
    carbs = data.get("carbs")
    texture = data.get("texture")
    taste = data.get("taste")
    cholesterol = data.get("cholesterol")
    calories = data.get("calories")

    # Check for missing parameters
    if not all([ingredients, protein, fat, carbs, texture, taste]):
        return jsonify({"error": "Missing one or more required fields"}), 400

    # Create the prompt for the model
    prompt = create_prompt(ingredients, protein, fat, carbs, texture, taste, cholesterol, calories)

    # Generate recipe instructions with attention mask
    inputs = tokenizer(prompt, return_tensors="pt", padding=True).to(model.device)
    attention_mask = inputs['attention_mask']  # Set attention mask explicitly
    output = model.generate(
        inputs['input_ids'],
        attention_mask=attention_mask,
        max_length=512,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    # Extract the generated recipe details
    recipe_text = generated_text.replace(prompt, "").strip()  # Clean up the output
    recipe_id = str(uuid.uuid4())  # Generate a unique ID for the recipe

    # Store the recipe in memory
    recipes_storage[recipe_id] = {
        "id": recipe_id,
        "ingredients": ingredients,
        "protein": protein,
        "fat": fat,
        "carbs": carbs,
        "texture": texture,
        "taste": taste,
        "cholesterol": cholesterol,
        "calories": calories,
        "instructions": recipe_text
    }

    # Return the recipe ID to the frontend
    return jsonify({"id": recipe_id}), 201

# Define a route to retrieve a recipe by ID
@app.route('/api/recipe/<string:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = recipes_storage.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe)

if __name__ == '__main__':
    app.run(debug=True)
# Recipal
