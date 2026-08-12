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

# --- Step 1: Add new state variables ---
old_state_marker = "const [extraVariants, setExtraVariants] = useState([]);"
new_states = """const [extraVariants, setExtraVariants] = useState([]);
    const [newProductImages, setNewProductImages] = useState([]);
    const [newProductVariants, setNewProductVariants] = useState([]);"""

if old_state_marker in code:
    code = code.replace(old_state_marker, new_states)
    print("Added new state variables successfully!")
else:
    print("WARNING: State marker not found!")

# --- Step 2: Update handleOpenAdd ---
old_open_add = """    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            name: '',
            price: '',
            price_sale: '',
            image: '',
            description: '',
            category_id: '',
            brand_id: '',
            is_sale: 0,
            is_hot: 0,
            is_new: 0
        });
        setSelectedExtraProduct(null);
        setActiveTabInModal('basic');
        setShowModal(true);
    };"""

new_open_add = """    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            name: '',
            price: '',
            price_sale: '',
            image: '',
            description: '',
            category_id: '',
            brand_id: '',
            is_sale: 0,
            is_hot: 0,
            is_new: 0
        });
        setNewProductImages([]);
        setNewProductVariants([]);
        setTempVariants([{ color: '', size: '', price: '', stock: '0', image: '' }]);
        setSelectedExtraProduct(null);
        setActiveTabInModal('basic');
        setShowModal(true);
    };"""

normalized_old_open_add = old_open_add.replace("\r\n", "\n")
normalized_new_open_add = new_open_add.replace("\r\n", "\n")

if normalized_old_open_add in code:
    code = code.replace(normalized_old_open_add, normalized_new_open_add)
    print("Updated handleOpenAdd successfully!")
else:
    print("WARNING: handleOpenAdd not found!")

