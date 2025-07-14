# Veesure AI Alternative Finder

## Overview
Veesure is an AI-powered alternative finder application that helps users discover intelligent alternatives for any product with comprehensive analysis. The application uses Google's Gemini AI service to analyze products and provide detailed information about alternatives, including pricing, availability, and performance metrics specifically focused on the Indian market.

## Features
- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent product analysis
- **Real-time Pricing**: Shows current pricing in Indian Rupees (INR)
- **Detailed Comparisons**: Side-by-side comparison of original vs alternative products
- **Indian Market Focus**: Specialized for the Indian market with local pricing and availability
- **Modern UI**: Beautiful, responsive design with animated water-like background
- **Comprehensive Analysis**: Includes performance, compatibility, cost, and availability analysis

## Installation

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)

### Setup Instructions

1. **Extract the zip file** and navigate to the project directory:
   ```bash
   cd veesure-ai-alternative-finder
   ```

2. **Install required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

4. **Set the environment variable**:
   
   **On Windows:**
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```
   
   **On Mac/Linux:**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the application**:
   ```bash
   python main.py
   ```

6. **Open your web browser** and go to:
   ```
   http://localhost:5000
   ```

## Usage

1. **Enter a Product Name**: Type any product name in the search box (e.g., "iPhone 15", "Samsung TV", "Honda City")

2. **Get Alternatives**: Click "Find Alternatives" to see AI-powered alternative suggestions

3. **View Details**: See comprehensive information about the original product including:
   - Description and usage
   - Price in Indian Rupees
   - Availability status
   - Performance metrics
   - Category information

4. **Explore Alternatives**: Browse through creative alternative suggestions with:
   - Product names and descriptions
   - Category classifications
   - Pricing information
   - Availability status
   - Performance ratings
   - Compatibility information

5. **Compare Products**: Click on any alternative to see a detailed comparison including:
   - Side-by-side comparison
   - Pros and cons of each product
   - Performance scores
   - Cost analysis
   - Availability comparison
   - Compatibility analysis
   - Expert recommendation

## Technical Architecture

### Backend
- **Framework**: Flask (Python)
- **AI Service**: Google Gemini AI API
- **API Design**: RESTful endpoints with JSON responses

### Frontend
- **Framework**: Vanilla HTML/CSS/JavaScript with Bootstrap 5.3.0
- **Styling**: Modern CSS with custom properties and animations
- **Icons**: Font Awesome 6.4.0

### Key Components
- `app.py`: Main Flask application with route handlers
- `gemini_service.py`: AI service wrapper for Gemini API
- `main.py`: Application entry point
- `templates/index.html`: Main HTML template
- `static/css/style.css`: Custom styling
- `static/js/script.js`: Frontend JavaScript functionality

## API Endpoints

- `GET /`: Main application interface
- `POST /api/search`: Search for products and get alternatives
- `POST /api/compare`: Compare original items with alternatives

## Project Structure
```
veesure-ai-alternative-finder/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── gemini_service.py     # AI service integration
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html       # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css    # Custom styling
│   └── js/
│       └── script.js    # Frontend JavaScript
└── README.md            # This file
```

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Make sure you've set the GEMINI_API_KEY environment variable
   - Restart your terminal/command prompt after setting the variable

2. **"Failed to search for alternatives"**
   - Check your internet connection
   - Verify your API key is valid
   - Try again with a different search term

3. **Application not loading**
   - Make sure Python 3.11+ is installed
   - Check if all dependencies are installed correctly
   - Verify the application is running on port 5000

### Getting Help

If you encounter any issues:
1. Check the console/terminal for error messages
2. Verify your API key is correct
3. Ensure all dependencies are properly installed
4. Try restarting the application

## License

This project is for educational and personal use. Please respect API usage limits and terms of service for Google Gemini AI.

## Credits

- **AI Service**: Google Gemini AI
- **UI Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Montserrat)