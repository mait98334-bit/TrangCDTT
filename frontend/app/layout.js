import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["vietnamese", "latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-plus-jakarta",
});

export const metadata = {
    title: "TRANG STORE - Cửa Hàng Thời Trang Thể Thao Cao Cấp",
    description: "Website mua sắm thời trang thể thao cao cấp chính hãng",
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <body className={`${plusJakartaSans.className} antialiased`}>
                {children}
            </body>
        </html>
    );
}