import http.server
import socketserver
import os

# Định nghĩa cổng máy chủ
PORT = 8000

# Xử lý các yêu cầu HTTP
handler = http.server.SimpleHTTPRequestHandler

# Tạo máy chủ
with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Đang chạy máy chủ tại http://localhost:{PORT}")
    print(f"Để dừng máy chủ, nhấn Ctrl+C")
    
    # Phục vụ các tệp từ thư mục hiện tại
    httpd.serve_forever() 