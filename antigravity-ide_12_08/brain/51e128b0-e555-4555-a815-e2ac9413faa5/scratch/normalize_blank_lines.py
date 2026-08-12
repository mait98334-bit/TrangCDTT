import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Split by any newline character
lines = text.replace("\r\n", "\n").split("\n")

cleaned_lines = []
for idx, line in enumerate(lines):
    # If the line is empty and the previous line was also empty, skip it.
    if idx > 0 and line.strip() == "" and lines[idx - 1].strip() == "":
        continue
    cleaned_lines.append(line)

print("Original lines count:", len(lines))
print("Cleaned lines count:", len(cleaned_lines))

new_text = "\n".join(cleaned_lines)

with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(new_text)

print("Cleaned consecutive blank lines successfully!")
