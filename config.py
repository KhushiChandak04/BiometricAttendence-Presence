import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    MONGODB_URI = os.getenv('MONGODB_URI')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'attendance_db')
    
    # Collections
    USERS_COLLECTION = 'users'
    ATTENDANCE_COLLECTION = 'attendance'
    
    # Face Recognition Settings
    FACE_RECOGNITION_THRESHOLD = float(os.getenv('FACE_RECOGNITION_THRESHOLD', 0.6))
    
    # QR Code Settings
    QR_CODE_EXPIRY_MINUTES = int(os.getenv('QR_CODE_EXPIRY_MINUTES', 5))
    
    # Security
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')  # Change in production
    
    # API Settings
    CORS_ORIGINS = ['http://localhost:3000']  # Add more origins as needed
