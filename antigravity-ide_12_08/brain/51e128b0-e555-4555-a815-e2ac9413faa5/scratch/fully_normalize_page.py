import os
import subprocess

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

# Read binary
with open(file_path, "rb") as f:
    binary_content = f.read()

# Decode to string with utf-8, ignore errors
text = binary_content.replace(b'\r', b'').decode('utf-8', errors='ignore')

# Split by \n
lines = text.split('\n')

# Filter out all empty lines
dense_lines = [line for line in lines if line.strip() != ""]

dense_text = "\n".join(dense_lines)

# Write as binary UTF-8
with open(file_path, "wb") as f:
    f.write(dense_text.encode('utf-8'))

print("File written as dense binary. Running prettier...")

# Run prettier
subprocess.run(["npx.cmd", "prettier", "--write", file_path], shell=True)

print("Prettier formatting finished. Reading code to verify spacing...")

with open(file_path, "rb") as f:
    final_binary = f.read()

text_final = final_binary.replace(b'\r', b'').decode('utf-8', errors='ignore')
print("Line count after prettier:", len(text_final.split('\n')))
print("Sample raw text:")
idx = text_final.find("const handleOpenAdd")
if idx != -1:
    print(repr(text_final[idx:idx+150]))
else:
    print("handleOpenAdd not found")
