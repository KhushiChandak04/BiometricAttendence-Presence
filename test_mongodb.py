from pymongo import MongoClient, ASCENDING, DESCENDING
from dotenv import load_dotenv
import os
from config import Config
import requests
import json
import base64
import numpy as np
from datetime import datetime
import cv2

def initialize_database():
    try:
        # Load environment variables
        load_dotenv()
        
        # Get MongoDB URI from environment
        mongodb_uri = Config.MONGODB_URI
        
        if not mongodb_uri:
            print("Error: MONGODB_URI not found in .env file")
            return False
            
        # Create MongoDB client
        client = MongoClient(mongodb_uri)
        
        # Test connection by accessing server info
        server_info = client.server_info()
        print("Successfully connected to MongoDB Atlas!")
        print(f"Server version: {server_info.get('version', 'unknown')}")
        
        # Initialize database
        db = client[Config.DATABASE_NAME]
        print(f"\nInitializing database: {Config.DATABASE_NAME}")
        
        # Initialize Users Collection
        users_collection = db[Config.USERS_COLLECTION]
        
        # Create unique index on employee_id
        users_collection.create_index('employee_id', unique=True)
        print(f"Created unique index on {Config.USERS_COLLECTION}.employee_id")
        
        # Initialize Attendance Collection
        attendance_collection = db[Config.ATTENDANCE_COLLECTION]
        
        # Create compound index for efficient queries
        attendance_collection.create_index([
            ('employee_id', ASCENDING),
            ('timestamp', DESCENDING)
        ])
        print(f"Created compound index on {Config.ATTENDANCE_COLLECTION} (employee_id, timestamp)")
        
        return True
        
    except Exception as e:
        print(f"Error during database initialization: {e}")
        return False

def test_api_endpoints():
    base_url = "http://localhost:5000"
    
    try:
        print("\nTesting API Endpoints...")
        cd frontend
        npm install @material-ui/core @material-ui/icons react-webcam react-qr-reader axios react-router-domcd frontend
        npm install @material-ui/core @material-ui/icons react-webcam react-qr-reader axios react-router-dom
        # Test 1: Register a new user
        print("\n1. Testing User Registration...")
        # Create a dummy face image (black square)
        dummy_image = np.zeros((100, 100), dtype=np.uint8)
        _, buffer = cv2.imencode('.jpg', dummy_image)
        base64_image = base64.b64encode(buffer).decode('utf-8')
        
        register_data = {
            "name": "Test User",
            "employee_id": "TEST456",
            "face_image": f"data:image/jpeg;base64,{base64_image}"
        }
        
        response = requests.post(
            f"{base_url}/api/register",
            json=register_data
        )
        
        if response.status_code == 201:
            print(" User registration successful")
        else:
            print(f" User registration failed: {response.json()}")
            
        # Test 2: Mark attendance with face
        print("\n2. Testing Face Attendance...")
        attendance_data = {
            "face_image": f"data:image/jpeg;base64,{base64_image}",
            "location": {
                "latitude": 37.7749,
                "longitude": -122.4194
            }
        }
        
        response = requests.post(
            f"{base_url}/api/attendance/face",
            json=attendance_data
        )
        
        if response.status_code == 200:
            print(" Face attendance marking successful")
            print(f"Response: {response.json()}")
        else:
            print(f" Face attendance marking failed: {response.json()}")
            
        # Test 3: Mark attendance with QR code
        print("\n3. Testing QR Attendance...")
        qr_data = {
            "qr_data": {
                "employee_id": "TEST456",
                "timestamp": datetime.now().isoformat()
            },
            "location": {
                "latitude": 37.7749,
                "longitude": -122.4194
            }
        }
        
        response = requests.post(
            f"{base_url}/api/attendance/qr",
            json=qr_data
        )
        
        if response.status_code == 200:
            print(" QR attendance marking successful")
            print(f"Response: {response.json()}")
        else:
            print(f" QR attendance marking failed: {response.json()}")
            
        print("\nAPI Testing completed!")
        return True
        
    except Exception as e:
        print(f"Error during API testing: {e}")
        return False

if __name__ == "__main__":
    # First initialize the database
    if initialize_database():
        print("\nDatabase initialization successful!")
        
        # Then test the API endpoints
        print("\nStarting API endpoint tests...")
        print("Make sure your Flask server is running on http://localhost:5000")
        input("Press Enter to continue with API testing...")
        
        if test_api_endpoints():
            print("\nAll tests completed successfully!")
        else:
            print("\nSome tests failed. Check the error messages above.")
    else:
        print("\nDatabase initialization failed. Please check your MongoDB connection.")
