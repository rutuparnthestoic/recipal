# Recipal : An AI based multi-modal recipe generator

## Tech Stack
- Frontend : Next JS 14, Tailwind CSS, ShadCN ui.
- Backend : Flask

- Model : PyTorch, Hugging face Transformers, GPT2

## How to use
- Clone the repository using the link or downloading the files.
- Download the model weights (the whole folder of recipal) and paste it in backend folder.

- Download the model weights from here : [Link to the folder](https://drive.google.com/drive/folders/1yHe6-X7dqlWPm4kjVgbnbOjxyGTwy1Y6?usp=sharing) 
- You can also visit the training code here : [Kaggle Code](https://www.kaggle.com/code/rithvik5151/recipal-final-code)
- You can also visit the training YOLO code here :[Kaggle Code](https://www.kaggle.com/code/saamyagupta/ingredients-cv-model)
- Run the backend server by ```python3 app.py ```
- Run the frontend Next JS app by ```npm run dev```
- This project internally uses Stable Diffusion's Text to Image API. Get your own API key and replace in the following file : ```frontend/app/recipe/[id]/page.tsx``` for the application to run properly.



## Contact us
- For any issue, feel free to email me : rithvikthestoic@gmail.com
