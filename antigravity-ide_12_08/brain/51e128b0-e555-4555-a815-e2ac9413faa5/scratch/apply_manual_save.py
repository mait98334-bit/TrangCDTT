import os
import subprocess

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "rb") as f:
    binary_content = f.read()

# Decode to string with unix newlines
text = binary_content.replace(b'\r', b'').decode('utf-8')

# --- 1. Replace handleSubmit ---
start_marker = "  // Xử lý Submit form sản phẩm chính (Thêm/Sửa)\n  const handleSubmit = async (e) => {"
end_marker = "  // Xử lý xóa mềm sản phẩm"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    print(f"Found handleSubmit block from index {start_idx} to {end_idx}")
    
    new_submit_block = """  // Xử lý Submit form sản phẩm chính (Thêm/Sửa)
  const triggerSaveProduct = async () => {
    setSubmitting(true);
    const endpoint =
      modalType === "add" ? "/products" : `/products/${formData.id}`;
    const method = modalType === "add" ? "POST" : "PUT";
    const res = await fetchApi(endpoint, {
      method,
      body: JSON.stringify({
        name: formData.name,
        price: Number(formData.price),
        price_sale: formData.price_sale ? Number(formData.price_sale) : null,
        image: formData.image,
        description: formData.description,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        brand_id: formData.brand_id ? Number(formData.brand_id) : null,
        is_sale: Number(formData.is_sale || 0),
        is_hot: Number(formData.is_hot || 0),
        is_new: Number(formData.is_new || 0),
      }),
    });
    if (res.success) {
      if (modalType === "add") {
        const newProduct = res.data;
        const productId = newProduct.id;
        // 1. Lưu toàn bộ ảnh phụ trong newProductImages
        if (newProductImages.length > 0) {
          for (const img of newProductImages) {
            await fetchApi(`/products/${productId}/images`, {
              method: "POST",
              body: JSON.stringify({ image_url: img.image_url }),
            });
          }
        }
        // 2. Lưu toàn bộ biến thể trong newProductVariants
        if (newProductVariants.length > 0) {
          for (const v of newProductVariants) {
            await fetchApi(`/products/${productId}/variants`, {
              method: "POST",
              body: JSON.stringify({
                color: v.color || null,
                size: v.size || null,
                price: v.price ? Number(v.price) : null,
                stock: Number(v.stock),
                image: v.image || null,
              }),
            });
          }
        }
        alert("Thêm sản phẩm mới cùng với ảnh phụ và các biến thể thành công!");
        setShowModal(false);
      } else {
        alert("Cập nhật sản phẩm thành công!");
        setShowModal(false);
      }
      loadProducts();
    } else {
      alert(res.message || "Thao tác thất bại!");
    }
    setSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerSaveProduct();
  };

  const handleSaveProductClick = () => {
    if (!formData.name || !formData.name.trim()) {
      alert("Vui lòng điền Tên sản phẩm ở tab Thông tin chung!");
      setActiveTabInModal("basic");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Vui lòng điền Giá bán gốc hợp lệ ở tab Thông tin chung!");
      setActiveTabInModal("basic");
      return;
    }
    triggerSaveProduct();
  };
  
"""
    text = text[:start_idx] + new_submit_block + text[end_idx:]
    print("Replaced handleSubmit successfully!")
else:
    print("ERROR: Could not find handleSubmit block!")

# --- 2. Replace Footer Submit Buttons ---
old_add_footer_button = """                      <button
                        type="submit"
                        form="product-form"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
                      >
                        {submitting ? "Đang lưu..." : "Lưu sản phẩm"}
                      </button>"""

new_add_footer_button = """                      <button
                        type="button"
                        onClick={handleSaveProductClick}
                        disabled={submitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
                      >
                        {submitting ? "Đang lưu..." : "Lưu sản phẩm"}
                      </button>"""

old_edit_footer_button = """                      <button
                        type="submit"
                        form="product-form"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
                      >
                        {submitting ? "Đang lưu..." : "Lưu lại"}
                      </button>"""

new_edit_footer_button = """                      <button
                        type="button"
                        onClick={handleSaveProductClick}
                        disabled={submitting}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
                      >
                        {submitting ? "Đang lưu..." : "Lưu lại"}
                      </button>"""

if old_add_footer_button in text:
    text = text.replace(old_add_footer_button, new_add_footer_button)
    print("Updated add footer button successfully!")
else:
    print("WARNING: add footer button not found!")

if old_edit_footer_button in text:
    text = text.replace(old_edit_footer_button, new_edit_footer_button)
    print("Updated edit footer button successfully!")
else:
    print("WARNING: edit footer button not found!")

# Save back to file in binary UTF-8
with open(file_path, "wb") as f:
    f.write(text.encode('utf-8'))

# Format with Prettier
subprocess.run(["npx.cmd", "prettier", "--write", file_path], shell=True)

print("Manual save button flow implementation complete!")
