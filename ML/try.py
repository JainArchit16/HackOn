from ultralytics import YOLO

# Load the model
model = YOLO("best.pt")

# Define the source image and the save directory
source_image = "IMG-20240619-WA0034.jpg"
save_directory = "./new"

# Perform the detection and save the results
results = model(source=source_image, save=True, save_dir=save_directory, show=True)
print(results)
