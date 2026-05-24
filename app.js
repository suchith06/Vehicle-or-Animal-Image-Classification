// Global state
let model = null;
let selectedFile = null;

// Vehicle and Animal keywords for classification
const VEHICLE_KEYWORDS = [
    'car', 'truck', 'bus', 'van', 'taxi', 'motorcycle', 'scooter', 'bicycle',
    'airplane', 'helicopter', 'jet', 'train', 'locomotive', 'boat', 'ship',
    'yacht', 'canoe', 'bike', 'motorbike', 'auto', 'tractor', 'trailer',
    'police car', 'fire truck', 'ambulance', 'dump truck', 'pickup truck',
    'semi truck', 'delivery truck', 'minivan', 'suv', 'convertible', 'sedan',
    'coupe', 'hatchback', 'station wagon', 'limousine', 'hearse'
];

const ANIMAL_KEYWORDS = [
    'dog', 'cat', 'bird', 'horse', 'elephant', 'lion', 'tiger', 'bear',
    'rabbit', 'mouse', 'rat', 'squirrel', 'deer', 'cow', 'sheep', 'goat',
    'pig', 'fish', 'shark', 'whale', 'dolphin', 'penguin', 'eagle', 'owl',
    'parrot', 'snake', 'lizard', 'turtle', 'frog', 'toad', 'monkey', 'ape',
    'chimpanzee', 'gorilla', 'zebra', 'giraffe', 'rhinoceros', 'hippopotamus',
    'crocodile', 'alligator', 'beetle', 'butterfly', 'spider', 'ant', 'bee',
    'wasp', 'dragonfly', 'ladybug', 'puppy', 'kitten', 'calf', 'lamb', 'foal',
    'piglet', 'chick', 'duckling', 'gosling', 'kitten', 'pony', 'colt'
];

// Initialize the model when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await initializeModel();
    setupEventListeners();
});

// Load MobileNet model
async function initializeModel() {
    try {
        console.log('Loading MobileNet model...');
        model = await mobilenet.load();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        showValidationError('Failed to load classification model. Please refresh the page.');
    }
}

// Setup event listeners
function setupEventListeners() {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const classifyBtn = document.getElementById('classifyBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Click to upload
    uploadBox.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        handleFileSelect(e.dataTransfer.files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files);
    });

    // Classify button
    classifyBtn.addEventListener('click', classifyImage);

    // Reset button
    resetBtn.addEventListener('click', resetForm);
}

// Handle file selection
function handleFileSelect(files) {
    clearError();
    selectedFile = null;

    if (files.length === 0) {
        showValidationError('No file selected');
        return;
    }

    const file = files[0];

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showValidationError('Invalid file type. Please upload JPG or PNG image.');
        return;
    }

    // Validate file size (5 MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
        showValidationError(`File too large. Maximum size is 5 MB (your file: ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        return;
    }

    // File is valid
    selectedFile = file;
    displayPreview(file);
    enableClassifyButton();
}

// Display image preview
function displayPreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const previewImage = document.getElementById('previewImage');
        previewImage.src = e.target.result;
        
        const previewSection = document.getElementById('previewSection');
        previewSection.style.display = 'block';
        
        // Hide previous results
        document.getElementById('resultSection').style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

// Classify the image
async function classifyImage() {
    if (!selectedFile || !model) {
        showValidationError('Please select an image and wait for model to load');
        return;
    }

    // Show loading state
    const resultSection = document.getElementById('resultSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContainer = document.getElementById('resultContainer');
    
    resultSection.style.display = 'block';
    loadingIndicator.style.display = 'block';
    resultContainer.style.display = 'none';

    try {
        // Create image element for model
        const img = new Image();
        const reader = new FileReader();

        reader.onload = async (e) => {
            img.onload = async () => {
                try {
                    // Get predictions from MobileNet
                    const predictions = await model.classify(img);
                    
                    // Process predictions
                    const classification = classifyPredictions(predictions);
                    
                    // Display results
                    displayResults(predictions, classification);
                    
                    loadingIndicator.style.display = 'none';
                    resultContainer.style.display = 'block';
                    
                    // Show reset button
                    document.getElementById('classifyBtn').style.display = 'none';
                    document.getElementById('resetBtn').style.display = 'inline-block';
                    
                } catch (error) {
                    console.error('Classification error:', error);
                    showValidationError('Error during classification. Please try again.');
                    loadingIndicator.style.display = 'none';
                }
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
    } catch (error) {
        console.error('Error:', error);
        showValidationError('Error processing image. Please try again.');
        loadingIndicator.style.display = 'none';
    }
}

// Classify predictions as Vehicle, Animal, or Unknown
function classifyPredictions(predictions) {
    const topPrediction = predictions[0]?.className.toLowerCase() || '';
    
    // Check if top prediction matches vehicle keywords
    const isVehicle = VEHICLE_KEYWORDS.some(keyword => 
        topPrediction.includes(keyword)
    );
    
    if (isVehicle) {
        return {
            category: 'Vehicle',
            emoji: '🚗',
            className: 'vehicle',
            confidence: predictions[0].probability
        };
    }
    
    // Check if top prediction matches animal keywords
    const isAnimal = ANIMAL_KEYWORDS.some(keyword => 
        topPrediction.includes(keyword)
    );
    
    if (isAnimal) {
        return {
            category: 'Animal',
            emoji: '🐾',
            className: 'animal',
            confidence: predictions[0].probability
        };
    }
    
    // If neither, return Unknown
    return {
        category: 'Unknown',
        emoji: '❓',
        className: 'unknown',
        confidence: predictions[0].probability
    };
}

// Display classification results
function displayResults(predictions, classification) {
    // Main result
    const resultDiv = document.getElementById('classificationResult');
    resultDiv.innerHTML = `
        ${classification.emoji}<br>
        <span class="classification-label ${classification.className}">
            ${classification.category}
        </span>
    `;
    
    // Confidence score
    const confidenceDiv = document.getElementById('confidenceScore');
    const confidencePercent = (classification.confidence * 100).toFixed(1);
    confidenceDiv.innerHTML = `
        <strong>Confidence: ${confidencePercent}%</strong>
        <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
        </div>
    `;
    
    // Top 5 predictions
    const predictionsDiv = document.getElementById('allPredictions');
    const topPredictions = predictions.slice(0, 5);
    
    let predictionsHtml = '<h3>Top 5 Predictions</h3>';
    topPredictions.forEach((pred, index) => {
        const percentage = (pred.probability * 100).toFixed(1);
        predictionsHtml += `
            <div class="prediction-item">
                <span class="prediction-label">${index + 1}. ${pred.className}</span>
                <span class="prediction-confidence">${percentage}%</span>
            </div>
        `;
    });
    
    predictionsDiv.innerHTML = predictionsHtml;
}

// Enable classify button
function enableClassifyButton() {
    const classifyBtn = document.getElementById('classifyBtn');
    classifyBtn.disabled = false;
    classifyBtn.style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
}

// Disable classify button
function disableClassifyButton() {
    const classifyBtn = document.getElementById('classifyBtn');
    classifyBtn.disabled = true;
}

// Reset form
function resetForm() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('validationError').style.display = 'none';
    document.getElementById('classifyBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
    disableClassifyButton();
}

// Show validation error
function showValidationError(message) {
    const errorDiv = document.getElementById('validationError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Clear validation error
function clearError() {
    const errorDiv = document.getElementById('validationError');
    errorDiv.style.display = 'none';
}

