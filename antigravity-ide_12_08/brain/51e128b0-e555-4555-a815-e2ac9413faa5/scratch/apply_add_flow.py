import os
import sys

# Ensure UTF-8 output for print to avoid Windows console encoding issues
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Normalize line endings to \n
code = code.replace("\r\n", "\n")

# 1. Replace the Tab Navigation (formerly conditional modalType === 'edit')
old_tabs_block = """                        {/* Tab Navigation if Edit mode */}
                        {modalType === 'edit' && (
                            <div className="flex border-b border-gray-100 bg-gray-50 px-6 pt-1 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTabInModal('basic')}
                                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        activeTabInModal === 'basic'
                                            ? 'border-indigo-600 text-indigo-600 font-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    ℹ️ Thông tin chung
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTabInModal('images');
                                        loadProductExtra(formData.id);
                                    }}
                                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        activeTabInModal === 'images'
                                            ? 'border-indigo-600 text-indigo-600 font-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    🖼️ Ảnh phụ ({extraImages.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTabInModal('variants');
                                        loadProductExtra(formData.id);
                                    }}
                                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        activeTabInModal === 'variants'
                                            ? 'border-indigo-600 text-indigo-600 font-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    👟 Biến thể ({extraVariants.length})
                                </button>
                            </div>
                        )}"""

new_tabs_block = """                        {/* Tab Navigation (luôn hiển thị, nhưng khóa tab Ảnh phụ/Biến thể khi thêm mới) */}
                        <div className="flex border-b border-gray-100 bg-gray-50 px-6 pt-1 gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTabInModal('basic')}
                                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                    activeTabInModal === 'basic'
                                        ? 'border-indigo-600 text-indigo-600 font-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                ℹ️ Thông tin chung
                            </button>
                            <button
                                type="button"
                                disabled={modalType === 'add'}
                                onClick={() => {
                                    setActiveTabInModal('images');
                                    loadProductExtra(formData.id);
                                }}
                                title={modalType === 'add' ? 'Vui lòng lưu thông tin sản phẩm trước khi quản lý ảnh phụ' : ''}
                                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                                    modalType === 'add'
                                        ? 'opacity-40 cursor-not-allowed border-transparent text-gray-400'
                                        : activeTabInModal === 'images'
                                            ? 'border-indigo-600 text-indigo-600 font-black cursor-pointer'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer'
                                }`}
                            >
                                🖼️ Ảnh phụ {modalType === 'add' ? '🔒' : `(${extraImages.length})`}
                            </button>
                            <button
                                type="button"
                                disabled={modalType === 'add'}
                                onClick={() => {
                                    setActiveTabInModal('variants');
                                    loadProductExtra(formData.id);
                                }}
                                title={modalType === 'add' ? 'Vui lòng lưu thông tin sản phẩm trước khi quản lý biến thể' : ''}
                                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                                    modalType === 'add'
                                        ? 'opacity-40 cursor-not-allowed border-transparent text-gray-400'
                                        : activeTabInModal === 'variants'
                                            ? 'border-indigo-600 text-indigo-600 font-black cursor-pointer'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer'
                                }`}
                            >
                                👟 Biến thể {modalType === 'add' ? '🔒' : `(${extraVariants.length})`}
                            </button>
                        </div>"""

normalized_old_tabs = old_tabs_block.replace("\r\n", "\n")
normalized_new_tabs = new_tabs_block.replace("\r\n", "\n")

if normalized_old_tabs in code:
    code = code.replace(normalized_old_tabs, normalized_new_tabs)
    print("Updated Tab Navigation successfully!")
else:
    print("WARNING: Old tabs block not found!")

# 2. Replace the handleSubmit success handling block
old_submit_success = """        if (res.success) {
            alert(modalType === 'add' ? 'Thêm sản phẩm thành công!' : 'Cập nhật sản phẩm thành công!');
            setShowModal(false);
            loadProducts();
        } else {"""

new_submit_success = """        if (res.success) {
            if (modalType === 'add') {
                alert('Thêm sản phẩm mới thành công! Bạn có thể tiếp tục thêm Ảnh phụ và Biến thể ở các tab bên trên.');
                // Chuyển sang chế độ Sửa sản phẩm vừa tạo
                const newProduct = res.data;
                setModalType('edit');
                setFormData({
                    id: newProduct.id,
                    name: newProduct.name,
                    price: newProduct.price,
                    price_sale: newProduct.price_sale || '',
                    image: newProduct.image || '',
                    description: newProduct.description || '',
                    category_id: newProduct.category_id || '',
                    brand_id: newProduct.brand_id || '',
                    is_sale: newProduct.is_sale || 0,
                    is_hot: newProduct.is_hot || 0,
                    is_new: newProduct.is_new || 0
                });
                setSelectedExtraProduct(newProduct);
                setActiveTabInModal('basic');
                setSelectedVariantIds([]);
                setEditingVariantId(null);
                loadProductExtra(newProduct.id);
            } else {
                alert('Cập nhật sản phẩm thành công!');
                setShowModal(false);
            }
            loadProducts();
        } else {"""

normalized_old_submit = old_submit_success.replace("\r\n", "\n")
normalized_new_submit = new_submit_success.replace("\r\n", "\n")

if normalized_old_submit in code:
    code = code.replace(normalized_old_submit, normalized_new_submit)
    print("Updated handleSubmit success handler successfully!")
else:
    print("WARNING: Old submit success handler not found!")

# Restore CRLF
code = code.replace("\n", "\r\n")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Add Product workflow enhancements completed!")
