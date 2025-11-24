# 🔍 COMPLETE DEBUG GUIDE - Task Documentation Not Working

## ✅ Đã verify:

1. ✅ Proto file có fields (`task_documentation_enabled = 34`)
2. ✅ Proto TypeScript generated (`npm run protos` done)
3. ✅ `UpdateSettingsRequest` có field `taskDocumentationEnabled`
4. ✅ `ExtensionState` có field `taskDocumentationEnabled`
5. ✅ `state-helpers.ts` load từ globalState
6. ✅ Webview built (`npm run build:webview`)
7. ✅ Extension built (`node esbuild.mjs`)

## 🚨 Vấn đề có thể là:

### 1. Extension chưa được reload đúng cách

**Triệu chứng:** Checkbox không stay checked, quay về unchecked ngay lập tức

**Giải pháp:**
```
KHÔNG dùng F5 hoặc Ctrl+R!

Thay vào đó:
1. Close VS Code HOÀN TOÀN
2. Mở lại VS Code
3. Hoặc: Ctrl+Shift+P → "Developer: Reload Window"
```

### 2. Development mode cache issue

**Giải pháp:**
```bash
# Clear all builds and rebuild
rm -rf dist dist-standalone webview-ui/build

# Rebuild everything
npm run protos
npm run build:webview
node esbuild.mjs
```

### 3. Extension đang chạy production version

**Check:**
```
1. Trong VS Code, check Extensions panel
2. Nếu thấy "Cline" extension được install từ marketplace
3. Disable nó trước khi test development version
```

### 4. State không được sync

**Debug:**
```typescript
// Add to FeatureSettingsSection.tsx, before checkbox:
useEffect(() => {
    console.log("Task Documentation Enabled:", taskDocumentationEnabled)
}, [taskDocumentationEnabled])
```

## 🔧 Step-by-Step Debug:

### Step 1: Verify Proto Generated
```powershell
# Should show the field:
Get-Content "src/shared/proto/cline/state.ts" | Select-String -Pattern "taskDocumentationEnabled"
```

**Expected output:**
```
taskDocumentationEnabled?: boolean | undefined;
```

### Step 2: Verify Extension Built
```powershell
# Check if dist folder has recent files:
Get-ChildItem dist -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

### Step 3: Add Console Logging

**File: `webview-ui/src/components/settings/sections/FeatureSettingsSection.tsx`**

Add before checkbox:
```typescript
useEffect(() => {
    console.log("=== TASK DOCUMENTATION DEBUG ===")
    console.log("taskDocumentationEnabled:", taskDocumentationEnabled)
    console.log("taskProgressTrackingEnabled:", taskProgressTrackingEnabled)
}, [taskDocumentationEnabled, taskProgressTrackingEnabled])
```

Add in onChange:
```typescript
onChange={(e: any) => {
    const checked = e.target.checked === true
    console.log("=== CHECKBOX CLICKED ===")
    console.log("New value:", checked)
    console.log("Calling updateSetting...")
    updateSetting("taskDocumentationEnabled", checked)
    console.log("updateSetting called")
}}
```

### Step 4: Rebuild with Logging
```bash
npm run build:webview
node esbuild.mjs
```

### Step 5: Test with Console Open
```
1. Close VS Code completely
2. Open VS Code
3. Open Cline Settings
4. Press F12 (Developer Tools)
5. Click Console tab
6. Try to toggle checkbox
7. Watch console output
```

## 📋 Expected Console Output:

### When Settings Open:
```
=== TASK DOCUMENTATION DEBUG ===
taskDocumentationEnabled: false
taskProgressTrackingEnabled: true
```

### When Checkbox Clicked:
```
=== CHECKBOX CLICKED ===
New value: true
Calling updateSetting...
updateSetting called
```

### If Working:
```
=== TASK DOCUMENTATION DEBUG ===
taskDocumentationEnabled: true  ← Should change!
taskProgressTrackingEnabled: true
```

## 🎯 Common Issues & Solutions:

### Issue: Console shows "undefined"
```
taskDocumentationEnabled: undefined
```

**Cause:** State not loaded from backend
**Solution:** Check if StateServiceClient is working

### Issue: Console shows error
```
Failed to update setting taskDocumentationEnabled: ...
```

**Cause:** Backend not receiving update
**Solution:** Check if extension backend is running

### Issue: Value changes then reverts
```
taskDocumentationEnabled: true  ← Changes
taskDocumentationEnabled: false ← Then reverts
```

**Cause:** State being overwritten by backend
**Solution:** Backend not saving state properly

### Issue: No console output at all
```
(nothing)
```

**Cause:** Extension not reloaded, still running old code
**Solution:** Close VS Code completely and reopen

## 🚀 Nuclear Option - Complete Rebuild:

If nothing works, do this:

```bash
# 1. Clean everything
rm -rf dist dist-standalone webview-ui/build node_modules webview-ui/node_modules

# 2. Reinstall
npm install
cd webview-ui && npm install && cd ..

# 3. Rebuild everything
npm run protos
npm run build:webview
node esbuild.mjs

# 4. Close VS Code COMPLETELY

# 5. Reopen VS Code

# 6. Press F5 to start debugging
```

## 📝 What to Report:

If still not working, report:

1. **Console output** when opening settings
2. **Console output** when clicking checkbox
3. **Any errors** in console
4. **VS Code version**
5. **How you're running extension** (F5 debug? Installed?)

## 💡 Most Likely Cause:

**Extension chưa được reload đúng cách!**

Try this:
1. Close VS Code COMPLETELY (not just reload)
2. Reopen VS Code
3. Press F5 to start debugging
4. Test checkbox

---

**Next:** Add console logging và test lại!