# --- Step 3: Update handleSubmit to save variants & images for new product ---
old_submit = """        if (res.success) {
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

new_submit = """        if (res.success) {
            if (modalType === 'add') {
                const newProduct = res.data;
                const productId = newProduct.id;

                // 1. Lưu toàn bộ ảnh phụ trong newProductImages
                if (newProductImages.length > 0) {
                    for (const img of newProductImages) {
                        await fetchApi(`/products/${productId}/images`, {
                            method: 'POST',
                            body: JSON.stringify({ image_url: img.image_url })
                        });
                    }
                }

                // 2. Lưu toàn bộ biến thể trong newProductVariants
                if (newProductVariants.length > 0) {
                    for (const v of newProductVariants) {
                        await fetchApi(`/products/${productId}/variants`, {
                            method: 'POST',
                            body: JSON.stringify({
                                color: v.color || null,
                                size: v.size || null,
                                price: v.price ? Number(v.price) : null,
                                stock: Number(v.stock),
                                image: v.image || null
                            })
                        });
                    }
                }

                alert('Thêm sản phẩm mới cùng với ảnh phụ và các biến thể thành công!');
                setShowModal(false);
            } else {
                alert('Cập nhật sản phẩm thành công!');
                setShowModal(false);
            }
            loadProducts();
        } else {"""

normalized_old_submit = old_submit.replace("\r\n", "\n")
normalized_new_submit = new_submit.replace("\r\n", "\n")

if normalized_old_submit in code:
    code = code.replace(normalized_old_submit, normalized_new_submit)
    print("Updated handleSubmit success block successfully!")
else:
    print("WARNING: handleSubmit success block not found!")

# --- Step 4: Update handleExtraImageUpload and handleAddExtraImageUrl ---
old_upload_extra = """            if (data.success) {
                // Thêm vào database
                const addRes = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({ image_url: data.url })
                });
                if (addRes.success) {
                    loadProductExtra(selectedExtraProduct.id);
                    alert('Thêm ảnh phụ thành công!');
                }
            }"""

new_upload_extra = """            if (data.success) {
                if (modalType === 'add') {
                    setNewProductImages(prev => [...prev, { id: 'temp_' + Date.now(), image_url: data.url }]);
                    alert('Thêm ảnh phụ thành công!');
                } else {
                    // Thêm vào database
                    const addRes = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
                        method: 'POST',
                        body: JSON.stringify({ image_url: data.url })
                    });
                    if (addRes.success) {
                        loadProductExtra(selectedExtraProduct.id);
                        alert('Thêm ảnh phụ thành công!');
                    }
                }
            }"""

normalized_old_upload = old_upload_extra.replace("\r\n", "\n")
normalized_new_upload = new_upload_extra.replace("\r\n", "\n")

if normalized_old_upload in code:
    code = code.replace(normalized_old_upload, normalized_new_upload)
    print("Updated handleExtraImageUpload successfully!")
else:
    print("WARNING: handleExtraImageUpload not found!")

old_add_url = """    const handleAddExtraImageUrl = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) return;
        const res = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
            method: 'POST',
            body: JSON.stringify({ image_url: newImageUrl })
        });
        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
            setNewImageUrl('');
            alert('Thêm ảnh phụ thành công!');
        } else {
            alert(res.message || 'Thêm ảnh phụ thất bại!');
        }
    };"""

new_add_url = """    const handleAddExtraImageUrl = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) return;
        if (modalType === 'add') {
            setNewProductImages(prev => [...prev, { id: 'temp_' + Date.now(), image_url: newImageUrl }]);
            setNewImageUrl('');
            alert('Thêm ảnh phụ thành công!');
        } else {
            const res = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
                method: 'POST',
                body: JSON.stringify({ image_url: newImageUrl })
            });
            if (res.success) {
                loadProductExtra(selectedExtraProduct.id);
                setNewImageUrl('');
                alert('Thêm ảnh phụ thành công!');
            } else {
                alert(res.message || 'Thêm ảnh phụ thất bại!');
            }
        }
    };"""

normalized_old_url = old_add_url.replace("\r\n", "\n")
normalized_new_url = new_add_url.replace("\r\n", "\n")

if normalized_old_url in code:
    code = code.replace(normalized_old_url, normalized_new_url)
    print("Updated handleAddExtraImageUrl successfully!")
else:
    print("WARNING: handleAddExtraImageUrl not found!")

# --- Step 5: Update handleDeleteExtraImage ---
old_delete_extra = """    const handleDeleteExtraImage = async (imageId) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh phụ này?')) return;
        const res = await fetchApi(`/products/images/${imageId}`, {
            method: 'DELETE'
        });
        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
        } else {
            alert(res.message || 'Xóa ảnh phụ thất bại!');
        }
    };"""

new_delete_extra = """    const handleDeleteExtraImage = async (imageId) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh phụ này?')) return;
        if (modalType === 'add') {
            setNewProductImages(prev => prev.filter(img => img.id !== imageId));
        } else {
            const res = await fetchApi(`/products/images/${imageId}`, {
                method: 'DELETE'
            });
            if (res.success) {
                loadProductExtra(selectedExtraProduct.id);
            } else {
                alert(res.message || 'Xóa ảnh phụ thất bại!');
            }
        }
    };"""

normalized_old_del = old_delete_extra.replace("\r\n", "\n")
normalized_new_del = new_delete_extra.replace("\r\n", "\n")

if normalized_old_del in code:
    code = code.replace(normalized_old_del, normalized_new_del)
    print("Updated handleDeleteExtraImage successfully!")
else:
    print("WARNING: handleDeleteExtraImage not found!")

# --- Step 6: Update handleAddVariant ---
old_add_var = """    const handleAddVariant = async (e) => {
        e.preventDefault();
        
        // Lọc ra các dòng hợp lệ (phải có màu hoặc size)
        const validVariants = tempVariants.filter(v => v.color.trim() !== '' || v.size.trim() !== '');
        
        if (validVariants.length === 0) {
            alert('Vui lòng điền Màu sắc hoặc Kích cỡ cho ít nhất một biến thể!');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        // Lưu tuần tự từng biến thể lên backend
        for (const variant of validVariants) {
            const res = await fetchApi(`/products/${selectedExtraProduct.id}/variants`, {
                method: 'POST',
                body: JSON.stringify({
                    color: variant.color || null,
                    size: variant.size || null,
                    price: variant.price ? Number(variant.price) : null,
                    stock: Number(variant.stock),
                    image: variant.image || null
                })
            });

            if (res.success) {
                successCount++;
            } else {
                failCount++;
            }
        }

        if (successCount > 0) {
            loadProductExtra(selectedExtraProduct.id);
            setTempVariants([{ color: '', size: '', price: '', stock: '0', image: '' }]);
            setFocusedRow({ index: 0, field: '' });
            alert(`Đã lưu thành công ${successCount} biến thể!${failCount > 0 ? ` (Thất bại ${failCount} biến thể)` : ''}`);
        } else {
            alert('Lưu các biến thể thất bại!');
        }
    };"""

new_add_var = """    const handleAddVariant = async (e) => {
        e.preventDefault();
        
        // Lọc ra các dòng hợp lệ (phải có màu hoặc size)
        const validVariants = tempVariants.filter(v => v.color.trim() !== '' || v.size.trim() !== '');
        
        if (validVariants.length === 0) {
            alert('Vui lòng điền Màu sắc hoặc Kích cỡ cho ít nhất một biến thể!');
            return;
        }

        if (modalType === 'add') {
            setNewProductVariants(prev => {
                const updated = [...prev];
                validVariants.forEach((v, idx) => {
                    updated.push({
                        id: 'temp_v_' + (Date.now() + idx),
                        color: v.color || null,
                        size: v.size || null,
                        price: v.price ? Number(v.price) : null,
                        stock: Number(v.stock),
                        image: v.image || null
                    });
                });
                return updated;
            });
            setTempVariants([{ color: '', size: '', price: '', stock: '0', image: '' }]);
            setFocusedRow({ index: 0, field: '' });
            alert(`Đã lưu thành công ${validVariants.length} biến thể vào danh sách chờ!`);
        } else {
            let successCount = 0;
            let failCount = 0;

            // Lưu tuần tự từng biến thể lên backend
            for (const variant of validVariants) {
                const res = await fetchApi(`/products/${selectedExtraProduct.id}/variants`, {
                    method: 'POST',
                    body: JSON.stringify({
                        color: variant.color || null,
                        size: variant.size || null,
                        price: variant.price ? Number(variant.price) : null,
                        stock: Number(variant.stock),
                        image: variant.image || null
                    })
                });

                if (res.success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

            if (successCount > 0) {
                loadProductExtra(selectedExtraProduct.id);
                setTempVariants([{ color: '', size: '', price: '', stock: '0', image: '' }]);
                setFocusedRow({ index: 0, field: '' });
                alert(`Đã lưu thành công ${successCount} biến thể!${failCount > 0 ? ` (Thất bại ${failCount} biến thể)` : ''}`);
            } else {
                alert('Lưu các biến thể thất bại!');
            }
        }
    };"""

normalized_old_var = old_add_var.replace("\r\n", "\n")
normalized_new_var = new_add_var.replace("\r\n", "\n")

if normalized_old_var in code:
    code = code.replace(normalized_old_var, normalized_new_var)
    print("Updated handleAddVariant successfully!")
else:
    print("WARNING: handleAddVariant not found!")

# --- Step 7: Update handleDeleteVariant ---
old_del_var = """    const handleDeleteVariant = async (variantId) => {
        if (!confirm('Bạn có chắc muốn xóa biến thể này?')) return;
        const res = await fetchApi(`/products/variants/${variantId}`, {
            method: 'DELETE'
        });
        if (res.success) {
            setSelectedVariantIds(prev => prev.filter(x => x !== variantId));
            loadProductExtra(selectedExtraProduct.id);
        } else {
            alert(res.message || 'Xóa biến thể thất bại!');
        }
    };"""

new_del_var = """    const handleDeleteVariant = async (variantId) => {
        if (!confirm('Bạn có chắc muốn xóa biến thể này?')) return;
        if (modalType === 'add') {
            setNewProductVariants(prev => prev.filter(v => v.id !== variantId));
            setSelectedVariantIds(prev => prev.filter(x => x !== variantId));
        } else {
            const res = await fetchApi(`/products/variants/${variantId}`, {
                method: 'DELETE'
            });
            if (res.success) {
                setSelectedVariantIds(prev => prev.filter(x => x !== variantId));
                loadProductExtra(selectedExtraProduct.id);
            } else {
                alert(res.message || 'Xóa biến thể thất bại!');
            }
        }
    };"""

normalized_old_del_var = old_del_var.replace("\r\n", "\n")
normalized_new_del_var = new_del_var.replace("\r\n", "\n")

if normalized_old_del_var in code:
    code = code.replace(normalized_old_del_var, normalized_new_del_var)
    print("Updated handleDeleteVariant successfully!")
else:
    print("WARNING: handleDeleteVariant not found!")

# --- Step 8: Update toggleSelectAllVariants ---
old_sel_all = """    const toggleSelectAllVariants = () => {
        if (selectedVariantIds.length === extraVariants.length) {
            setSelectedVariantIds([]);
        } else {
            setSelectedVariantIds(extraVariants.map(v => v.id));
        }
    };"""

new_sel_all = """    const toggleSelectAllVariants = () => {
        const currentVariants = modalType === 'add' ? newProductVariants : extraVariants;
        if (selectedVariantIds.length === currentVariants.length) {
            setSelectedVariantIds([]);
        } else {
            setSelectedVariantIds(currentVariants.map(v => v.id));
        }
    };"""

normalized_old_sel_all = old_sel_all.replace("\r\n", "\n")
normalized_new_sel_all = new_sel_all.replace("\r\n", "\n")

if normalized_old_sel_all in code:
    code = code.replace(normalized_old_sel_all, normalized_new_sel_all)
    print("Updated toggleSelectAllVariants successfully!")
else:
    print("WARNING: toggleSelectAllVariants not found!")

# --- Step 9: Update handleDeleteSelectedVariants ---
old_bulk_del = """    const handleDeleteSelectedVariants = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedVariantIds.length} biến thể đã chọn?`)) return;
        
        let successCount = 0;
        for (const id of selectedVariantIds) {
            const res = await fetchApi(`/products/variants/${id}`, {
                method: 'DELETE'
            });
            if (res.success) successCount++;
        }
        
        setSelectedVariantIds([]);
        loadProductExtra(selectedExtraProduct.id);
        alert(`Đã xóa thành công ${successCount} biến thể!`);
    };"""

new_bulk_del = """    const handleDeleteSelectedVariants = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedVariantIds.length} biến thể đã chọn?`)) return;
        
        if (modalType === 'add') {
            setNewProductVariants(prev => prev.filter(v => !selectedVariantIds.includes(v.id)));
            setSelectedVariantIds([]);
            alert('Đã xóa các biến thể được chọn!');
        } else {
            let successCount = 0;
            for (const id of selectedVariantIds) {
                const res = await fetchApi(`/products/variants/${id}`, {
                    method: 'DELETE'
                });
                if (res.success) successCount++;
            }
            
            setSelectedVariantIds([]);
            loadProductExtra(selectedExtraProduct.id);
            alert(`Đã xóa thành công ${successCount} biến thể!`);
        }
    };"""

normalized_old_bulk_del = old_bulk_del.replace("\r\n", "\n")
normalized_new_bulk_del = new_bulk_del.replace("\r\n", "\n")

if normalized_old_bulk_del in code:
    code = code.replace(normalized_old_bulk_del, normalized_new_bulk_del)
    print("Updated handleDeleteSelectedVariants successfully!")
else:
    print("WARNING: handleDeleteSelectedVariants not found!")

# --- Step 10: Update saveEditingVariant ---
old_save_edit_var = """    const saveEditingVariant = async (id) => {
        const res = await fetchApi(`/products/variants/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                color: editingVariantData.color || null,
                size: editingVariantData.size || null,
                price: editingVariantData.price !== '' ? Number(editingVariantData.price) : null,
                stock: Number(editingVariantData.stock),
                image: editingVariantData.image || null
            })
        });

        if (res.success) {
            setEditingVariantId(null);
            loadProductExtra(selectedExtraProduct.id);
            alert('Cập nhật biến thể thành công!');
        } else {
            alert(res.message || 'Cập nhật thất bại!');
        }
    };"""

new_save_edit_var = """    const saveEditingVariant = async (id) => {
        if (modalType === 'add') {
            setNewProductVariants(prev => prev.map(v => {
                if (v.id === id) {
                    return {
                        ...v,
                        color: editingVariantData.color || null,
                        size: editingVariantData.size || null,
                        price: editingVariantData.price !== '' ? Number(editingVariantData.price) : null,
                        stock: Number(editingVariantData.stock),
                        image: editingVariantData.image || null
                    };
                }
                return v;
            }));
            setEditingVariantId(null);
            alert('Cập nhật biến thể thành công!');
        } else {
            const res = await fetchApi(`/products/variants/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    color: editingVariantData.color || null,
                    size: editingVariantData.size || null,
                    price: editingVariantData.price !== '' ? Number(editingVariantData.price) : null,
                    stock: Number(editingVariantData.stock),
                    image: editingVariantData.image || null
                })
            });

            if (res.success) {
                setEditingVariantId(null);
                loadProductExtra(selectedExtraProduct.id);
                alert('Cập nhật biến thể thành công!');
            } else {
                alert(res.message || 'Cập nhật thất bại!');
            }
        }
    };"""

normalized_old_save = old_save_edit_var.replace("\r\n", "\n")
normalized_new_save = new_save_edit_var.replace("\r\n", "\n")

if normalized_old_save in code:
    code = code.replace(normalized_old_save, normalized_new_save)
    print("Updated saveEditingVariant successfully!")
else:
    print("WARNING: saveEditingVariant not found!")

# --- Step 11: Update applyBulkEdit ---
old_bulk_edit = """    const applyBulkEdit = async () => {
        if (selectedVariantIds.length === 0) return;
        
        let successCount = 0;
        for (const id of selectedVariantIds) {
            const original = extraVariants.find(v => v.id === id);
            if (!original) continue;
            
            const updateData = {
                color: bulkEditData.color !== '' ? bulkEditData.color : original.color,
                size: bulkEditData.size !== '' ? bulkEditData.size : original.size,
                price: bulkEditData.price !== '' ? Number(bulkEditData.price) : original.price,
                stock: bulkEditData.stock !== '' ? Number(bulkEditData.stock) : original.stock,
                image: original.image
            };
            
            const res = await fetchApi(`/products/variants/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
            if (res.success) successCount++;
        }
        
        setSelectedVariantIds([]);
        setShowBulkEditForm(false);
        setBulkEditData({ color: '', size: '', price: '', stock: '' });
        loadProductExtra(selectedExtraProduct.id);
        alert(`Đã cập nhật hàng loạt thành công ${successCount} biến thể!`);
    };"""

new_bulk_edit = """    const applyBulkEdit = async () => {
        if (selectedVariantIds.length === 0) return;
        
        if (modalType === 'add') {
            setNewProductVariants(prev => prev.map(v => {
                if (selectedVariantIds.includes(v.id)) {
                    return {
                        ...v,
                        color: bulkEditData.color !== '' ? bulkEditData.color : v.color,
                        size: bulkEditData.size !== '' ? bulkEditData.size : v.size,
                        price: bulkEditData.price !== '' ? Number(bulkEditData.price) : v.price,
                        stock: bulkEditData.stock !== '' ? Number(bulkEditData.stock) : v.stock
                    };
                }
                return v;
            }));
            setSelectedVariantIds([]);
            setShowBulkEditForm(false);
            setBulkEditData({ color: '', size: '', price: '', stock: '' });
            alert(`Đã cập nhật hàng loạt thành công các biến thể!`);
        } else {
            let successCount = 0;
            for (const id of selectedVariantIds) {
                const original = extraVariants.find(v => v.id === id);
                if (!original) continue;
                
                const updateData = {
                    color: bulkEditData.color !== '' ? bulkEditData.color : original.color,
                    size: bulkEditData.size !== '' ? bulkEditData.size : original.size,
                    price: bulkEditData.price !== '' ? Number(bulkEditData.price) : original.price,
                    stock: bulkEditData.stock !== '' ? Number(bulkEditData.stock) : original.stock,
                    image: original.image
                };
                
                const res = await fetchApi(`/products/variants/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updateData)
                });
                if (res.success) successCount++;
            }
            
            setSelectedVariantIds([]);
            setShowBulkEditForm(false);
            setBulkEditData({ color: '', size: '', price: '', stock: '' });
            loadProductExtra(selectedExtraProduct.id);
            alert(`Đã cập nhật hàng loạt thành công ${successCount} biến thể!`);
        }
    };"""

normalized_old_bulk = old_bulk_edit.replace("\r\n", "\n")
normalized_new_bulk = new_bulk_edit.replace("\r\n", "\n")

if normalized_old_bulk in code:
    code = code.replace(normalized_old_bulk, normalized_new_bulk)
    print("Updated applyBulkEdit successfully!")
else:
    print("WARNING: applyBulkEdit not found!")

# Restore CRLF
code = code.replace("\n", "\r\n")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Backend/Frontend integration helper update complete!")
