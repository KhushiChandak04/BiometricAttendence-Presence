from pymongo import MongoClient, ssl_support
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import certifi
import ssl
import urllib.parse

def test_mongodb_connection():
    # Load environment variables
    load_dotenv()
    
    try:
        username = urllib.parse.quote_plus("khushichandak2005")
        password = urllib.parse.quote_plus("khac2005")
        
        # Create connection URL with escaped username and password
        uri = f"mongodb+srv://{username}:{password}@biometricattendence.jolt8.mongodb.net/attendance_db?retryWrites=true&w=majority"
        
        print("\nAttempting to connect to MongoDB Atlas...")
        client = MongoClient(
            uri,
            tls=True,
            tlsCAFile=certifi.where(),
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            serverSelectionTimeoutMS=30000,
            connect=True
        )
        
        # Force a connection attempt
        print("Testing connection...")
        client.admin.command('ismaster')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Access the database
        db = client.attendance_db
        print("✅ Successfully accessed database: attendance_db")
        
        # List collections
        collections = db.list_collection_names()
        print(f"✅ Available collections: {', '.join(collections)}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error connecting to MongoDB: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check if your MongoDB Atlas cluster is running")
        print("2. Verify your network connection")
        print("3. Make sure your IP address is whitelisted in MongoDB Atlas")
        print("4. Verify your database credentials")
        print("\nDetailed error information:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("\nMongoDB connection closed.")

if __name__ == "__main__":
    print("Testing MongoDB Connection...")
    test_mongodb_connection()
