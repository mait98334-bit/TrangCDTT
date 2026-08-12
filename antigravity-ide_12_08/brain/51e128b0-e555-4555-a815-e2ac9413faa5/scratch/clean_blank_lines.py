import os

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "rb") as f:
    binary_content = f.read()

# Let's inspect the first 200 bytes to see what line endings look like
print("First 200 bytes of file:")
print(binary_content[:200])

# Replace b'\r\r\n' with b'\r\n'
new_binary = binary_content.replace(b'\r\r\n', b'\r\n')
print("After replacing \\r\\r\\n with \\r\\n, size changed from", len(binary_content), "to", len(new_binary))

# Let's check if there are still b'\r\r\n'
print("Contains \\r\\r\\n:", b'\r\r\n' in new_binary)

# Let's save the cleaned file
with open(file_path, "wb") as f:
    f.write(new_binary)

print("Cleaned page.js file endings successfully!")
