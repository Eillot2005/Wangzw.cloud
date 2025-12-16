import sys
import os
from pathlib import Path
from urllib.parse import unquote

# Setup path to import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Mocking the directory structure assumption
# The script is in backend/, so parent is backend/
# But the app code assumes it's in app/services/picture.py
# PICTURE_DIR = Path(__file__).parent.parent.parent / "Picture"
# In app/services/picture.py:
# __file__ = backend/app/services/picture.py
# parent = services
# parent.parent = app
# parent.parent.parent = backend
# / Picture = backend/Picture

# In this script:
# __file__ = backend/test_path.py
# parent = backend
# / Picture = backend/Picture
PICTURE_DIR = Path(__file__).parent / "Picture"

print(f"Picture Directory: {PICTURE_DIR}")
print(f"Exists: {PICTURE_DIR.exists()}")

filename_encoded = "%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20251216121629_210_122.jpg"
filename_decoded = unquote(filename_encoded)

print(f"Encoded: {filename_encoded}")
print(f"Decoded: {filename_decoded}")

path_encoded = PICTURE_DIR / filename_encoded
path_decoded = PICTURE_DIR / filename_decoded

print(f"Path Encoded Exists: {path_encoded.exists()}")
print(f"Path Decoded Exists: {path_decoded.exists()}")

# List directory to be sure
print("Files in directory:")
for f in PICTURE_DIR.iterdir():
    print(f" - {f.name}")
