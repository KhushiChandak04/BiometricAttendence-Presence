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
import mediapipe as mp
from PIL import Image
import io
from sklearn.metrics.pairwise import cosine_similarity
import certifi

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection with SSL certificate
try:
    client = MongoClient(
        Config.MONGODB_URI,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000
    )
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

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def process_face_image(image_data):
    try:
        # Convert base64 image to numpy array
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert BGR to RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Get face mesh landmarks
        results = face_mesh.process(rgb_img)
        
        if not results.multi_face_landmarks:
            return None, "No face detected"
            
        if len(results.multi_face_landmarks) > 1:
            return None, "Multiple faces detected. Please ensure only one person is in the frame."
            
        # Extract face landmarks and convert to feature vector
        face_landmarks = results.multi_face_landmarks[0]
        landmarks_array = np.array([[lm.x, lm.y, lm.z] for lm in face_landmarks.landmark])
        
        # Normalize landmarks
        landmarks_array = (landmarks_array - landmarks_array.mean(axis=0)) / landmarks_array.std(axis=0)
        
        return landmarks_array.flatten().tolist(), None
        
    except Exception as e:
        print(f"Error processing face image: {e}")
        return None, str(e)

def verify_liveness(image_data):
    try:
        # Convert base64 image to PIL Image
        encoded_data = image_data.split(',')[1]
        img_bytes = base64.b64decode(encoded_data)
        img = Image.open(io.BytesIO(img_bytes))
        
        # Convert to numpy array
        img_np = np.array(img)
        rgb_img = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
        
        # Enhanced liveness detection using MediaPipe Face Mesh
        results = face_mesh.process(rgb_img)
        
        if not results.multi_face_landmarks:
            return False, "No face detected"
            
        # Check face mesh landmarks to ensure it's a real face
        face_landmarks = results.multi_face_landmarks[0]
        if len(face_landmarks.landmark) < 468:  # MediaPipe Face Mesh has 468 landmarks
            return False, "Could not detect all facial features"
            
        # Check if image is too blurry
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        blur_value = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_value < 100:
            return False, "Image too blurry, please ensure good lighting"
            
        return True, None
    except:
        return False, "Liveness check failed"

def compare_faces(known_encoding, new_encoding, threshold=0.85):
    if not known_encoding or not new_encoding:
        return False
        
    # Convert to numpy arrays
    known_array = np.array(known_encoding).reshape(1, -1)
    new_array = np.array(new_encoding).reshape(1, -1)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(known_array, new_array)[0][0]
    return similarity >= threshold

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        image_data = data.get('face_image')
        
        # Process face and check for errors
        face_encoding, error = process_face_image(image_data)
        if error:
            return jsonify({'error': error}), 400
            
        # Verify liveness
        is_live, liveness_error = verify_liveness(image_data)
        if not is_live:
            return jsonify({'error': f'Liveness check failed: {liveness_error}'}), 400
            
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
        return jsonify({
            'message': 'User registered successfully',
            'id': str(result.inserted_id),
            'name': user_data['name'],
            'employee_id': user_data['employee_id']
        }), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/attendance/face', methods=['POST'])
def mark_attendance_face():
    try:
        data = request.get_json()
        image_data = data.get('face_image')
        location = data.get('location')
        
        # Verify liveness first
        is_live, liveness_error = verify_liveness(image_data)
        if not is_live:
            return jsonify({'error': f'Liveness check failed: {liveness_error}'}), 400

        # Process face and check for errors
        face_encoding, error = process_face_image(image_data)
        if error:
            return jsonify({'error': error}), 400
            
        # Find matching user
        users = users_collection.find({})
        matched_user = None
        highest_similarity = 0
        
        for user in users:
            similarity = cosine_similarity(
                np.array(user.get('face_encoding')).reshape(1, -1),
                np.array(face_encoding).reshape(1, -1)
            )[0][0]
            if similarity > highest_similarity:
                highest_similarity = similarity
                matched_user = user
        
        if matched_user and highest_similarity >= 0.85:
            attendance_record = create_attendance_record(matched_user['employee_id'], 'face', location)
            return jsonify({
                'message': 'Attendance marked successfully',
                'employee_name': matched_user.get('name'),
                'employee_id': matched_user.get('employee_id'),
                'confidence': float(highest_similarity),
                'timestamp': attendance_record['timestamp']
            }), 200
        return jsonify({'error': 'User not found or confidence too low. Please register first or try again with better lighting.'}), 404
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
