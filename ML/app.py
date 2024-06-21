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

    img = Image.open(io.BytesIO(file.read()))

    results=model(img)
    detected_classes = []
    detected_class_names = []

    # Extract the detected classes from results
    for result in results:
        # Assuming result['class'] contains the class indices
        class_indices = result.boxes.cls.cpu().numpy()  # Modify this line based on the actual structure
        detected_classes.extend(class_indices)
    
    class_names = model.names

    # Print detected class indices and their corresponding names
    detected_class_names = [class_names[int(cls)] for cls in detected_classes]
    print("Detected classes (indices):", detected_classes)
    print("Detected class names:", detected_class_names)

    return jsonify(detected_class_names)


@app.route("/", methods=['GET'])
def hello():
    return jsonify("Systems are working")


if __name__ == '__main__':
    app.run(debug=True)
