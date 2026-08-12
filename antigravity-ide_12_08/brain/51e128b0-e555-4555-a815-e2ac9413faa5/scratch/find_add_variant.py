import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("const handleAddVariant =")
if idx != -1:
    # Get 10 lines
    lines = text[idx-20:idx+800].split('\n')[:15]
    for line in lines:
        print(f"[{len(line) - len(line.lstrip())} spaces]: {line.strip().encode('ascii', errors='replace').decode('ascii')}")
else:
    print("handleAddVariant not found")
