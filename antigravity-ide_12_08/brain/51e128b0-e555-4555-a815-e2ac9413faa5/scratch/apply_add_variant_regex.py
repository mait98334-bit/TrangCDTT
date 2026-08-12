import os
import subprocess

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "rb") as f:
    binary_content = f.read()

# Decode to string with unix newlines
text = binary_content.replace(b'\r', b'').decode('utf-8')

# Find start and end indices
start_marker = "  const handleAddVariant = async (e) => {"
end_marker = "  const handleDeleteVariant = async (variantId) => {"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    print(f"Found handleAddVariant block from index {start_idx} to {end_idx}")
    
    new_add_var_block = """  const handleAddVariant = async (e) => {
    e.preventDefault();
    // Loc ra cac dong hop le
    const validVariants = tempVariants.filter(
      (v) => v.color.trim() !== "" || v.size.trim() !== "",
    );
    if (validVariants.length === 0) {
      alert("Vui lòng điền Màu sắc hoặc Kích cỡ cho ít nhất một biến thể!");
      return;
    }
    if (modalType === "add") {
      setNewProductVariants((prev) => {
        const updated = [...prev];
        validVariants.forEach((v, idx) => {
          updated.push({
            id: "temp_v_" + (Date.now() + idx),
            color: v.color || null,
            size: v.size || null,
            price: v.price ? Number(v.price) : null,
            stock: Number(v.stock),
            image: v.image || null,
          });
        });
        return updated;
      });
      setTempVariants([
        { color: "", size: "", price: "", stock: "0", image: "" },
      ]);
      setFocusedRow({ index: 0, field: "" });
      alert(`Đã lưu thành công ${validVariants.length} biến thể vào danh sách chờ!`);
    } else {
      let successCount = 0;
      let failCount = 0;
      // Lưu tuần tự từng biến thể lên backend
      for (const variant of validVariants) {
        const res = await fetchApi(
          `/products/${selectedExtraProduct.id}/variants`,
          {
            method: "POST",
            body: JSON.stringify({
              color: variant.color || null,
              size: variant.size || null,
              price: variant.price ? Number(variant.price) : null,
              stock: Number(variant.stock),
              image: variant.image || null,
            }),
          },
        );
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      if (successCount > 0) {
        loadProductExtra(selectedExtraProduct.id);
        setTempVariants([
          { color: "", size: "", price: "", stock: "0", image: "" },
        ]);
        setFocusedRow({ index: 0, field: "" });
        alert(
          `Đã lưu thành công ${successCount} biến thể!${
            failCount > 0 ? ` (Thất bại ${failCount} biến thể)` : ""
          }`,
        );
      } else {
        alert("Lưu các biến thể thất bại!");
      }
    }
  };

"""
    # Replace the block
    new_text = text[:start_idx] + new_add_var_block + text[end_idx:]
    
    # Save back to file as binary UTF-8
    with open(file_path, "wb") as f:
        f.write(new_text.encode('utf-8'))
        
    print("Replaced handleAddVariant successfully!")
    
    # Run prettier
    subprocess.run(["npx.cmd", "prettier", "--write", file_path], shell=True)
    print("Prettier formatting applied!")
else:
    print("ERROR: Could not find markers!")
    print("start_idx:", start_idx)
    print("end_idx:", end_idx)
