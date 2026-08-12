import os
import subprocess

file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(file_path, "rb") as f:
    binary_content = f.read()

# Decode to string with unix newlines
text = binary_content.replace(b'\r', b'').decode('utf-8')

# Find markers for replacing the modal structure
start_marker = "      {showModal && ("
end_marker = "            </div>\n          </div>\n        </div>\n      )}"

# Search for the start index of showModal block
start_idx = text.find(start_marker)

# Find the end of the showModal block
# Let's search from the end of the file backwards
end_idx = text.rfind("      )}")

if start_idx != -1 and end_idx != -1:
    print(f"Found modal block from index {start_idx} to {end_idx}")
    
    new_modal_block = """      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] max-w-4xl animate-in fade-in zoom-in-95 duration-200 transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {modalType === "add" ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
                </h3>
                {modalType === "edit" && (
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    {formData.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
              {/* PHẦN 1: THÔNG TIN CHUNG */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-indigo-700 border-b pb-2 flex items-center gap-1.5 bg-indigo-50/50 -mx-6 px-6 py-2">
                  ℹ️ Thông tin chung
                </h4>
                <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ví dụ: Áo khoác Blazer Hàn Quốc"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Danh mục
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Thương hiệu
                      </label>
                      <select
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Giá bán gốc (đ) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="Ví dụ: 350000"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Giá khuyến mãi (đ)
                      </label>
                      <input
                        type="number"
                        name="price_sale"
                        value={formData.price_sale}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: 280000"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Hình ảnh sản phẩm
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-indigo-500 rounded-2xl p-4 transition-all bg-gray-50/50 relative group min-h-[120px]">
                        {uploadingFile ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-500 font-medium">
                              Đang tải ảnh lên...
                            </span>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center py-2">
                            <svg
                              className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-1.5 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              ></path>
                            </svg>
                            <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
                              Chọn ảnh từ máy tính
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">
                              Hỗ trợ JPG, PNG, WEBP, GIF
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="Hoặc dán URL ảnh trực tiếp"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                        />
                        {formData.image && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto sm:mx-0">
                            <img
                              src={getImageUrl(formData.image)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                              className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors cursor-pointer flex items-center justify-center text-[10px]"
                              style={{ width: "20px", height: "20px" }}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Mô tả chi tiết chất liệu, kích cỡ, form dáng..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Trạng thái đặc biệt
                    </span>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                        <input
                          type="checkbox"
                          name="is_sale"
                          checked={Number(formData.is_sale) === 1}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">
                          Khuyến Mãi
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                        <input
                          type="checkbox"
                          name="is_hot"
                          checked={Number(formData.is_hot) === 1}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">
                          Bán Chạy (HOT)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                        <input
                          type="checkbox"
                          name="is_new"
                          checked={Number(formData.is_new) === 1}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">
                          Hàng Mới Về
                        </span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* PHẦN 2: QUẢN LÝ ẢNH PHỤ */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-indigo-700 border-b pb-2 flex items-center gap-1.5 bg-indigo-50/50 -mx-6 px-6 py-2">
                  🖼️ Ảnh phụ ({modalType === "add" ? newProductImages.length : extraImages.length})
                </h4>
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4">
                  <h5 className="text-xs font-bold text-gray-700">
                    Thêm ảnh phụ mới
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 hover:border-indigo-500 rounded-xl p-3 transition-all bg-white relative group cursor-pointer">
                      {uploadingExtraFile ? (
                        <div className="text-center py-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-1"></div>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            Đang tải lên...
                          </span>
                        </div>
                      ) : (
                        <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center py-1.5">
                          <span className="text-[11px] font-bold text-gray-600 group-hover:text-indigo-600">
                            Chọn ảnh từ máy tính
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleExtraImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <form onSubmit={handleAddExtraImageUrl} className="flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Hoặc dán URL ảnh phụ..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Thêm URL
                      </button>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pr-1">
                  {(modalType === "add" ? newProductImages : extraImages).length === 0 ? (
                    <div className="col-span-full py-6 text-center text-gray-400 text-xs font-medium">
                      Chưa có ảnh phụ nào được thêm cho sản phẩm này.
                    </div>
                  ) : (
                    (modalType === "add" ? newProductImages : extraImages).map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50"
                      >
                        <img
                          src={img.image_url}
                          alt="Extra sub"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteExtraImage(img.id)}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center text-[9px]"
                          style={{ width: "22px", height: "22px" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* PHẦN 3: QUẢN LÝ BIẾN THỂ */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-indigo-700 border-b pb-2 flex items-center gap-1.5 bg-indigo-50/50 -mx-6 px-6 py-2">
                  👟 Biến thể ({modalType === "add" ? newProductVariants.length : extraVariants.length})
                </h4>
                <form
                  onSubmit={handleAddVariant}
                  className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4"
                >
                  <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
                    {tempVariants.map((item, index) => (
                      <div
                        key={index}
                        className="relative bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-xs font-black text-indigo-600">
                            Biến thể #{index + 1}
                          </span>
                          {tempVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTempVariantRow(index)}
                              className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              ✕ Xóa dòng
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                              Màu sắc
                            </label>
                            <input
                              type="text"
                              value={item.color}
                              onChange={(e) =>
                                handleTempVariantChange(
                                  index,
                                  "color",
                                  e.target.value,
                                )
                              }
                              onFocus={() =>
                                setFocusedRow({ index, field: "color" })
                              }
                              placeholder="Đen, Trắng..."
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                            />
                            {focusedRow.index === index &&
                              focusedRow.field === "color" && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {["Đen", "Trắng", "Xám", "Xanh", "Đỏ", "Hồng", "Vàng"].map((col) => {
                                    const isActive = item.color === col;
                                    return (
                                      <button
                                        key={col}
                                        type="button"
                                        onClick={() =>
                                          handleTempVariantChange(
                                            index,
                                            "color",
                                            col,
                                          )
                                        }
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                                          isActive
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                      >
                                        {col}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                              Kích cỡ
                            </label>
                            <input
                              type="text"
                              value={item.size}
                              onChange={(e) =>
                                handleTempVariantChange(
                                  index,
                                  "size",
                                  e.target.value,
                                )
                              }
                              onFocus={() =>
                                setFocusedRow({ index, field: "size" })
                              }
                              placeholder="S, M, L, 39, 40..."
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                            />
                            {focusedRow.index === index &&
                              focusedRow.field === "size" && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {[
                                    "S", "M", "L", "XL", "XXL",
                                    "38", "39", "40", "41", "42", "43", "44",
                                    "Free",
                                  ].map((sz) => {
                                    const isActive = item.size
                                      .split(".")
                                      .includes(sz);
                                    return (
                                      <button
                                        key={sz}
                                        type="button"
                                        onClick={() => {
                                          let currentSizes = item.size
                                            ? item.size.split(".")
                                            : [];
                                          currentSizes =
                                            currentSizes.filter(
                                              (s) => s.trim() !== "",
                                            );
                                          if (sz === "Free") {
                                            currentSizes = ["Free Size"];
                                          } else {
                                            currentSizes =
                                              currentSizes.filter(
                                                (s) => s !== "Free Size",
                                              );
                                            if (
                                              currentSizes.includes(sz)
                                            ) {
                                              currentSizes =
                                                currentSizes.filter(
                                                  (s) => s !== sz,
                                                );
                                            } else {
                                              currentSizes.push(sz);
                                            }
                                          }
                                          handleTempVariantChange(
                                            index,
                                            "size",
                                            currentSizes.join("."),
                                          );
                                        }}
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                                          isActive
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                      >
                                        {sz}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                              Giá phụ thu
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleTempVariantChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              placeholder="Ví dụ: 20000"
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                              Số lượng kho *
                            </label>
                            <input
                              type="number"
                              value={item.stock}
                              onChange={(e) =>
                                handleTempVariantChange(
                                  index,
                                  "stock",
                                  e.target.value,
                                )
                              }
                              required
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-gray-100 pt-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                              Ảnh biến thể
                            </label>
                            <div className="flex gap-2">
                              <input
                                  type="text"
                                  value={item.image}
                                  onChange={(e) =>
                                    handleTempVariantChange(
                                      index,
                                      "image",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Dán URL ảnh hoặc click tải ảnh..."
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                              />
                              <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center">
                                📁 Tải lên
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVariantImageUpload(e, index)
                                  }
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            {item.image ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                  src={getImageUrl(item.image)}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTempVariantChange(
                                      index,
                                      "image",
                                      "",
                                    )
                                  }
                                  className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 text-[8px] leading-none"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-400 italic">
                                Chưa chọn ảnh cho biến thể
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={addTempVariantRow}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      ➕ Thêm dòng mới
                    </button>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Lưu tất cả biến thể ({tempVariants.length})
                    </button>
                  </div>
                </form>

                {/* Bulk Actions Bar */}
                {selectedVariantIds.length > 0 && (
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-900">
                        Đang chọn{" "}
                        <span className="text-rose-600">
                          {selectedVariantIds.length}
                        </span>{" "}
                        biến thể
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setShowBulkEditForm(!showBulkEditForm)
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          {showBulkEditForm
                            ? "✕ Đóng Panel"
                            : "✏️ Sửa hàng loạt"}
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteSelectedVariants}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          🗑️ Xóa đã chọn
                        </button>
                      </div>
                    </div>

                    {showBulkEditForm && (
                      <div className="bg-white border border-indigo-100 rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Màu sắc mới
                          </label>
                          <input
                            type="text"
                            value={bulkEditData.color}
                            onChange={(e) =>
                              setBulkEditData((prev) => ({
                                ...prev,
                                color: e.target.value,
                              }))
                            }
                            placeholder="Đen, Trắng..."
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Size mới
                          </label>
                          <input
                            type="text"
                            value={bulkEditData.size}
                            onChange={(e) =>
                              setBulkEditData((prev) => ({
                                ...prev,
                                size: e.target.value,
                              }))
                            }
                            placeholder="S, M, L..."
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                            Giá phụ thu mới
                          </label>
                          <input
                            type="number"
                            value={bulkEditData.price}
                            onChange={(e) =>
                              setBulkEditData((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            placeholder="Ví dụ: 10000"
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                              Tồn kho mới
                            </label>
                            <input
                              type="number"
                              value={bulkEditData.stock}
                              onChange={(e) =>
                                setBulkEditData((prev) => ({
                                  ...prev,
                                  stock: e.target.value,
                                }))
                              }
                              placeholder="0"
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={applyBulkEdit}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm overflow-auto max-h-[40vh]">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 font-bold">
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              (modalType === "add" ? newProductVariants : extraVariants).length > 0 &&
                              selectedVariantIds.length === (modalType === "add" ? newProductVariants : extraVariants).length
                            }
                            onChange={toggleSelectAllVariants}
                            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 font-bold">ID</th>
                        <th className="p-3 font-bold">Hình ảnh</th>
                        <th className="p-3 font-bold">Màu sắc</th>
                        <th className="p-3 font-bold">Kích cỡ</th>
                        <th className="p-3 font-bold">Giá phụ thu</th>
                        <th className="p-3 font-bold">Tồn kho</th>
                        <th className="p-3 font-bold text-center">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {(modalType === "add" ? newProductVariants : extraVariants).length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="p-4 text-center text-gray-400"
                          >
                            Chưa cấu hình biến thể nào cho sản phẩm.
                          </td>
                        </tr>
                      ) : (
                        (modalType === "add" ? newProductVariants : extraVariants).map((v) => {
                          const isEditing = editingVariantId === v.id;
                          const isSelected = selectedVariantIds.includes(
                            v.id,
                          );
                          return (
                            <tr
                              key={v.id}
                              className={`hover:bg-gray-50/50 transition-colors ${
                                isSelected ? "bg-indigo-50/20" : ""
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleSelectVariant(v.id)
                                  }
                                  className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                              </td>
                              <td className="p-3 text-gray-400">
                                {typeof v.id === "string" && v.id.startsWith("temp_") ? "Chờ lưu" : `#${v.id}`}
                              </td>
                              <td className="p-3">
                                {isEditing ? (
                                  <div className="flex gap-1.5 items-center">
                                    {editingVariantData.image ? (
                                      <div className="relative w-8 h-8 rounded-md overflow-hidden border">
                                        <img
                                          src={getImageUrl(
                                            editingVariantData.image,
                                          )}
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingVariantData(
                                              (prev) => ({
                                                ...prev,
                                                image: "",
                                              }),
                                            )
                                          }
                                          className="absolute top-0 right-0 bg-rose-600 text-white rounded-full p-0.5 text-[6px] leading-none"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-colors flex items-center justify-center">
                                        📁 Tải ảnh
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={
                                            handleEditingVariantImageUpload
                                          }
                                          className="hidden"
                                        />
                                      </label>
                                    )}
                                    <input
                                      type="text"
                                      value={editingVariantData.image}
                                      onChange={(e) =>
                                        setEditingVariantData(
                                          (prev) => ({
                                            ...prev,
                                            image: e.target.value,
                                          }),
                                        )
                                      }
                                      placeholder="URL..."
                                      className="w-16 px-1 py-0.5 border text-[10px] rounded focus:outline-none"
                                    />
                                  </div>
                                ) : v.image ? (
                                  <img
                                    src={getImageUrl(v.image)}
                                    className="w-8 h-8 object-cover rounded-md border border-gray-100 shadow-sm"
                                  />
                                ) : (
                                  <span className="text-gray-400 italic text-[10px]">
                                    Không có
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-semibold text-gray-700">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editingVariantData.color}
                                    onChange={(e) =>
                                      setEditingVariantData((prev) => ({
                                        ...prev,
                                        color: e.target.value,
                                      }))
                                    }
                                    className="w-20 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  v.color || "-"
                                )}
                              </td>
                              <td className="p-3 font-semibold text-gray-700">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editingVariantData.size}
                                    onChange={(e) =>
                                      setEditingVariantData((prev) => ({
                                        ...prev,
                                        size: e.target.value,
                                      }))
                                    }
                                    className="w-24 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  v.size || "-"
                                )}
                              </td>
                              <td className="p-3 text-rose-600 font-bold">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={editingVariantData.price}
                                    onChange={(e) =>
                                      setEditingVariantData((prev) => ({
                                        ...prev,
                                        price: e.target.value,
                                      }))
                                    }
                                    placeholder="Dùng giá gốc"
                                    className="w-24 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : v.price ? (
                                  `${Number(v.price).toLocaleString(
                                    "vi-VN",
                                  )} đ`
                                ) : (
                                  "Dùng giá gốc"
                                )}
                              </td>
                              <td className="p-3 text-gray-700 font-medium">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={editingVariantData.stock}
                                    onChange={(e) =>
                                      setEditingVariantData((prev) => ({
                                        ...prev,
                                        stock: e.target.value,
                                      }))
                                    }
                                    className="w-16 px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    required
                                  />
                                ) : (
                                  `${v.stock} sản phẩm`
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {isEditing ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          saveEditingVariant(v.id)
                                        }
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                                      >
                                        Lưu
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditingVariantId(null)
                                        }
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                                      >
                                        Hủy
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          startEditingVariant(v)
                                        }
                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                                        style={{ display: "inline-flex" }}
                                      >
                                        Sửa
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteVariant(v.id)
                                        }
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
                                      >
                                        Xóa
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* UNIFIED MODAL FOOTER */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 text-sm">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveProductClick}
                disabled={submitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
              >
                {submitting
                  ? "Đang lưu..."
                  : modalType === "add"
                    ? "Thêm sản phẩm"
                    : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}"""
    
    # Replace the block
    new_text = text[:start_idx] + new_modal_block + text[end_idx + 8:]
    
    # Save back to file as binary UTF-8
    with open(file_path, "wb") as f:
        f.write(new_text.encode('utf-8'))
        
    print("Replaced modal block layout successfully!")
    
    # Run prettier
    subprocess.run(["npx.cmd", "prettier", "--write", file_path], shell=True)
    print("Prettier formatting applied!")
else:
    print("ERROR: Could not find markers!")
    print("start_idx:", start_idx)
    print("end_idx:", end_idx)
