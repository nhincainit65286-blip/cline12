# 🧪 Hướng dẫn Testing - Extension Cline Tiếng Việt

## 📋 Mục lục
1. [Chuẩn bị](#chuẩn-bị)
2. [Testing Checklist](#testing-checklist)
3. [Test Cases Chi tiết](#test-cases-chi-tiết)
4. [Known Issues](#known-issues)
5. [Reporting Bugs](#reporting-bugs)

---

## 🔧 Chuẩn bị

### Yêu cầu
- VSCode phiên bản mới nhất
- Node.js v18+
- Extension Cline đã build

### Setup
```bash
# Clone repository
git clone https://github.com/cline/cline.git
cd cline

# Install dependencies
npm install

# Build webview
npm run build:webview

# Run extension
Press F5 trong VSCode
```

---

## ✅ Testing Checklist

### 1. Language Switching (Đổi ngôn ngữ)
- [ ] Extension tự động phát hiện ngôn ngữ hệ thống
- [ ] Có thể đổi ngôn ngữ trong Settings > General > Preferred Language
- [ ] Ngôn ngữ được lưu và persist sau khi reload
- [ ] UI cập nhật ngay lập tức khi đổi ngôn ngữ

### 2. UI Components (Giao diện)
- [ ] Navbar hiển thị đúng tiếng Việt
- [ ] Settings (7 sections) hiển thị đúng
- [ ] History view hiển thị đúng
- [ ] Account view hiển thị đúng
- [ ] Chat view placeholder đúng
- [ ] Không có text overflow
- [ ] Không có text truncation

### 3. Authentication (Xác thực)
- [ ] Login Cline hiển thị message tiếng Việt
- [ ] Logout Cline hiển thị message tiếng Việt
- [ ] OCA authentication messages đúng
- [ ] MCP authentication messages đúng
- [ ] Error messages hiển thị tiếng Việt

### 4. Commit Message Generation
- [ ] Repository selection dialog tiếng Việt
- [ ] Progress messages tiếng Việt
- [ ] Success messages tiếng Việt
- [ ] Error messages tiếng Việt
- [ ] Multi-repository support hoạt động

### 5. Terminal Operations
- [ ] Terminal error messages tiếng Việt
- [ ] Terminal content operations hoạt động

### 6. Checkpoint System
- [ ] Checkpoint initialization messages tiếng Việt
- [ ] Checkpoint timeout errors tiếng Việt
- [ ] Checkpoint operations hoạt động

### 7. Task History
- [ ] Reconstruction confirmation dialog tiếng Việt
- [ ] Progress messages tiếng Việt
- [ ] Success/warning messages tiếng Việt
- [ ] Error messages tiếng Việt

### 8. MCP Server Management
- [ ] Server connection messages tiếng Việt
- [ ] Server restart messages tiếng Việt
- [ ] Settings validation errors tiếng Việt
- [ ] State update messages tiếng Việt

### 9. Settings
- [ ] API Configuration section
- [ ] General Settings section
- [ ] Features section
- [ ] Browser Settings section
- [ ] Terminal Settings section
- [ ] About section
- [ ] Debug section

### 10. Error Handling
- [ ] Git errors hiển thị tiếng Việt
- [ ] Network errors hiển thị tiếng Việt
- [ ] File system errors hiển thị tiếng Việt
- [ ] Validation errors hiển thị tiếng Việt

---

## 🧪 Test Cases Chi tiết

### Test Case 1: Language Auto-detection

**Mục đích:** Verify extension tự động phát hiện ngôn ngữ hệ thống

**Steps:**
1. Set VSCode language to Vietnamese (vi-VN)
2. Reload extension
3. Verify UI hiển thị tiếng Việt

**Expected Result:**
- Extension tự động hiển thị tiếng Việt
- Tất cả UI elements đều tiếng Việt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 2: Manual Language Switching

**Mục đích:** Verify có thể đổi ngôn ngữ thủ công

**Steps:**
1. Mở Settings (⚙️)
2. Chọn tab "General"
3. Tìm "Preferred Language"
4. Đổi từ "Tiếng Việt" sang "English"
5. Verify UI cập nhật

**Expected Result:**
- UI cập nhật ngay lập tức
- Preference được lưu
- Sau reload vẫn giữ nguyên preference

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 3: Commit Message Generation

**Mục đích:** Verify commit message generation hoạt động với tiếng Việt

**Steps:**
1. Make changes trong git repository
2. Click "Generate Commit Message" button
3. Verify messages hiển thị tiếng Việt

**Expected Result:**
- Repository selection dialog tiếng Việt
- Progress message: "Đang tạo commit message cho..."
- Success message: "Đã tạo commit message thành công"
- Error messages (nếu có) tiếng Việt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 4: Authentication Flow

**Mục đích:** Verify authentication messages tiếng Việt

**Steps:**
1. Logout khỏi Cline
2. Verify logout message
3. Login lại
4. Verify login messages

**Expected Result:**
- Logout success: "Đã đăng xuất khỏi Cline thành công"
- Login success: Messages tiếng Việt
- Error messages (nếu có) tiếng Việt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 5: Task History Reconstruction

**Mục đích:** Verify task history reconstruction với tiếng Việt

**Steps:**
1. Run command "Reconstruct Task History"
2. Verify confirmation dialog
3. Confirm và verify progress
4. Verify result messages

**Expected Result:**
- Confirmation: "Thao tác này sẽ xây dựng lại lịch sử task..."
- Progress: "Đang xây dựng lại lịch sử task..."
- Success: "Đã xây dựng lại lịch sử task thành công!"
- Warnings/errors tiếng Việt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 6: MCP Server Management

**Mục đích:** Verify MCP server messages tiếng Việt

**Steps:**
1. Connect to MCP server
2. Verify connection message
3. Restart server
4. Verify restart message
5. Test invalid settings
6. Verify error messages

**Expected Result:**
- Connection: "{server} MCP server đã kết nối"
- Restart: "Đang khởi động lại {server} MCP server..."
- Errors: Messages tiếng Việt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 7: Settings Sections

**Mục đích:** Verify tất cả Settings sections hiển thị tiếng Việt

**Steps:**
1. Mở Settings
2. Test từng tab:
   - API Configuration
   - General
   - Features
   - Browser
   - Terminal
   - About
   - Debug

**Expected Result:**
- Tất cả labels tiếng Việt
- Tất cả descriptions tiếng Việt
- Tất cả tooltips tiếng Việt
- Không có text overflow

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 8: Error Messages

**Mục đích:** Verify error messages hiển thị tiếng Việt

**Steps:**
1. Trigger các errors:
   - Git not installed
   - Network error
   - File not found
   - Invalid settings
2. Verify error messages

**Expected Result:**
- Tất cả error messages tiếng Việt
- Error details có parameter substitution
- Consistent error format

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 9: Text Overflow

**Mục đích:** Verify không có text overflow với tiếng Việt

**Steps:**
1. Test tất cả UI components
2. Check buttons, labels, tooltips
3. Check long messages
4. Check dialogs

**Expected Result:**
- Không có text bị cắt
- Không có text overflow
- UI responsive tốt

**Status:** ✅ Pass / ❌ Fail

---

### Test Case 10: Performance

**Mục đích:** Verify performance không bị ảnh hưởng

**Steps:**
1. Measure load time
2. Measure language switch time
3. Measure translation lookup time

**Expected Result:**
- Load time < 2s
- Language switch < 500ms
- No performance degradation

**Status:** ✅ Pass / ❌ Fail

---

## 🐛 Known Issues

### Issue 1: [Nếu có]
**Description:** 
**Workaround:** 
**Status:** 

---

## 📝 Reporting Bugs

### Bug Report Template

```markdown
**Title:** [Brief description]

**Environment:**
- OS: [Windows/macOS/Linux]
- VSCode Version: [e.g., 1.85.0]
- Extension Version: [e.g., 3.38.1]
- Language: [Tiếng Việt/English]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Screenshots:**
[If applicable]

**Additional Context:**

```

### Nơi báo cáo
- GitHub Issues: https://github.com/cline/cline/issues
- Discord: https://discord.gg/cline

---

## ✅ Testing Completion

**Tester:** _______________  
**Date:** _______________  
**Overall Status:** ✅ Pass / ❌ Fail  

**Summary:**


**Recommendations:**


---

**Version:** 1.0  
**Last Updated:** 22/11/2025
