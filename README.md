
# Vehicle & Animal Classifier

It is a web application that analyses the uploaded images and classify the image to 3 categories: Vehicles (Cars, Trucks, Planes Boats), Animals (Dogs, Cats, Birds, Elephants) or Unknown (for the objects on either of the categories). User can simply drag and drop the images or upload JPG/PNG image (upto 5MB) without backend server requirements . Then the application instantly displays the classification with confidence score and top 5 Predicted labels.

## Quick Links

- **Live Demo**: https://suchith06.github.io/Vehicle-or-Animal-Image-Classification/
- **GitHub Repository**: https://github.com/suchith06/Vehicle-or-Animal-Image-Classification.git

## What It Does

Upload an image (JPG or PNG), and the app will analyze it and classify the main object as:
- **🚗 Vehicle**: Cars, trucks, motorcycles, planes, boats, etc.
- **🐾 Animal**: Dogs, cats, birds, elephants, etc.
- **❓ Unknown**: Objects that don't fit the above categories

The app displays a confidence score and the top 5 predicted labels from the underlying model.

## How to run locally.
1.	Directly open file - index.html
2.	Python server (after changing the directory) – python -m http.sever 8000
3.	Node.js servers – 
npm install -g http-server 
http-server

## How the classification works?
Model: MobileNet v2 via TensorFlow.js
Steps to follow:
1.	Upload the image 
- a.	Type: JPG/PNG
- b.	Size: 5MB
2.	Model Interference
- MobileNetv2 analyses image, output 1000 class predictions
3.	Post- processing
- App maps prediction to Vehicle/Animal/Unknown using keyword matching.
4.	Results
- it shows category, confidence % and top 5 predictions.

## How to test it
Test Case 1: Vehicle Classification
•	Upload: Car, truck, motorcycle, or airplane
•	Expected:  Vehicle (70-95% confidence)
•	Check: Top 5 predictions show vehicle types
Test Case 2: Animal Classification
•	Upload: Dog, cat, bird, horse, or elephant
•	Expected: Animal (70-95% confidence)
•	Check: Breed/type shown in predictions
Test Case 3: Unknown Classification
•	Upload: Furniture, food, person, or building
•	Expected: Unknown classification
•	Check: App handles gracefully, no crashes


## Known Limitations
**Model Limitations:**
1.	ImageNet Bias - Only recognizes 1,000 classes from training data
2.	Single Object - Only classifies dominant object, not multiple objects
3.	Small/Distant Objects - May not recognize tiny or far-away objects
4.	Novel Objects - Rare items not in training may fail
5.	Unreliable Confidence - 85% ≠ 85% chance of correctness
**Application Limitations:**
1.	No GPU - CPU only, slower on older devices (1-5 seconds)
2.	File Size: 5 MB Max - Prevents huge files
3.	JPG/PNG Only - No GIF, WebP, BMP
4.	Needs Internet - For first load only (model cached after)
5.	No Storage - Images not saved
6.	Not Customizable - Can't retrain model
7.	Resolution - Very high-res images (8000+ px) may be slow
**Edge Cases:**
•	Toy vehicles → Often classified as Unknown
•	Horse carriages → Could be Vehicle or Animal (ambiguous)
•	Drawings/cartoons → Often classified as Unknown
•	Stuffed animals → Classified as Unknown (sees toy, not animal)

## Approximate hours spent:
2.5 hours to 3 hours



## Whether you used AI coding tools.
Tool: Claude AI (Anthropic)
Used For:
- Architecture design recommendations.
- HTML/CSS/JavaScript code generation (~80% of code)
- Comprehensive documentation (~80% of docs) for referance.
- Testing strategy development.

## How to Run Locally

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server setup required


## How Classification Works

### Model Architecture
The app uses **MobileNet v2**, a lightweight pre-trained convolutional neural network trained on the ImageNet dataset (1,000+ object classes).

**Why MobileNet v2?**
- Lightweight (~100MB) and optimized for browser execution
- Fast inference (~1-2 seconds per image)
- Good accuracy on general object recognition
- Works entirely in-browser; no backend server required
