from flask import Flask, render_template, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)

# Load the trained CNN model
model = load_model('model.h5')

# Define class labels
class_labels = ["Class 0", "Class 1", "Class 2"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    try:
        # Process the image
        img = Image.open(file)
        img = img.resize((255, 255))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        # Make prediction
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions)

        result = {'class': int(predicted_class), 'label': int(predicted_class)}

        return jsonify(result)

    except Exception as e:
        # Log any exceptions for debugging purposes
        print(f'Error predicting class: {e}')
        return jsonify({'error': 'Failed to predict class'})

if __name__ == '__main__':
    app.run(debug=True)
