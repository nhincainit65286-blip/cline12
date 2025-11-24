# Hướng dẫn Test Tính năng Token Saving

## ✅ Build hoàn tất

Extension đã được build thành công với tính năng Token Saving.

## 🧪 Cách test

### 1. Reload Extension

1. Nhấn `F5` hoặc `Ctrl+Shift+F5` để reload extension
2. Hoặc trong VS Code: `Developer: Reload Window`

### 2. Mở Settings

1. Click vào icon ⚙️ Settings trong Cline sidebar
2. Chọn tab **Features**
3. Scroll xuống tìm phần **Token Saving**

### 3. Kiểm tra UI

Bạn sẽ thấy:

```
┌─────────────────────────────────────────────────────┐
│ ☐ Bật Tiết kiệm Token              [SAVE $$]        │
│                                                      │
│ Tối ưu hóa việc sử dụng API để giảm tiêu thụ       │
│ token và chi phí...                                 │
└─────────────────────────────────────────────────────┘
```

### 4. Bật tính năng

1. ✅ Check vào checkbox "Bật Tiết kiệm Token"
2. Dropdown sẽ xuất hiện với 4 options:
   - None (Không)
   - Low (Thấp)  
   - Medium (Trung bình) - Mặc định
   - Aggressive (Tích cực)

### 5. Kiểm tra Console

Mở Developer Tools (`Help` → `Toggle Developer Tools`) và xem console:

```
=== TOKEN SAVING STATE ===
tokenSavingEnabled: true
compressionLevel: medium
```

### 6. Test chức năng

1. Tạo một task mới
2. Gửi message với code dài
3. Kiểm tra xem token có được tiết kiệm không

## 🔍 Debug

Nếu không thấy tính năng:

### Check 1: State được load chưa?

Mở console và xem log:
```
=== TOKEN SAVING STATE ===
tokenSavingEnabled: undefined  ← Vấn đề!
compressionLevel: undefined    ← Vấn đề!
```

**Giải pháp**: State chưa được load từ backend

### Check 2: Proto có đúng không?

```bash
npm run protos
```

Kiểm tra file `webview-ui/src/services/grpc-client.ts` có chứa:
- `tokenSavingEnabled`
- `compressionLevel`

### Check 3: Backend có trả về state không?

Thêm log trong `src/core/controller/index.ts`:

```typescript
console.log("=== RETURNING STATE ===")
console.log("tokenSavingEnabled:", tokenSavingEnabled)
console.log("compressionLevel:", compressionLevel)
```

### Check 4: UpdateSettings có hoạt động không?

Thêm log trong `src/core/controller/state/updateSettings.ts`:

```typescript
console.log("=== UPDATE SETTINGS ===")
console.log("tokenSavingEnabled:", request.tokenSavingEnabled)
console.log("compressionLevel:", request.compressionLevel)
```

## 📋 Checklist Test

- [ ] UI hiển thị đúng trong Settings
- [ ] Checkbox bật/tắt hoạt động
- [ ] Dropdown hiển thị 4 options
- [ ] Chọn option khác nhau hoạt động
- [ ] State được lưu sau khi reload
- [ ] Console log ra state đúng
- [ ] Translations tiếng Việt hiển thị đúng
- [ ] Translations tiếng Anh hiển thị đúng

## 🎯 Expected Behavior

### Khi bật Token Saving

1. Checkbox được check ✅
2. Dropdown xuất hiện
3. Console log: `tokenSavingEnabled: true`
4. State được lưu vào globalState

### Khi chọn compression level

1. Dropdown value thay đổi
2. Console log: `compressionLevel: <selected-value>`
3. State được update

### Khi tắt Token Saving

1. Checkbox bỏ check ☐
2. Dropdown ẩn đi
3. Console log: `tokenSavingEnabled: false`

## 🐛 Common Issues

### Issue 1: Không thấy section Token Saving

**Nguyên nhân**: Webview chưa được rebuild

**Giải pháp**:
```bash
npm run build:webview
```

### Issue 2: Checkbox không hoạt động

**Nguyên nhân**: updateSetting không được gọi

**Giải pháp**: Kiểm tra console có error không

### Issue 3: State không được lưu

**Nguyên nhân**: Proto chưa được build

**Giải pháp**:
```bash
npm run protos
npm run build:webview
```

### Issue 4: Dropdown không xuất hiện

**Nguyên nhân**: Conditional rendering không hoạt động

**Giải pháp**: Kiểm tra `tokenSavingEnabled` có giá trị đúng không

## 📸 Screenshots

### Before enabling
```
☐ Bật Tiết kiệm Token [SAVE $$]
Tối ưu hóa việc sử dụng API...
```

### After enabling
```
☑ Bật Tiết kiệm Token [SAVE $$]
Tối ưu hóa việc sử dụng API...

  Mức độ Tiết kiệm Token
  ┌─────────────────────────┐
  │ Trung bình          ▼   │
  └─────────────────────────┘
  
  Kiểm soát mức độ tích cực...
```

## ✅ Success Criteria

Tính năng hoạt động đúng khi:

1. ✅ UI hiển thị đầy đủ
2. ✅ Bật/tắt hoạt động
3. ✅ Dropdown hoạt động
4. ✅ State được lưu
5. ✅ Console log đúng
6. ✅ Translations đúng
7. ✅ Không có errors trong console

## 🚀 Next Steps

Sau khi test thành công:

1. Test với real API calls
2. Verify token savings
3. Check compression quality
4. Monitor performance
5. Gather user feedback

---

**Lưu ý**: Nếu gặp vấn đề, check console logs và file `TOKEN_SAVING_FEATURE_COMPLETE.md` để biết thêm chi tiết.
