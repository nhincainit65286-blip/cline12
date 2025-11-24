# 🤝 Hướng dẫn Đóng góp - Extension Cline

Cảm ơn bạn quan tâm đến việc đóng góp cho dự án việt hóa Extension Cline! 🎉

## 📋 Mục lục
1. [Cách đóng góp](#cách-đóng-góp)
2. [Quy trình Translation](#quy-trình-translation)
3. [Coding Standards](#coding-standards)
4. [Testing](#testing)
5. [Pull Request Process](#pull-request-process)

---

## 🚀 Cách đóng góp

### Các cách bạn có thể đóng góp:

1. **Translation (Dịch thuật)**
   - Cải thiện bản dịch hiện tại
   - Thêm translations mới
   - Fix lỗi dịch

2. **Bug Reports (Báo lỗi)**
   - Báo cáo lỗi về translations
   - Báo cáo text overflow
   - Báo cáo context issues

3. **Feature Requests (Đề xuất tính năng)**
   - Đề xuất cải tiến i18n system
   - Đề xuất thêm ngôn ngữ mới

4. **Documentation (Tài liệu)**
   - Cải thiện documentation
   - Thêm examples
   - Viết tutorials

5. **Code Review**
   - Review pull requests
   - Suggest improvements

---

## 🌐 Quy trình Translation

### 1. Setup Development Environment

```bash
# Fork repository
git clone https://github.com/YOUR_USERNAME/cline.git
cd cline

# Install dependencies
npm install

# Create branch
git checkout -b feature/improve-vietnamese-translation
```

### 2. Thêm/Sửa Translations

#### Webview Translations (React)

**File:** `webview-ui/src/i18n/locales/vi.json`

```json
{
  "category": {
    "key": "Bản dịch tiếng Việt"
  }
}
```

**Usage trong component:**
```typescript
import { useTranslation } from "react-i18next"

function MyComponent() {
  const { t } = useTranslation()
  return <div>{t("category.key")}</div>
}
```

#### Backend Translations

**File:** `src/shared/i18n/messages.vi.ts`

```typescript
export const messages_vi = {
  category: {
    key: "Bản dịch tiếng Việt",
    keyWithParam: "Bản dịch với {{param}}",
  },
}
```

**Usage trong code:**
```typescript
import { t } from "@/shared/i18n"

const message = t("category.key")
const messageWithParam = t("category.keyWithParam", { param: "value" })
```

### 3. Translation Guidelines

#### ✅ DO (Nên làm)

1. **Giữ nguyên technical terms:**
   ```typescript
   // ✅ Good
   "API Key", "Token", "Git", "Commit", "MCP Server"
   
   // ❌ Bad
   "Khóa API", "Mã thông báo", "Cam kết"
   ```

2. **Dịch UI elements:**
   ```typescript
   // ✅ Good
   "Settings" → "Cài đặt"
   "History" → "Lịch sử"
   "Account" → "Tài khoản"
   ```

3. **Nhất quán terminology:**
   ```typescript
   // ✅ Good - Consistent
   "Task" → "Nhiệm vụ" (everywhere)
   
   // ❌ Bad - Inconsistent
   "Task" → "Nhiệm vụ", "Công việc", "Tác vụ"
   ```

4. **Sử dụng parameter substitution:**
   ```typescript
   // ✅ Good
   t("error.message", { error: errorMessage })
   
   // ❌ Bad
   `Lỗi: ${errorMessage}` // Hardcoded
   ```

5. **Test context:**
   ```typescript
   // ✅ Good - Clear context
   "Delete task" → "Xóa nhiệm vụ"
   
   // ❌ Bad - Ambiguous
   "Delete" → "Xóa" (Delete what?)
   ```

#### ❌ DON'T (Không nên)

1. **Không dịch quá literal:**
   ```typescript
   // ❌ Bad
   "Quick wins" → "Chiến thắng nhanh"
   
   // ✅ Good
   "Quick wins" → "Tác vụ nhanh"
   ```

2. **Không dùng formal quá mức:**
   ```typescript
   // ❌ Bad
   "Click here" → "Xin vui lòng nhấp chuột vào đây"
   
   // ✅ Good
   "Click here" → "Nhấp vào đây"
   ```

3. **Không bỏ qua context:**
   ```typescript
   // ❌ Bad - Lost context
   "Save" → "Lưu" (Save what? Settings? File?)
   
   // ✅ Good - Clear context
   "Save settings" → "Lưu cài đặt"
   ```

### 4. Testing Translations

```bash
# Build webview
npm run build:webview

# Run extension
Press F5 in VSCode

# Test your changes
1. Switch to Vietnamese
2. Navigate to changed components
3. Verify translations
4. Check for text overflow
5. Test parameter substitution
```

### 5. Glossary (Thuật ngữ chuẩn)

| English | Tiếng Việt | Notes |
|---------|------------|-------|
| Extension | Extension | Giữ nguyên |
| Task | Nhiệm vụ | |
| Chat | Chat | Giữ nguyên |
| Prompt | Prompt | Giữ nguyên |
| Model | Mô hình AI | |
| API Key | API Key | Giữ nguyên |
| Settings | Cài đặt | |
| History | Lịch sử | |
| Workspace | Không gian làm việc | |
| Terminal | Terminal | Giữ nguyên |
| Browser | Trình duyệt | |
| File | Tệp | |
| Folder | Thư mục | |
| Command | Lệnh | |
| Token | Token | Giữ nguyên |
| Checkpoint | Điểm lưu | |
| Commit | Commit | Giữ nguyên |
| MCP Server | MCP Server | Giữ nguyên |

---

## 💻 Coding Standards

### TypeScript/React

```typescript
// ✅ Good - Type-safe
import { t } from "@/shared/i18n"

const message: string = t("category.key")

// ❌ Bad - Not type-safe
const message = "Hardcoded string"
```

### File Organization

```
src/shared/i18n/
├── index.ts          # Main i18n system
├── messages.en.ts    # English messages
├── messages.vi.ts    # Vietnamese messages
└── types.ts          # Type definitions

webview-ui/src/i18n/
├── locales/
│   ├── en.json      # English translations
│   └── vi.json      # Vietnamese translations
└── README.md        # i18n guide
```

### Naming Conventions

```typescript
// ✅ Good - Clear, hierarchical
messages_vi = {
  auth: {
    loginSuccess: "...",
    loginFailed: "...",
    logoutSuccess: "...",
  }
}

// ❌ Bad - Flat, unclear
messages_vi = {
  authLoginSuccess: "...",
  authLoginFailed: "...",
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Build successful
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Translations display correctly
- [ ] No text overflow
- [ ] Parameter substitution works
- [ ] Language switching works
- [ ] Preference persists

### Automated Testing

```bash
# Run tests
npm test

# Run specific test
npm test -- --grep "i18n"
```

---

## 📝 Pull Request Process

### 1. Prepare Your PR

```bash
# Update from main
git fetch upstream
git rebase upstream/main

# Run tests
npm test

# Build
npm run build:webview

# Commit
git add .
git commit -m "feat(i18n): improve Vietnamese translations for Settings"
```

### 2. Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(i18n): add Vietnamese translations for MCP server management

- Add 9 new translation keys
- Update messages.vi.ts
- Test server connection messages

Closes #123
```

### 3. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Translation improvement
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation

## Testing
- [ ] Tested manually
- [ ] Added/updated tests
- [ ] No console errors
- [ ] No text overflow

## Screenshots
[If applicable]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### 4. Review Process

1. **Automated checks** run first
2. **Maintainer review** (1-2 days)
3. **Address feedback** if needed
4. **Merge** when approved

---

## 🎯 Priority Areas

### High Priority
1. Error messages
2. Settings UI
3. Authentication flows
4. Common actions

### Medium Priority
1. Advanced features
2. Debug tools
3. Developer tools

### Low Priority
1. Internal logs
2. Debug messages
3. Developer comments

---

## 📞 Getting Help

### Resources
- **Documentation:** [VIET_HOA_COMPLETE.md](./VIET_HOA_COMPLETE.md)
- **Quick Start:** [QUICK_START_VI.md](./QUICK_START_VI.md)
- **Testing Guide:** [TESTING_GUIDE_VI.md](./TESTING_GUIDE_VI.md)

### Community
- **GitHub Issues:** https://github.com/cline/cline/issues
- **Discord:** https://discord.gg/cline
- **Discussions:** https://github.com/cline/cline/discussions

### Questions?
- Open a GitHub Discussion
- Ask in Discord #i18n channel
- Tag maintainers in issues

---

## 🙏 Thank You!

Cảm ơn bạn đã đóng góp cho dự án! Mỗi contribution, dù lớn hay nhỏ, đều giúp Extension Cline tốt hơn cho cộng đồng người dùng Việt Nam. 🇻🇳

---

**Version:** 1.0  
**Last Updated:** 22/11/2025
