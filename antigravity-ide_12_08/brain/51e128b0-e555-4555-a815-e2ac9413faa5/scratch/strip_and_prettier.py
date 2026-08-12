import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.replace("\r\n", "\n").split("\n")

# Filter out all empty lines
cleaned_lines = [line for line in lines if line.strip() != ""]

print("Original lines count:", len(lines))
print("Cleaned dense lines count:", len(cleaned_lines))

dense_text = "\n".join(cleaned_lines)

with open(file_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(dense_text)

print("Saved dense page.js successfully!")
