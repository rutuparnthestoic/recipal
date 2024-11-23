from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import uuid
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

model_folder = "./recipal"
tokenizer = AutoTokenizer.from_pretrained(model_folder)
model = AutoModelForCausalLM.from_pretrained(model_folder, torch_dtype=torch.float16)
model = model.to("cuda" if torch.cuda.is_available() else "cpu")

yolo_model_path = './yolo/best.pt'
yolo_model = YOLO(yolo_model_path)

recipes_storage = {}

def create_prompt(ingredients, protein, fat, carbs, texture, taste, cholesterol, calories):
    ingredients = ', '.join([x.strip().lower() for x in ingredients.split(',')])
    s = (f"<|startoftext|>Ingredients:\n{ingredients}\n"
         f"Protein Level: {protein}\n"
         f"Fat Level: {fat}\n"
         f"Carbohydrate Level: {carbs}\n"
         f"Texture: {texture}\n"
         f"Taste: {taste}\n"
         f"Cholesterol: {cholesterol}\n"
         f"Calories: {calories}\n")
    return s

@app.route('/api/detect-ingredients', methods=['POST'])
def detect_ingredients():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files['image']
    image_bytes = image_file.read()

    image_np = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    results = yolo_model(image)

    detected_ingredients = set()
    for result in results:
        for box in result.boxes:
            ingredient_class_id = int(box.cls)
            ingredient_name = yolo_model.names[ingredient_class_id]
            detected_ingredients.add(ingredient_name)

    return jsonify({"detected_ingredients": list(detected_ingredients)}), 200

@app.route('/api/generate', methods=['POST'])
def generate_recipe():
    data = request.json
    ingredients = data.get("ingredients")
    protein = data.get("protein")
    fat = data.get("fat")
    carbs = data.get("carbs")
    texture = data.get("texture")
    taste = data.get("taste")
    cholesterol = data.get("cholesterol")
    calories = data.get("calories")

    if not all([ingredients, protein, fat, carbs, texture, taste]):
        return jsonify({"error": "Missing one or more required fields"}), 400

    prompt = create_prompt(ingredients, protein, fat, carbs, texture, taste, cholesterol, calories)

    inputs = tokenizer(prompt, return_tensors="pt", padding=True).to(model.device)
    attention_mask = inputs['attention_mask']
    output = model.generate(
        inputs['input_ids'],
        attention_mask=attention_mask,
        max_length=512,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)

    recipe_text = generated_text.replace(prompt, "").strip()
    recipe_id = str(uuid.uuid4())

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

    return jsonify({"id": recipe_id}), 201

@app.route('/api/recipe/<string:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = recipes_storage.get(recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe)

if __name__ == '__main__':
    app.run(debug=True)
