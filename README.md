# BiometricAttendence-Presence
Mini Project - Semester 4

## Features
- Facial Recognition for Attendance
- QR Code-based Attendance System
- GPS Location Tracking
- Liveness Detection
- Intuitive User Interface
- Secure Employee Registration

## Tech Stack
- Frontend: React.js with Material-UI
- Backend: Flask (Python)
- Database: MongoDB
- Face Recognition: face-recognition library with OpenCV
- Liveness Detection: OpenCV/PyTorch

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up MongoDB:
- Install MongoDB if not already installed
- Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/
```

4. Run the Flask server:
```bash
python app.py
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure
```
BiometricAttendence-Presence/
├── app.py                 # Flask backend main file
├── requirements.txt       # Python dependencies
├── frontend/
│   ├── package.json      # Node.js dependencies
│   └── src/
│       ├── App.js        # Main React component
│       └── components/
│           ├── FaceRecognition.js
│           ├── QRScanner.js
│           └── Registration.js
└── .env                  # Environment variables
```

## API Endpoints
- POST `/api/register` - Register new employee with facial data
- POST `/api/attendance/face` - Mark attendance using facial recognition
- POST `/api/attendance/qr` - Mark attendance using QR code

## Security Features
- Liveness detection to prevent spoofing
- GPS location verification
- Secure storage of biometric data
- QR code encryption
