import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("startsWith")
if idx != -1:
    print("Found startsWith:")
    print(text[idx-50:idx+100])
else:
    print("startsWith not found")

idx2 = text.find("startswith")
if idx2 != -1:
    print("Found startswith:")
    print(text[idx2-50:idx2+100])
else:
    print("startswith not found")
