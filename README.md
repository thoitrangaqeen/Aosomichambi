# Trang Web Bán Quần Ống Rộng Kẻ Sọc

Đây là mã nguồn cho trang web bán quần ống rộng kẻ sọc với tính năng Flash Sale và form đặt hàng kết nối với Google Sheets.

## Cấu trúc thư mục

```
shop quần áo/
├── index.html      - Trang chính
├── styles.css      - File CSS
├── script.js       - JavaScript
└── images/         - Thư mục chứa hình ảnh sản phẩm
```

## Tính năng

- Giao diện tối ưu cho điện thoại di động
- Hiệu ứng Flash Sale với đồng hồ đếm ngược 2 giờ
- Hiển thị giá gốc (299k) và giá sale (199k)
- Form đặt hàng kết nối với Google Sheets
- Hiệu ứng động để thu hút người dùng

## Hướng dẫn kết nối Google Sheets

1. Tạo Google Sheets mới
2. Đặt tên cho các cột: Họ tên, Số điện thoại, Địa chỉ, Kích thước, Màu sắc, Số lượng, Ghi chú, Tổng tiền, Ngày đặt hàng
3. Mở Google Apps Script bằng cách chọn Extensions > Apps Script
4. Xóa mã mặc định và dán mã sau:

```javascript
// Cấu hình Bot Telegram - Thêm thông tin của bạn ở đây
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"; // Token từ BotFather
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID"; // Chat ID của bạn hoặc nhóm

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Lấy dữ liệu từ request
  var data = e.parameter;
  
  // Log dữ liệu nhận được để debug
  Logger.log("Dữ liệu nhận được: " + JSON.stringify(data));
  
  // Thêm dữ liệu vào sheet
  sheet.appendRow([
    data.fullName,
    data.phone,
    data.address,
    data.size,
    data.color,
    data.quantity,
    data.note,
    data.totalPrice,
    data.orderDate
  ]);
  
  // Gửi thông báo qua Telegram
  sendTelegramNotification(data);
  
  // Trả về kết quả
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm gửi thông báo đến Telegram
function sendTelegramNotification(orderData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
    Logger.log("Chưa cấu hình Telegram Bot");
    return;
  }
  
  // Tạo nội dung thông báo
  var message = "🛍️ *ĐƠN HÀNG MỚI* 🛍️\n\n" +
                "👤 *Khách hàng:* " + orderData.fullName + "\n" +
                "📱 *SĐT:* " + orderData.phone + "\n" +
                "🏠 *Địa chỉ:* " + orderData.address + "\n" +
                "📏 *Kích thước:* " + orderData.size + "\n" + 
                "🎨 *Màu sắc:* " + orderData.color + "\n" +
                "🔢 *Số lượng:* " + orderData.quantity + "\n" +
                "💰 *Tổng tiền:* " + orderData.totalPrice + "\n" +
                "📝 *Ghi chú:* " + (orderData.note || "Không có") + "\n" +
                "🕒 *Thời gian:* " + orderData.orderDate;
  
  // Gửi thông báo
  var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
  var payload = {
    "method": "post",
    "payload": {
      "chat_id": TELEGRAM_CHAT_ID,
      "text": message,
      "parse_mode": "Markdown"
    }
  };
  
  try {
    UrlFetchApp.fetch(telegramUrl, payload);
    Logger.log("Đã gửi thông báo Telegram");
  } catch (error) {
    Logger.log("Lỗi khi gửi thông báo Telegram: " + error);
  }
}
```

5. Thay thế `YOUR_BOT_TOKEN` bằng token bot Telegram của bạn
6. Thay thế `YOUR_CHAT_ID` bằng chat ID của bạn hoặc nhóm
7. Lưu script
8. Nhấp vào "Deploy" > "New deployment"
9. Chọn loại "Web app"
10. Đặt:
   - Execute as: "Me"
   - Who has access: "Anyone"
11. Nhấp "Deploy"
12. Sao chép URL Web App và dán vào biến `scriptURL` trong file script.js

## Hướng dẫn tùy chỉnh

### Thay đổi thông tin sản phẩm

Mở file `index.html` và tìm các phần sau để chỉnh sửa:

- Thay đổi tên sản phẩm: Tìm thẻ `<h2>Quần Ống Rộng Kẻ Sọc Thời Trang</h2>`
- Thay đổi giá: Tìm `.current-price` và `.original-price`
- Thay đổi thông tin chi tiết sản phẩm: Tìm phần `<section class="product-details">`

### Thay đổi hình ảnh

1. Thêm hình ảnh sản phẩm vào thư mục `images/`
2. Cập nhật đường dẫn trong phần `<section class="product-images">`

### Thay đổi thời gian Flash Sale

Mở file `script.js` và tìm dòng:
```javascript
let totalSeconds = 2 * 60 * 60; // 2 giờ
```

Thay đổi số giờ theo nhu cầu.

## Cài đặt thông báo Telegram

### Tạo Bot Telegram
1. Mở Telegram và tìm kiếm "@BotFather"
2. Gửi lệnh `/newbot` và làm theo hướng dẫn để tạo bot
3. Lưu lại token API mà BotFather cung cấp

### Lấy Chat ID
1. Tìm bot "@userinfobot" trên Telegram
2. Gửi bất kỳ tin nhắn nào cho bot này
3. Bot sẽ trả về ID của bạn (Chat ID)

### Kích hoạt bot
1. Tìm bot bạn vừa tạo trên Telegram
2. Nhấn Start để kích hoạt bot

### Cập nhật Google Apps Script
1. Thay thế `YOUR_BOT_TOKEN` bằng token API từ BotFather
2. Thay thế `YOUR_CHAT_ID` bằng Chat ID bạn đã lấy được
3. Triển khai lại script (New deployment)

## Chạy trang web

Mở file `index.html` trong trình duyệt để xem trang web.
