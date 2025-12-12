# app/auth.py
from datetime import datetime, timedelta
from typing import Dict, Any, List
import hashlib # Standard Python library for hashing
from jose import jwt # Still needed for JWT encoding/decoding
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status
import face_recognition
import numpy as np
import io
from .models import UserInDB, UserRole
from typing import Dict, Any, List, Union
from datetime import timedelta
# --- Configuration & Setup ---
SECRET_KEY = "YOUR_SECRET_KEY"  # CRITICAL: CHANGE THIS IN PRODUCTION
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Password Utilities (REPLACED bcrypt with SHA256) ---

def hash_password(password: str) -> str:
    """ Hashes password using SHA256 (standard Python library). 
        NOTE: For maximum security, a production environment should use 
        passlib with a modern algorithm like Argon2 or scrypt, but this 
        solves your current dependency conflict.
    """
    # Encode the string to bytes and apply the hash function
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """ Verifies a plain password against a SHA256 hash. """
    return hash_password(plain_password) == hashed_password
def create_fingerprint_hash(username: str) -> str:
    """ 
    SIMULATION: Generates a deterministic hash for fingerprint template storage. 
    """
    unique_data = f"fingerprint_template_{username}_device_id_12345"
    return hashlib.sha256(unique_data.encode('utf-8')).hexdigest()
# --- Dummy Database (Passwords hashed using the new SHA256 function) ---

