import os
import re

src_dir = r"D:\Java_QLPhongTRo\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    # For URLs with /api or /ws or /uploads, we just replace http://localhost:8082
    # Be careful not to replace it inside quotes if we are appending string interpolation.
    # It's safer to replace "http://localhost:8082/api" with `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082'}/api`
    # But since some are strings like "http://localhost:8082/api", we replace the exact string
    
    # We will replace 'http://localhost:8082' (with quotes) to (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082')
    # Actually, the simplest is to replace the substring "http://localhost:8082" with `\${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082'}` inside a template literal.
    
    # Let's handle it by replacing `"http://localhost:8082/` with `(process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/`
    content = content.replace('"http://localhost:8082/', '(process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/')
    content = content.replace("'http://localhost:8082/", "(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082') + '/")
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated:", filepath)

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))
