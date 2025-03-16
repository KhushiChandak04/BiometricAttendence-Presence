from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

def test_mongodb_connection():
    # Load environment variables
    load_dotenv()
    
    # Get MongoDB URI from environment variables
    mongodb_uri = os.getenv('MONGODB_URI')
    database_name = os.getenv('DATABASE_NAME', 'attendance_db')
    
    try:
        # Create MongoDB client with latest Server API version
        print("\nAttempting to connect to MongoDB Atlas...")
        client = MongoClient(mongodb_uri, server_api=ServerApi('1'))
        
        # Test connection by accessing server info
        server_info = client.server_info()
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Test database access
        db = client[database_name]
        print(f"✅ Successfully accessed database: {database_name}")
        
        # Test collections from memory
        users_collection = db['users']
        attendance_collection = db['attendance']
        
        # Test insert operation
        test_doc = {"test": "connection", "temporary": True}
        insert_result = users_collection.insert_one(test_doc)
        print("✅ Successfully inserted test document!")
        
        # Clean up test document
        users_collection.delete_one({"_id": insert_result.inserted_id})
        print("✅ Successfully cleaned up test document!")
        
        # Print database details
        print("\nDatabase Details:")
        print(f"Database name: {database_name}")
        print(f"Available collections: {', '.join(db.list_collection_names())}")
        print(f"MongoDB server version: {server_info.get('version', 'unknown')}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to MongoDB: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check if your MongoDB Atlas cluster is running")
        print("2. Verify your network connection")
        print("3. Make sure your IP address is whitelisted in MongoDB Atlas")
        print("4. Verify your database credentials")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("\nMongoDB connection closed.")

if __name__ == "__main__":
    print("Testing MongoDB Connection...")
    test_mongodb_connection()
