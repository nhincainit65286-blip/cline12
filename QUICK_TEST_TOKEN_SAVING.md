# ⚡ Quick Test - Token Saving

## 🚀 Làm ngay bây giờ

### 1. Reload Extension (5 giây)
```
Nhấn: Ctrl + Shift + F5
```

### 2. Mở Console (5 giây)
```
Help → Toggle Developer Tools → Tab Console
```

### 3. Mở Settings (5 giây)
```
Click Cline icon → Click ⚙️ → Tab Features
```

### 4. Scroll xuống tìm "Token Saving" (5 giây)

Bạn sẽ thấy:
```
☐ Bật Tiết kiệm Token [SAVE $$]
```

### 5. Click vào checkbox (1 giây)

### 6. Xem Console (5 giây)

## ✅ Nếu hoạt động, bạn sẽ thấy:

```javascript
=== UPDATE SETTING CALLED ===
field: tokenSavingEnabled
value: true
updateRequest: { tokenSavingEnabled: true }

=== UPDATE TOKEN SAVING ===
tokenSavingEnabled: true

=== CONTROLLER GET STATE ===
tokenSavingEnabled: true
compressionLevel: medium

=== TOKEN SAVING STATE ===
tokenSavingEnabled: true
compressionLevel: medium
```

**VÀ** dropdown sẽ xuất hiện:
```
☑ Bật Tiết kiệm Token [SAVE $$]

  Mức độ Tiết kiệm Token
  ┌─────────────────────────┐
  │ Trung bình          ▼   │
  └─────────────────────────┘
```

## ❌ Nếu KHÔNG hoạt động:

### Trường hợp 1: Không thấy log "UPDATE SETTING CALLED"

**Vấn đề**: Checkbox không trigger onChange

**Giải pháp**:
1. Inspect checkbox element (Right click → Inspect)
2. Xem có attribute `disabled` không
3. Nếu có, tìm nguyên nhân trong code

### Trường hợp 2: Thấy log nhưng không có "UPDATE TOKEN SAVING"

**Vấn đề**: Request không đến backend

**Giải pháp**:
1. Check Network tab
2. Xem có error trong console không
3. Kiểm tra gRPC connection

### Trường hợp 3: Thấy "UPDATE TOKEN SAVING" nhưng UI không đổi

**Vấn đề**: State không sync với UI

**Giải pháp**:
1. Reload window một lần nữa
2. Check log "TOKEN SAVING STATE" có update không

### Trường hợp 4: Không thấy section Token Saving

**Vấn đề**: Webview chưa rebuild

**Giải pháp**:
```bash
# Chờ build hiện tại xong (nếu đang chạy)
# Hoặc kill process và chạy lại:
npm run build:webview
```

## 🔍 Debug nhanh

Copy đoạn này vào console và chạy:

```javascript
// Check state hiện tại
console.log("Current state check:")
console.log("- Check if Token Saving section exists:", 
    document.querySelector('[style*="border: 1px solid var(--vscode-charts-green)"]') ? "✅ YES" : "❌ NO")
```

## 📞 Báo lỗi

Nếu vẫn không được, gửi cho tôi:

1. **Console logs** (copy tất cả)
2. **Screenshot** của Settings UI
3. **Có thấy section Token Saving không?** (Yes/No)
4. **Có thấy log "UPDATE SETTING CALLED" không?** (Yes/No)

## 💡 Tips

- **Tip 1**: Nếu build đang chạy, đợi nó xong rồi reload extension
- **Tip 2**: Clear console trước khi test để dễ đọc logs
- **Tip 3**: Nếu không chắc, restart VS Code hoàn toàn

---

**Thời gian test**: ~30 giây  
**Độ khó**: ⭐ (Rất dễ)
