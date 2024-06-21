from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
import os

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

    # output_dir = './output/'
    # if not os.path.exists(output_dir):
    #     os.makedirs(output_dir)

    # Open the image file
    img = Image.open(io.BytesIO(file.read()))

    # Save the image to a file
    # img.save(output_dir + 'output.png', format="PNG")
    # Extract results (you might need to adjust this based on your model's output format)
    # data = {
    #     'predictions': results.pandas().xyxy[0].to_dict(orient='records')
    # }
    results=model(img,show="true")
    print(results)
    return jsonify("hello")
    # return jsonify(data)


@app.route("/", methods=['GET'])
def hello():
    return jsonify("Systems are working")


if __name__ == '__main__':
    app.run(debug=True)
