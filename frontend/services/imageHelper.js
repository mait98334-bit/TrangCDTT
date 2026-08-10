const BACKEND_URL = 'http://localhost:5000';

export function getImageUrl(imagePath) {
    if (!imagePath) {
        return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop';
    }
    // Nếu là đường dẫn tuyệt đối (bắt đầu bằng http hoặc https), trả về nguyên bản
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Nếu không, nối với địa chỉ máy chủ API Backend
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BACKEND_URL}${cleanPath}`;
}
