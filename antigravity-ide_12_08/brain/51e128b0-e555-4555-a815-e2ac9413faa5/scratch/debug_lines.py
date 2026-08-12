import os
import sys

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

normalized_code = code.replace("\r\n", "\n")
lines = normalized_code.split("\n")

print("Last 15 lines of normalized code:")
for idx in range(max(0, len(lines) - 15), len(lines)):
    print(f"Line {idx}: {repr(lines[idx])}")