# We need to hash the passwords once before the dictionary is created
ADMIN_PASS_HASH = hash_password("admin123")
OFFICER_PASS_HASH = hash_password("officer123")
DRIVER_PASS_HASH = hash_password("driver123")
ADMIN_FP_HASH = create_fingerprint_hash("general@army.gov")
DUMMY_USERS_DB: Dict[str, UserInDB] = {
    # ...
    "general@army.gov": UserInDB(
        username="general@army.gov",
        hashed_password=ADMIN_PASS_HASH,
        role="admin",
        face_encoding=[-0.15278559923171997, 0.006806081160902977, 0.06489185243844986, -0.08214182406663895, -0.11863813549280167, -0.04159421846270561, -0.05687353014945984, -0.054383523762226105, 0.18017542362213135, -0.22336316108703613, 0.14642229676246643, -0.04217391088604927, -0.17273658514022827, -0.005299791693687439, -0.04025290161371231, 0.1872815489768982, -0.07867833226919174, -0.19890320301055908, -0.08887819945812225, -0.11965592205524445, 0.04311864450573921, 0.03936241939663887, -0.08293347805738449, 0.08402513712644577, -0.22133629024028778, -0.3316347897052765, -0.055352501571178436, -0.06201525405049324, -0.014218831434845924, -0.06054399907588959, -0.04818391799926758, 0.13659866154193878, -0.198049858212471, -0.00039790011942386627, 0.034707874059677124, 0.13372334837913513, 0.0009707172866910696, 0.013547871261835098, 0.18293507397174835, 4.179030656814575e-05, -0.2933662235736847, -0.058102916926145554, 0.1571882963180542, 0.20901824533939362, 0.1563786119222641, 0.002764156088232994, 0.02418820932507515, -0.040865227580070496, 0.12256681174039841, -0.29112085700035095, 0.0897211879491806, 0.13743315637111664, 0.050720009952783585, 0.10100775212049484, 0.12723037600517273, -0.16670477390289307, -0.04060473293066025, 0.09093721210956573, -0.13503606617450714, 0.04369702190160751, 0.01003778725862503, -0.07147292047739029, -0.11677336692810059, -0.08124493062496185, 0.20269952714443207, 0.16777120530605316, -0.11320225894451141, -0.15128971636295319, 0.24884441494941711, -0.21073958277702332, -0.05704422667622566, 0.08305294811725616, -0.0871637612581253, -0.13543571531772614, -0.3268451690673828, 0.008019484579563141, 0.3808562755584717, 0.15618935227394104, -0.12047803401947021, 0.11238552629947662, 0.014434725046157837, -0.04593557119369507, 0.05071350932121277, 0.10493254661560059, -0.05601253733038902, 0.09245792031288147, 0.04324796050786972, 0.11093375831842422, 0.2107652723789215, 0.05320461839437485, 0.0022444583009928465, 0.16585229337215424, 0.008564422838389874, 0.02921735867857933, 0.03919094428420067, 0.09939984977245331, -0.10161260515451431, -0.11467678844928741, -0.16597437858581543, -0.019882522523403168, 0.05730683356523514, 0.0036104992032051086, 0.0025743194855749607, 0.1420433074235916, -0.17125216126441956, 0.18008972704410553, -0.04345310106873512, -0.030555356293916702, -0.05256985127925873, 0.12955458462238312, -0.06363551318645477, -0.037211377173662186, 0.08080986887216568, -0.16836188733577728, 0.14880116283893585, 0.11601654440164566, -0.034425120800733566, 0.12765653431415558, 0.09401262551546097, 0.03366462141275406, 0.03550823777914047, -0.048378899693489075, -0.17007483541965485, -0.10444323718547821, 0.07393330335617065, -0.08864396065473557, 0.053476326167583466, 0.047047268599271774], # <--- PASTE THE LIST HERE!
        fingerprint_hash=ADMIN_FP_HASH
    ),
    "officer@army.gov": UserInDB(
        username="officer@army.gov",
        hashed_password=OFFICER_PASS_HASH,
        role="officer",
        face_encoding=[-0.10153581202030182, 0.07548671215772629, 0.07746890187263489, -0.005909666884690523, -0.017793454229831696, 0.009805263951420784, -0.08266539126634598, -0.0883094072341919, 0.16651666164398193, -0.10819216072559357, 0.1935901939868927, 0.01708064414560795, -0.16286085546016693, -0.10919969528913498, -0.014281416311860085, 0.08469962328672409, -0.09824176132678986, -0.1569654941558838, -0.07799306511878967, -0.07577136158943176, 0.008708777837455273, -0.0459873303771019, -0.03855542838573456, 0.07512087374925613, -0.1364704966545105, -0.3742181360721588, -0.1101655513048172, -0.16508859395980835, 0.011193595826625824, -0.08588153123855591, -0.09227368235588074, -0.028508329764008522, -0.1220688745379448, -0.03786683827638626, -0.03814948722720146, 0.09952195733785629, -0.002598721766844392, 0.007168599404394627, 0.1346934735774994, 0.012497242540121078, -0.12115676701068878, 0.013706531375646591, 0.042161718010902405, 0.28547269105911255, 0.22902795672416687, 0.08967886120080948, 0.07788853347301483, 0.057840682566165924, 0.10115043073892593, -0.22704870998859406, 0.06334561854600906, 0.12748412787914276, 0.15504054725170135, 0.059446435421705246, 0.19129937887191772, -0.15450182557106018, -0.04956924915313721, 0.010537369176745415, -0.08984089642763138, 0.12598955631256104, -0.027304256334900856, 0.0042266398668289185, -0.020557081326842308, 0.006429329514503479, 0.251684308052063, 0.12995854020118713, -0.09021106362342834, -0.11541907489299774, 0.16323895752429962, -0.2226562201976776, -0.02544420212507248, 0.042876772582530975, -0.13060425221920013, -0.13630056381225586, -0.2389940321445465, 0.0595419704914093, 0.4594201445579529, 0.17049244046211243, -0.18772268295288086, 0.030370891094207764, -0.10448446869850159, -0.05995825678110123, 0.0583857037127018, -0.0014042954426258802, -0.06804738938808441, 0.04697796702384949, -0.1255231350660324, 0.003069330006837845, 0.21807269752025604, 0.030534997582435608, 0.009708752855658531, 0.16667281091213226, -0.02877357229590416, 0.0062894877046346664, 0.032838862389326096, 0.0008521379204466939, -0.09888924658298492, -0.0050308736972510815, -0.0872364193201065, -0.04101509973406792, 0.046935487538576126, -0.07770469039678574, 0.028107531368732452, 0.04414674639701843, -0.1791493445634842, 0.08054237812757492, -0.0230068638920784, 0.02059873566031456, -0.01878155767917633, 0.165919691324234, -0.1940518021583557, -0.06391668319702148, 0.19571301341056824, -0.237773597240448, 0.1297568380832672, 0.18848052620887756, -0.0023938356898725033, 0.07667560875415802, 0.05125673487782478, 0.06774298846721649, 0.0029827840626239777, 0.011711683124303818, -0.07854467630386353, -0.0976283997297287, -0.06166037917137146, -0.037141282111406326, 0.015715444460511208, 0.05269012227654457]  # <--- PASTE THE SAME LIST HERE!
    ),

     "driver@army.gov": UserInDB(
        username="driver@army.gov",
        hashed_password=DRIVER_PASS_HASH,
        role="driver"
    )
    # ...
}
def get_user(username: str) -> Union[UserInDB, None]:
    return DUMMY_USERS_DB.get(username)

