# Tính năng Tiết kiệm Token (Token Saving)

## Tổng quan

Tính năng **Tiết kiệm Token** giúp tối ưu hóa việc sử dụng API để giảm tiêu thụ token và chi phí. Tính năng này tự động nén ngữ cảnh, loại bỏ thông tin dư thừa và sử dụng các chiến lược prompting hiệu quả.

## Lợi ích

- 💰 **Tiết kiệm chi phí**: Giảm 30-50% token usage, tiết kiệm đáng kể chi phí API
- ⚡ **Tăng tốc độ**: Ít token hơn = phản hồi nhanh hơn
- 🎯 **Tối ưu context**: Loại bỏ thông tin không cần thiết, giữ lại phần quan trọng
- 🔄 **Tự động hóa**: Không cần can thiệp thủ công, hoạt động tự động

## Cách sử dụng

### 1. Bật tính năng

1. Mở **Settings** (⚙️)
2. Chọn tab **Features**
3. Tìm phần **Token Saving**
4. Bật checkbox **"Bật Tiết kiệm Token"**

### 2. Chọn mức độ nén

Sau khi bật, bạn có thể chọn mức độ nén phù hợp:

#### **None (Không)**
- Không áp dụng nén
- Giữ nguyên toàn bộ context
- Phù hợp khi cần độ chính xác tuyệt đối

#### **Low (Thấp)**
- Chỉ loại bỏ khoảng trắng thừa
- Tiết kiệm ~10-15% tokens
- An toàn nhất, ít ảnh hưởng đến chất lượng

#### **Medium (Trung bình)** ⭐ Khuyến nghị
- Cắt giảm thông minh với AST parsing
- Loại bỏ comments, whitespace, code trùng lặp
- Tiết kiệm ~30-40% tokens
- Cân bằng tốt giữa tiết kiệm và chất lượng

#### **Aggressive (Mạnh)**
- Nén tối đa với summarization
- Chỉ giữ lại thông tin cốt lõi
- Tiết kiệm ~50-60% tokens
- Có thể giảm một chút chất lượng context

## Cách hoạt động

### 1. Context Compression (Nén ngữ cảnh)

Tính năng sử dụng `ContextCompressor` để:

- **Loại bỏ comments**: Xóa các comment không cần thiết
- **Minify code**: Giảm khoảng trắng, xuống dòng thừa
- **Deduplicate**: Phát hiện và loại bỏ nội dung trùng lặp
- **Smart truncation**: Cắt bớt phần ít quan trọng

### 2. Token Counting (Đếm token)

Sử dụng `TokenCounter` để:

- Đếm chính xác số token cho từng model
- Theo dõi token usage trước và sau nén
- Tính toán tỷ lệ tiết kiệm

### 3. Context Selection (Chọn lọc ngữ cảnh)

`ContextSelector` giúp:

- Chọn các phần code quan trọng nhất
- Ưu tiên imports, exports, function signatures
- Loại bỏ implementation details khi không cần

## Ví dụ

### Trước khi nén (Original)

```typescript
/**
 * This is a user authentication service
 * It handles login, logout, and session management
 */
export class AuthService {
    // Private property to store user data
    private currentUser: User | null = null;
    
    /**
     * Login method
     * @param email - User email
     * @param password - User password
     * @returns Promise with user data
     */
    async login(email: string, password: string): Promise<User> {
        // Validate email format
        if (!this.isValidEmail(email)) {
            throw new Error("Invalid email format");
        }
        
        // Call API to authenticate
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Parse response
        const data = await response.json();
        
        // Store user data
        this.currentUser = data.user;
        
        return this.currentUser;
    }
}
```

**Token count**: ~250 tokens

### Sau khi nén (Compressed - Medium level)

```typescript
export class AuthService {
    private currentUser: User | null = null;
    
    async login(email: string, password: string): Promise<User> {
        if (!this.isValidEmail(email)) throw new Error("Invalid email format");
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        this.currentUser = data.user;
        return this.currentUser;
    }
}
```

