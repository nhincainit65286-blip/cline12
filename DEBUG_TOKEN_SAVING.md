# Debug Token Saving - Không bật được

## 🔍 Các bước debug

### Bước 1: Reload Extension
1. Nhấn `Ctrl+Shift+F5` để reload extension
2. Hoặc `Developer: Reload Window`

### Bước 2: Mở Developer Tools
1. `Help` → `Toggle Developer Tools`
2. Chọn tab `Console`
3. Clear console (icon 🚫)

### Bước 3: Mở Settings
1. Click vào Cline icon trong sidebar
2. Click vào ⚙️ Settings
3. Chọn tab **Features**

### Bước 4: Kiểm tra Console Logs

Bạn sẽ thấy các logs sau:

#### Log 1: Controller Get State
```
=== CONTROLLER GET STATE ===
tokenSavingEnabled: false (hoặc undefined)
compressionLevel: medium (hoặc undefined)
```

**Ý nghĩa**: 
- `false` = State đã được load, mặc định là tắt ✅
- `undefined` = State chưa được load ❌

#### Log 2: Token Saving State (từ UI)
```
=== TOKEN SAVING STATE ===
tokenSavingEnabled: false
compressionLevel: medium
```

**Ý nghĩa**: UI đã nhận được state từ backend ✅

### Bước 5: Thử bật Token Saving

1. Click vào checkbox "Bật Tiết kiệm Token"
2. Xem console có log gì

#### Expected Logs:
```
=== UPDATE TOKEN SAVING ===
tokenSavingEnabled: true

=== CONTROLLER GET STATE ===
tokenSavingEnabled: true
compressionLevel: medium

=== TOKEN SAVING STATE ===
tokenSavingEnabled: true
compressionLevel: medium
```

### Bước 6: Thử đổi Compression Level

1. Chọn một option khác trong dropdown (ví dụ: "Tích cực")
2. Xem console

#### Expected Logs:
```
=== UPDATE COMPRESSION LEVEL ===
compressionLevel: aggressive

=== CONTROLLER GET STATE ===
tokenSavingEnabled: true
compressionLevel: aggressive

=== TOKEN SAVING STATE ===
tokenSavingEnabled: true
compressionLevel: aggressive
```

## 🐛 Các vấn đề có thể gặp

### Vấn đề 1: Không thấy log "UPDATE TOKEN SAVING"

**Nguyên nhân**: `updateSetting` không được gọi hoặc request không đến backend

**Debug**:
1. Thêm log trong `updateSetting` function:
```typescript
export const updateSetting = (field: keyof UpdateSettingsRequest, value: any) => {
    console.log("=== UPDATE SETTING CALLED ===")
    console.log("field:", field)
    console.log("value:", value)
    // ...
}
```

2. Kiểm tra Network tab xem có request gRPC không

### Vấn đề 2: Log "UPDATE TOKEN SAVING" có nhưng state không đổi

**Nguyên nhân**: `setGlobalState` không hoạt động hoặc `postStateToWebview` không được gọi

**Debug**:
1. Kiểm tra `postStateToWebview` có được gọi sau `setGlobalState` không
2. Thêm log trong `postStateToWebview`

### Vấn đề 3: State đổi ở backend nhưng UI không update

**Nguyên nhân**: Webview không subscribe đúng hoặc state không được parse

**Debug**:
1. Kiểm tra `ExtensionStateContext` có subscribe `tokenSavingEnabled` không
2. Xem log `=== TOKEN SAVING STATE ===` có update không

### Vấn đề 4: Checkbox bị disabled

**Nguyên nhân**: Có condition nào đó disable checkbox

**Debug**:
1. Inspect checkbox element
2. Xem có attribute `disabled` không
3. Check code có condition `disabled={...}` không

### Vấn đề 5: Không thấy section Token Saving

**Nguyên nhân**: Code bị comment hoặc condition render sai

**Debug**:
1. Search trong `FeatureSettingsSection.tsx` tìm "Token Saving"
2. Kiểm tra có bị comment không
3. Kiểm tra có condition render không

## 📋 Checklist Debug

Đi qua từng bước và check:

- [ ] Extension đã reload
- [ ] Developer Tools đã mở
- [ ] Console đã clear
- [ ] Settings đã mở
- [ ] Tab Features đã chọn
- [ ] Thấy section Token Saving
- [ ] Thấy log "CONTROLLER GET STATE"
- [ ] Thấy log "TOKEN SAVING STATE"
- [ ] Click checkbox
- [ ] Thấy log "UPDATE TOKEN SAVING"
- [ ] State trong log đã đổi thành `true`
- [ ] UI checkbox đã checked
- [ ] Dropdown đã xuất hiện

## 🔧 Quick Fixes

### Fix 1: Force rebuild everything
```bash
npm run protos
npm run build:webview
node esbuild.mjs
```

### Fix 2: Clear VS Code cache
1. Close VS Code
2. Delete `.vscode-test` folder
3. Delete `dist` folder
4. Rebuild:
```bash
npm run compile
```

### Fix 3: Check proto generated files
```bash
# Kiểm tra file này có tokenSavingEnabled không
cat webview-ui/src/services/grpc-client.ts | grep tokenSaving
```

### Fix 4: Verify state-keys.ts
```typescript
// File: src/shared/storage/state-keys.ts
// Phải có:
tokenSavingEnabled: boolean
compressionLevel: "none" | "light" | "medium" | "aggressive"
```

## 📸 Screenshot của Console

Khi hoạt động đúng, console sẽ như này:

```
=== CONTROLLER GET STATE ===
tokenSavingEnabled: false
compressionLevel: medium

=== TOKEN SAVING STATE ===
tokenSavingEnabled: false
compressionLevel: medium

[User clicks checkbox]

=== UPDATE TOKEN SAVING ===
tokenSavingEnabled: true

=== CONTROLLER GET STATE ===
tokenSavingEnabled: true
compressionLevel: medium

=== TOKEN SAVING STATE ===
tokenSavingEnabled: true
compressionLevel: medium
```

## 🆘 Nếu vẫn không được

Hãy gửi cho tôi:

1. **Console logs** - Copy toàn bộ logs
2. **Screenshot** - Settings UI
3. **Network tab** - Có request gRPC nào không
4. **Errors** - Có error nào trong console không

Hoặc thử:

1. Tạo task mới và test lại
2. Restart VS Code hoàn toàn
3. Kiểm tra extension có active không: `Developer: Show Running Extensions`

---

**Tip**: Nếu thấy log "CONTROLLER GET STATE" nhưng không thấy "TOKEN SAVING STATE", có nghĩa là UI component chưa mount hoặc useEffect chưa chạy.
