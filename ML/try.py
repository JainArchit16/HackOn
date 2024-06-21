from ultralytics import YOLO

# Load the model
model = YOLO("best.pt")

# Define the source image and the save directory
source_image = "WhatsApp Image 2024-06-17 at 19.10.56_4d2b3ac8.jpg"
save_directory = "./new"

# Perform the detection and save the results
results = model(source=source_image, save=True, save_dir=save_directory, show=True)
print(results)