# --- JWT Utilities (No changes needed) ---

def create_access_token(data: Dict[str, Any], expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Biometric Placeholders (No changes needed) ---

def check_for_spoofing(image_bytes: bytes) -> bool:
    """ Placeholder for Liveness Detection. """
    print("--- Running Liveness Check (Placeholder: Success) ---")
    return True 

def recognize_face(user_id: str, image_bytes: bytes) -> bool:
    """ Placeholder for Face Recognition Logic. """
    print(f"--- Running Face Recognition for {user_id} (Placeholder: Success) ---")
    return True 

def verify_fingerprint(user_id: str) -> bool:
    """ Placeholder for Fingerprint Verification. """
    print(f"--- Running Fingerprint Check for {user_id} (Placeholder: Success) ---")
    return True
def check_for_spoofing(image_bytes: bytes) -> bool:
    """ 
    Placeholder for Liveness Detection. 
    NOTE: Real liveness detection requires a dedicated model (e.g., depth/blink analysis)
    and is extremely complex. This function remains a placeholder set to True.
    """
    print("--- Running Liveness Check (Placeholder: Success) ---")
    # You MUST replace this with real anti-spoofing logic for production security!
    return True 

def recognize_face(user_id: str, image_bytes: bytes) -> bool:
    """ 
    REAL Face Recognition Logic
    Compares the captured face encoding against the stored encoding in DUMMY_USERS_DB.
    """
    user = DUMMY_USERS_DB.get(user_id)
    if not user or not user.face_encoding:
        print(f"ERROR: User {user_id} has no stored face encoding.")
        return False
        
    stored_encoding = np.array(user.face_encoding)
    
    # 1. Load captured image from bytes
    image_stream = io.BytesIO(image_bytes)
    # face_recognition requires a file path or a numpy array, we convert the stream
    try:
        # Load image via Pillow (which face_recognition uses internally)
        from PIL import Image
        img = Image.open(image_stream).convert('RGB')
        captured_image = np.array(img)
    except Exception as e:
        print(f"Error loading image bytes: {e}")
        return False

    # 2. Get encoding from the captured image
    captured_encodings = face_recognition.face_encodings(captured_image)
    
    if not captured_encodings:
        print("Face recognition failed: No face found in captured frame.")
        return False
        
    captured_encoding = captured_encodings[0]
    
    # 3. Compare the captured face to the stored face
    # tolerance: 0.6 is a common value. Lower is stricter.
    tolerance = 0.6 
    
    # face_recognition.compare_faces returns a list of booleans (True/False for each stored face)
    matches = face_recognition.compare_faces([stored_encoding], captured_encoding, tolerance=tolerance)
    
    if True in matches:
        print(f"Face recognition successful for {user_id}. Match found.")
        return True
    else:
        print(f"Face recognition failed for {user_id}. Faces do not match.")
        return False

def verify_fingerprint(user_id: str) -> bool:
    # ... (remains a placeholder, set to True for testing admin flow)
    print(f"--- Running Fingerprint Check for {user_id} (Placeholder: Success) ---")
    return True
# NOTE: The rest of the API logic in main.py remains the same, as it only calls
# the functions (e.g., verify_password) whose internal logic has changed.