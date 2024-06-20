from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io

app = Flask(__name__)

# Load your model
model = YOLO("best.pt")

@app.route('/predict', methods=['POST'])
def predict():
    # print(request)
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No image provided'}), 400
    
    # Open the image file
    img = Image.open(io.BytesIO(file.read()))
    
    # Run the model
    results = model(img, show=True)
    
    # Extract results (you might need to adjust this based on your model's output format)
    # data = {
    #     'predictions': results.pandas().xyxy[0].to_dict(orient='records')
    # }
    print(results)
    return jsonify("hello")
    # return jsonify(data)

@app.route("/",methods=['GET'])
def hello():
    return jsonify("Systems are working")

if __name__ == '__main__':
    app.run(debug=True)
