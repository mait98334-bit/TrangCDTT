import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

occurrences = []
idx = 0
while True:
    idx = text.find("activeTabInModal", idx)
    if idx == -1:
        break
    occurrences.append(text[max(0, idx-40):idx+60])
    idx += len("activeTabInModal")

print("Found occurrences of activeTabInModal:")
for i, occ in enumerate(occurrences):
    clean = occ.encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {repr(clean)}")
