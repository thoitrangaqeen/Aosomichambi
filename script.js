// Đồng hồ đếm ngược Flash Sale
function startCountdown() {
    // Đặt thời gian đếm ngược 2 giờ (đơn vị: giây)
    let totalSeconds = 2 * 60 * 46;
    
    // Lấy các phần tử hiển thị thời gian
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Cập nhật đồng hồ mỗi giây
    const countdownInterval = setInterval(function() {
        // Tính toán giờ, phút, giây
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Cập nhật hiển thị
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Cập nhật đồng hồ đếm ngược trong form đặt hàng
        if (document.getElementById('orderHours')) {
            document.getElementById('orderHours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('orderMinutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('orderSeconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        // Giảm thời gian còn lại
        totalSeconds--;
        
        // Nếu hết thời gian, dừng đếm ngược
        if (totalSeconds < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.flash-sale-container').innerHTML = '<div class="flash-sale-header"><div class="flash-sale-title"><i class="fas fa-clock"></i> Flash Sale đã kết thúc!</div></div>';
        }
    }, 1000);
    
    // Lưu thời gian bắt đầu vào localStorage để duy trì khi tải lại trang
    localStorage.setItem('countdownStartTime', Date.now());
    localStorage.setItem('countdownDuration', 2 * 60 * 60 * 1000);
}

// Định nghĩa mảng chứa đường dẫn hình ảnh
const imageSources = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/5.jpg',
    'images/4.jpg'
];

// Biến theo dõi trạng thái đang hiển thị (ảnh hoặc video)
let isVideoPlaying = false;

// Hàm xử lý đổi hình ảnh sản phẩm khi nhấp vào thumbnail
function changeImage(src, thumbnail) {
    // Ẩn video nếu đang hiển thị
    const productVideo = document.getElementById('productVideo');
    const mainImage = document.getElementById('mainImage');
    
    productVideo.style.display = 'none';
    mainImage.style.display = 'block';
    
    // Hiển thị hình ảnh
    mainImage.src = src;
    
    // Cập nhật trạng thái active cho thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
    
    // Cập nhật trạng thái
    isVideoPlaying = false;
}

// Hàm hiển thị video
function showVideo(thumbnail) {
    const productVideo = document.getElementById('productVideo');
    const mainImage = document.getElementById('mainImage');
    
    // Hiển thị video, ẩn hình ảnh
    mainImage.style.display = 'none';
    productVideo.style.display = 'block';
    
    // Tự động phát video
    productVideo.play();
    
    // Cập nhật trạng thái active cho thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
    
    // Cập nhật trạng thái
    isVideoPlaying = true;
}

// Hàm lấy chỉ số của hình ảnh từ đường dẫn
function getImageIndex(src) {
    const filename = src.split('/').pop();
    for (let i = 0; i < imageSources.length; i++) {
        if (imageSources[i].includes(filename)) {
            return i;
        }
    }
    return 0;
}

// Hàm cập nhật hình ảnh theo chỉ số
function updateImageByIndex(index) {
    const src = imageSources[index];
    const thumbnail = document.querySelector(`.thumbnail[data-index="${index}"]`);
    if (thumbnail) {
        changeImage(src, thumbnail);
    }
}

// Hàm chuyển đến hình ảnh trước đó
function prevImage() {
    // Nếu đang xem video, chuyển về hình ảnh cuối cùng
    if (isVideoPlaying) {
        const lastIndex = imageSources.length - 1;
        updateImageByIndex(lastIndex);
        return;
    }
    
    const mainImage = document.getElementById('mainImage');
    const currentSrc = mainImage.src;
    const currentIndex = getImageIndex(currentSrc);
    
    // Tính toán chỉ số của hình ảnh trước đó
    const prevIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    
    // Cập nhật hình ảnh
    updateImageByIndex(prevIndex);
}

// Hàm chuyển đến hình ảnh tiếp theo
function nextImage() {
    // Nếu đang xem video, chuyển về hình ảnh đầu tiên
    if (isVideoPlaying) {
        updateImageByIndex(0);
        return;
    }
    
    const mainImage = document.getElementById('mainImage');
    const currentSrc = mainImage.src;
    const currentIndex = getImageIndex(currentSrc);
    
    // Tính toán chỉ số của hình ảnh tiếp theo
    const nextIndex = (currentIndex + 1) % imageSources.length;
    
    // Cập nhật hình ảnh
    updateImageByIndex(nextIndex);
}

// Gán các hàm vào window để có thể gọi từ HTML
window.changeImage = changeImage;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.showVideo = showVideo;

// Khởi tạo đồng hồ đếm ngược khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Bắt đầu đồng hồ đếm ngược
    startCountdown();
    
    // Xử lý nút chọn kích thước
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa lớp active khỏi tất cả các nút
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm lớp active cho nút được chọn
            this.classList.add('active');
            
            // Cập nhật kích thước đã chọn trong form đặt hàng
            const selectedSize = this.getAttribute('data-size');
            document.getElementById('orderSize').value = selectedSize;
        });
    });
    
    // Đồng bộ ngược lại từ form đặt hàng đến lựa chọn kích thước
    document.getElementById('orderSize').addEventListener('change', function() {
        const selectedSize = this.value;
        if (selectedSize) {
            // Xóa lớp active khỏi tất cả các nút
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            // Tìm và kích hoạt nút kích thước tương ứng
            const matchingButton = document.querySelector(`.size-btn[data-size="${selectedSize}"]`);
            if (matchingButton) {
                matchingButton.classList.add('active');
            }
        }
    });
    
    // Xử lý nút chọn màu sắc
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa lớp active khỏi tất cả các nút
            colorButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm lớp active cho nút được chọn
            this.classList.add('active');
            
            // Cập nhật màu sắc đã chọn trong form đặt hàng
            const selectedColor = this.getAttribute('data-color');
            document.getElementById('orderColor').value = selectedColor;
        });
    });
    
    // Xử lý nút tăng/giảm số lượng
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const quantityInput = document.getElementById('quantity');
    const orderQuantityInput = document.getElementById('orderQuantity');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const totalPrice = document.getElementById('totalPrice');
    
    // Cập nhật tổng tiền dựa trên số lượng
    function updateTotalPrice() {
        const quantity = parseInt(orderQuantityInput.value);
        const price = 259000; // Giá khuyến mãi: 259.000đ
        const originalPrice = 449000; // Giá gốc: 449.000đ
        const total = quantity * price;
        const totalOriginal = quantity * originalPrice;
        totalPrice.textContent = formatCurrency(total);
        
        // Cập nhật giá gốc trong tổng tiền
        const totalOriginalPriceElement = document.getElementById('totalOriginalPrice');
        if (totalOriginalPriceElement) {
            totalOriginalPriceElement.textContent = formatCurrency(totalOriginal);
        }
    }
    
    // Định dạng số tiền thành chuỗi có dấu phân cách
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
    }
    
    // Cập nhật giá trị ở tất cả các vị trí khi số lượng thay đổi
    function updateQuantityEverywhere(value) {
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        
        // Cập nhật cả hai input số lượng
        quantityInput.value = value;
        orderQuantityInput.value = value;
        
        // Cập nhật số lượng hiển thị trong tổng kết
        summaryQuantity.textContent = value;
        
        // Cập nhật tổng tiền
        updateTotalPrice();
    }
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            value--;
            updateQuantityEverywhere(value);
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            value++;
            updateQuantityEverywhere(value);
        }
    });
    
    // Đồng bộ số lượng khi thay đổi trong phần thông tin sản phẩm
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        updateQuantityEverywhere(value);
    });
    
    // Đồng bộ số lượng khi thay đổi trong form đặt hàng
    orderQuantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        updateQuantityEverywhere(value);
    });
    
    // Khi load trang, đảm bảo nút kích thước được chọn theo giá trị trong form
    function initializeSizeSelection() {
        const currentSize = document.getElementById('orderSize').value;
        if (currentSize) {
            const matchingButton = document.querySelector(`.size-btn[data-size="${currentSize}"]`);
            if (matchingButton) {
                matchingButton.click();
            }
        }
    }
    
    // Khi load trang, đảm bảo số lượng được đồng bộ
    function initializeQuantity() {
        updateQuantityEverywhere(parseInt(quantityInput.value) || 1);
    }
    
    // Gọi các hàm khởi tạo
    initializeSizeSelection();
    initializeQuantity();
    
    // Thêm sự kiện bàn phím để chuyển ảnh
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Xử lý cuộn đến form đặt hàng khi nhấn nút "Mua ngay"
    window.scrollToOrderForm = function() {
        document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Xử lý form đặt hàng và gửi dữ liệu đến Google Sheets
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const quantity = parseInt(document.getElementById('orderQuantity').value);
        const price = 259000; // Giá khuyến mãi
        const originalPrice = 449000; // Giá gốc
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            size: document.getElementById('orderSize').value,
            color: document.getElementById('orderColor').value,
            quantity: document.getElementById('orderQuantity').value,
            note: document.getElementById('note').value,
            totalPrice: totalPrice.textContent,
            totalOriginalPrice: formatCurrency(quantity * originalPrice),
            discount: '45%',
            orderDate: new Date().toLocaleString()
        };
        
        console.log('Form data:', formData);
        
        // Gửi dữ liệu đến Google Sheets thông qua Google Apps Script
        sendToGoogleSheets(formData);
    });
    
    // Hàm gửi dữ liệu đến Google Sheets
    function sendToGoogleSheets(data) {
        // URL của Google Apps Script Web App
        // CHÚ Ý: Bạn cần thay thế URL này bằng URL của Google Apps Script Web App của bạn
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwqay8dEvMPw1SVmA6o8Lx2xkxLNPqDibjDhnatRANzj86xmJxf8cctwwJQRI2w4FnzYA/exec';
        
        // In ra URL để kiểm tra
        console.log('Đang gửi dữ liệu đến:', scriptURL);
        
        // Tạo dữ liệu gửi đi
        const formDataToSend = new FormData();
        Object.keys(data).forEach(key => {
            formDataToSend.append(key, data[key]);
            console.log(`Trường ${key}:`, data[key]); // In ra từng trường dữ liệu
        });
        
        // Hiển thị thông báo đang xử lý
        const submitButton = document.querySelector('#checkoutForm button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Đang xử lý...';
        submitButton.disabled = true;
        
        // Gửi dữ liệu bằng fetch API với mode no-cors để tránh vấn đề CORS
        fetch(scriptURL, {
            method: 'POST',
            body: formDataToSend,
            mode: 'no-cors'  // Thêm mode no-cors để tránh vấn đề CORS
        })
        .then(response => {
            console.log('Nhận được phản hồi:', response);
            
            // Với mode no-cors, response sẽ luôn là opaque (không thể đọc nội dung)
            // nên ta không thể kiểm tra response.ok
            // Thay vào đó, ta coi như yêu cầu đã thành công
            
            // Hiển thị popup thông báo thành công
            document.getElementById('popup').style.display = 'flex';
            // Reset form
            checkoutForm.reset();
            // Khôi phục nút submit
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            return 'Yêu cầu đã được gửi đi';
        })
        .catch(error => {
            console.error('Chi tiết lỗi:', error);
            alert('Có lỗi xảy ra khi gửi đơn hàng: ' + error.message);
            // Khôi phục nút submit
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
    }
    
    // Đóng popup khi nhấp vào nút đóng
    document.querySelector('.close-popup').addEventListener('click', function() {
        document.getElementById('popup').style.display = 'none';
    });
    
    // Khởi tạo giá trị ban đầu cho tổng tiền
    updateTotalPrice();
});

/*
 * HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS VÀ GOOGLE APPS SCRIPT
 * 
 * 1. Tạo Google Sheets mới
 * 2. Đặt tên cho các cột: Họ tên, Số điện thoại, Địa chỉ, Kích thước, Màu sắc, Số lượng, Ghi chú, Tổng tiền, Ngày đặt hàng
 * 3. Mở Google Apps Script bằng cách chọn Extensions > Apps Script
 * 4. Xóa mã mặc định và dán mã sau:
 *
 * // Cấu hình Bot Telegram - Thêm thông tin của bạn ở đây
 * const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"; // Token từ BotFather
 * const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID"; // Chat ID của bạn hoặc nhóm
 * 
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   
 *   // Lấy dữ liệu từ request
 *   var data = e.parameter;
 *   
 *   // Log dữ liệu nhận được để debug
 *   Logger.log("Dữ liệu nhận được: " + JSON.stringify(data));
 *   
 *   // Thêm dữ liệu vào sheet
 *   sheet.appendRow([
 *     data.fullName,
 *     data.phone,
 *     data.address,
 *     data.size,
 *     data.color,
 *     data.quantity,
 *     data.note,
 *     data.totalPrice,
 *     data.orderDate
 *   ]);
 *   
 *   // Gửi thông báo qua Telegram
 *   sendTelegramNotification(data);
 *   
 *   // Trả về kết quả
 *   return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * // Hàm gửi thông báo đến Telegram
 * function sendTelegramNotification(orderData) {
 *   if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") {
 *     Logger.log("Chưa cấu hình Telegram Bot");
 *     return;
 *   }
 *   
 *   // Tạo nội dung thông báo
 *   var message = "🛍️ *ĐƠN HÀNG MỚI* 🛍️\n\n" +
 *                 "👤 *Khách hàng:* " + orderData.fullName + "\n" +
 *                 "📱 *SĐT:* " + orderData.phone + "\n" +
 *                 "🏠 *Địa chỉ:* " + orderData.address + "\n" +
 *                 "📏 *Kích thước:* " + orderData.size + "\n" + 
 *                 "🎨 *Màu sắc:* " + orderData.color + "\n" +
 *                 "🔢 *Số lượng:* " + orderData.quantity + "\n" +
 *                 "💰 *Tổng tiền:* " + orderData.totalPrice + "\n" +
 *                 "📝 *Ghi chú:* " + (orderData.note || "Không có") + "\n" +
 *                 "🕒 *Thời gian:* " + orderData.orderDate;
 *   
 *   // Gửi thông báo
 *   var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
 *   var payload = {
 *     "method": "post",
 *     "payload": {
 *       "chat_id": TELEGRAM_CHAT_ID,
 *       "text": message,
 *       "parse_mode": "Markdown"
 *     }
 *   };
 *   
 *   try {
 *     UrlFetchApp.fetch(telegramUrl, payload);
 *     Logger.log("Đã gửi thông báo Telegram");
 *   } catch (error) {
 *     Logger.log("Lỗi khi gửi thông báo Telegram: " + error);
 *   }
 * }
 *
 * 5. Thay thế YOUR_BOT_TOKEN bằng token bot Telegram của bạn
 * 6. Thay thế YOUR_CHAT_ID bằng chat ID của bạn hoặc nhóm
 * 7. Lưu script
 * 8. Nhấp vào "Deploy" > "New deployment"
 * 9. Chọn loại "Web app"
 * 10. Đặt:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 11. Nhấp "Deploy"
 * 12. Sao chép URL Web App và dán vào biến `scriptURL` ở dưới
 * 13. MỖI KHI CẬP NHẬT SCRIPT, bạn phải tạo NEW deployment để có URL mới
 * 
 * HƯỚNG DẪN CÀI ĐẶT THÔNG BÁO TELEGRAM:
 * 1. Tạo bot Telegram:
 *    - Mở Telegram và tìm kiếm "@BotFather"
 *    - Gửi lệnh "/newbot" và làm theo hướng dẫn
 *    - Lưu lại token API được cung cấp
 * 
 * 2. Lấy Chat ID:
 *    - Tìm bot "@userinfobot" trên Telegram
 *    - Gửi một tin nhắn bất kỳ
 *    - Bot sẽ trả về ID của bạn
 * 
 * 3. Kích hoạt bot:
 *    - Tìm bot bạn vừa tạo trên Telegram
 *    - Nhấn Start để kích hoạt bot
 */
