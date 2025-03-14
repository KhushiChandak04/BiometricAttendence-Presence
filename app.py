from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import cv2
import numpy as np
from datetime import datetime
import qrcode
from geopy.geocoders import Nominatim
import base64
from config import Config

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection
try:
    client = MongoClient(Config.MONGODB_URI)
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
    db = client[Config.DATABASE_NAME]
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {e}")
    raise

# Collections
users_collection = db[Config.USERS_COLLECTION]
attendance_collection = db[Config.ATTENDANCE_COLLECTION]

# Initialize face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def process_face_image(image_data):
    try:
        # Convert base64 image to numpy array
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return None
            
        # Get the largest face
        largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
        x, y, w, h = largest_face
        
        # Extract face encoding (simple feature vector for demo)
        face_img = gray[y:y+h, x:x+w]
        face_img = cv2.resize(face_img, (100, 100))
        face_encoding = face_img.flatten().tolist()
        
        return face_encoding
        
    except Exception as e:
        print(f"Error processing face image: {e}")
        return None

def verify_liveness(image_data):
    try:
        # Basic liveness detection (presence of face)
        face_encoding = process_face_image(image_data)
        return face_encoding is not None
    except:
        return False

def compare_faces(known_encoding, new_encoding, tolerance=0.6):
    if not known_encoding or not new_encoding:
        return False
    # Simple Euclidean distance comparison
    known_array = np.array(known_encoding)
    new_array = np.array(new_encoding)
    distance = np.linalg.norm(known_array - new_array)
    return distance < tolerance * len(known_array)

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        image_data = data.get('face_image')
        face_encoding = process_face_image(image_data)
        
        if not face_encoding:
            return jsonify({'error': 'No face detected in image'}), 400
            
        user_data = {
            'name': data.get('name'),
            'employee_id': data.get('employee_id'),
            'face_encoding': face_encoding,
            'created_at': datetime.now()
        }
        
        # Check if employee_id already exists
        if users_collection.find_one({'employee_id': user_data['employee_id']}):
            return jsonify({'error': 'Employee ID already exists'}), 400
            
        result = users_collection.insert_one(user_data)
        return jsonify({'message': 'User registered successfully', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/attendance/face', methods=['POST'])
def mark_attendance_face():
    try:
        data = request.get_json()
        image_data = data.get('face_image')
        location = data.get('location')
        
        # Verify liveness
        if not verify_liveness(image_data):
            return jsonify({'error': 'Liveness check failed'}), 400

        # Process face recognition
        face_encoding = process_face_image(image_data)
        if not face_encoding:
            return jsonify({'error': 'No face detected in image'}), 400
            
        # Find matching user
        users = users_collection.find({})
        matched_user = None
        
        for user in users:
            if compare_faces(user.get('face_encoding'), face_encoding):
                matched_user = user
                break
        
        if matched_user:
            attendance_record = create_attendance_record(matched_user['employee_id'], 'face', location)
            return jsonify({
                'message': 'Attendance marked successfully',
                'employee_name': matched_user.get('name'),
                'timestamp': attendance_record['timestamp']
            }), 200
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Face attendance error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/attendance/qr', methods=['POST'])
def mark_attendance_qr():
    try:
        data = request.get_json()
        qr_data = data.get('qr_data')
        location = data.get('location')
        
        # Verify QR code and user
        employee_id = verify_qr_code(qr_data)
        if employee_id:
            user = users_collection.find_one({'employee_id': employee_id})
            if user:
                attendance_record = create_attendance_record(employee_id, 'qr', location)
                return jsonify({
                    'message': 'Attendance marked successfully',
                    'employee_name': user.get('name'),
                    'timestamp': attendance_record['timestamp']
                }), 200
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'error': 'Invalid QR code'}), 400
    except Exception as e:
        print(f"QR attendance error: {e}")
        return jsonify({'error': str(e)}), 400

def verify_qr_code(qr_data):
    try:
        # Add your QR code verification logic here
        return qr_data.get('employee_id')
    except:
        return None

def create_attendance_record(employee_id, method, location):
    attendance_record = {
        'employee_id': employee_id,
        'timestamp': datetime.now(),
        'method': method,
        'location': location,
        'verified': True
    }
    attendance_collection.insert_one(attendance_record)
    return attendance_record

if __name__ == '__main__':
    app.run(debug=True, port=5000)