**Token count**: ~120 tokens  
**Tiết kiệm**: 52% (130 tokens)

## Thống kê & Giám sát

Tính năng cung cấp thống kê chi tiết:

- **Tokens Saved**: Tổng số token đã tiết kiệm
- **Savings Percentage**: Tỷ lệ phần trăm tiết kiệm
- **Cost Savings**: Ước tính tiền tiết kiệm được
- **Compression Time**: Thời gian xử lý nén

Xem thống kê trong task details hoặc history.

## Best Practices (Thực hành tốt nhất)

### ✅ Nên

- Sử dụng mức **Medium** cho hầu hết các trường hợp
- Bật Token Saving cho các task lớn, phức tạp
- Kiểm tra kết quả sau khi bật để đảm bảo chất lượng
- Sử dụng mức **Aggressive** cho exploration tasks

### ❌ Không nên

- Dùng mức **Aggressive** cho code generation quan trọng
- Bật cho các task cần độ chính xác tuyệt đối
- Quên kiểm tra output quality sau khi bật

## Tích hợp với các tính năng khác

Token Saving hoạt động tốt với:

- **Task Documentation**: Nén task history để tiết kiệm storage
- **Smart File Reading**: Chỉ đọc phần cần thiết của file
- **Auto Compact**: Kết hợp để tối ưu context management

## Troubleshooting (Xử lý sự cố)

### Vấn đề: Output quality giảm

**Giải pháp**: 
- Giảm mức độ nén xuống **Low** hoặc **Medium**
- Tắt Token Saving cho task cụ thể đó
- Kiểm tra xem có phần code quan trọng bị loại bỏ không

### Vấn đề: Không thấy tiết kiệm đáng kể

**Giải pháp**:
- Tăng mức độ nén lên **Medium** hoặc **Aggressive**
- Đảm bảo code có nhiều comments và whitespace
- Kiểm tra xem tính năng đã được bật chưa

### Vấn đề: Lỗi khi compile code đã nén

**Giải pháp**:
- Báo cáo bug với ví dụ cụ thể
- Tạm thời tắt Token Saving
- Sử dụng mức **Low** để an toàn hơn

## API Reference

### TokenSavingMiddleware

```typescript
import { tokenSavingMiddleware } from '@/core/api/TokenSavingMiddleware'

// Enable token saving
tokenSavingMiddleware.enable({
    compressionLevel: 'medium',
    maxContextTokens: 100000,
    preserveCodeStructure: true
})

// Process messages
const result = await tokenSavingMiddleware.processMessages(messages, model)

// Get statistics
const stats = tokenSavingMiddleware.getStats()
```

### ContextCompressor

```typescript
import { ContextCompressor } from '@/core/prompts/ContextCompressor'

const compressor = new ContextCompressor()

// Compress code
const compressed = compressor.compressCode(code, 'typescript')

// Smart truncate
const truncated = compressor.smartTruncate(text, maxTokens)

// Summarize file
const summary = compressor.summarizeFile(content, maxTokens)
```

## Roadmap

Các cải tiến trong tương lai:

- [ ] ML-based compression với model nhỏ
- [ ] Per-file compression settings
- [ ] Compression preview trước khi apply
- [ ] Custom compression rules
- [ ] Integration với prompt caching
- [ ] Real-time compression metrics trong UI

## Đóng góp

Nếu bạn có ý tưởng cải thiện Token Saving:

1. Mở issue trên GitHub
2. Mô tả use case cụ thể
3. Đề xuất giải pháp
4. Submit PR nếu có thể

## Tài liệu liên quan

- [Task Documentation](./task-documentation.md)
- [Smart File Reading](./smart-file-reading.md)
- [Context Management](./context-management.md)

---

**Lưu ý**: Token Saving là tính năng thử nghiệm. Luôn kiểm tra output quality sau khi bật.
