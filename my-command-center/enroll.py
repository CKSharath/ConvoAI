import face_recognition

# Load the image
image = face_recognition.load_image_file("ahpface.jpg")

# Find the face encoding (this returns a list of encodings)
face_encodings = face_recognition.face_encodings(image)

if face_encodings:
    # This is the 128-element list of floats you need
    encoding_list = face_encodings[0].tolist() 
    print(encoding_list) 
else:
    print("No face found in the image.")