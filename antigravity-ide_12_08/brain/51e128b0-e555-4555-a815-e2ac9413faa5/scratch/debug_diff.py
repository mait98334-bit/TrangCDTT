import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Normalize
code = code.replace("\r\n", "\n")

# Check for handleOpenAdd
print("handleOpenAdd in code:", "handleOpenAdd" in code)
# Let's find handleOpenAdd definition
idx = code.find("const handleOpenAdd")
if idx != -1:
    print("Found 'const handleOpenAdd' at index", idx)
    print(code[idx:idx+300])
else:
    print("Not found 'const handleOpenAdd'!")

idx2 = code.find("const handleSubmit")
if idx2 != -1:
    print("Found 'const handleSubmit' at index", idx2)
    print(code[idx2:idx2+200])
