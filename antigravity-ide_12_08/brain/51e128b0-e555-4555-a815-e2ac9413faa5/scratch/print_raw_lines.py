import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

idx = code.find("const handleOpenAdd = () => {")
if idx != -1:
    print("Found handleOpenAdd:")
    # Print the next 200 characters but replace \n with [LF] and \r with [CR]
    sub = code[idx:idx+250]
    print(repr(sub))
else:
    print("Not found handleOpenAdd")
