# 🔍 DEBUG - Why Settings Not Working

## Các bước debug:

### 1. Kiểm tra Extension đã reload chưa?
```
Trong VS Code:
1. Press Ctrl+Shift+P
2. Type: "Developer: Reload Window"
3. Hoặc close VS Code và mở lại
```

### 2. Kiểm tra Console Errors
```
1. Mở Cline Settings
2. Press F12 (Developer Tools)
3. Click Console tab
4. Try to toggle checkbox
5. Xem có error gì không?
```

### 3. Kiểm tra State được lưu chưa?
```
1. Toggle checkbox ON
2. Check console for: "Failed to update setting taskDocumentationEnabled"
3. Nếu có error → Settings không được save
```

### 4. Kiểm tra Proto có đúng không?
```powershell
# Check if UpdateSettingsRequest has the field:
Get-Content "src/shared/proto/cline/state.ts" | Select-String -Pattern "taskDocumentationEnabled" -Context 1,1
```

### 5. Kiểm tra ExtensionState có field không?
```
File: webview-ui/src/context/ExtensionStateContext.tsx
Should have: taskDocumentationEnabled?: boolean
```

## 🔧 Possible Issues:

### Issue 1: Extension chưa reload
**Solution:** Reload window hoàn toàn (Ctrl+Shift+P → "Reload Window")

### Issue 2: ExtensionStateContext thiếu field
**Check:** `webview-ui/src/context/ExtensionStateContext.tsx`
**Need:** `taskDocumentationEnabled` in state interface

### Issue 3: StateServiceClient không handle field
**Check:** Backend có nhận được request không?

### Issue 4: Checkbox bị disabled
**Check:** Có `disabled={true}` trong checkbox không?

## 🎯 Quick Test:

### Test 1: Console Log
Add this to checkbox onChange:
```typescript
onChange={(e: any) => {
    const checked = e.target.checked === true
    console.log("Checkbox clicked:", checked)
    updateSetting("taskDocumentationEnabled", checked)
    console.log("updateSetting called")
}}
```

### Test 2: Check Current Value
Add this before checkbox:
```typescript
console.log("Current taskDocumentationEnabled:", taskDocumentationEnabled)
```

### Test 3: Manual Test
Open browser console and run:
```javascript
// Check if StateServiceClient exists
console.log(StateServiceClient)

// Try to update manually
StateServiceClient.updateSettings({
    taskDocumentationEnabled: true
})
```

## 📋 Checklist:

- [ ] Extension đã reload (Ctrl+Shift+P → Reload Window)
- [ ] Proto files đã regenerate (`npm run protos`)
- [ ] Webview đã rebuild (`npm run build:webview`)
- [ ] Extension đã rebuild (`node esbuild.mjs`)
- [ ] No console errors khi click checkbox
- [ ] ExtensionStateContext có field `taskDocumentationEnabled`
- [ ] UpdateSettingsRequest có field `taskDocumentationEnabled`

## 🚨 Nếu vẫn không work:

### Option 1: Check ExtensionStateContext
```bash
# Search for ExtensionStateContext
Get-Content "webview-ui/src/context/ExtensionStateContext.tsx" | Select-String -Pattern "taskDocumentation"
```

### Option 2: Add Debug Logging
Modify `updateSetting` function to log:
```typescript
export const updateSetting = (field: keyof UpdateSettingsRequest, value: any) => {
    console.log("updateSetting called:", field, value)
    const updateRequest: Partial<UpdateSettingsRequest> = {}
    const convertedValue = convertToProtoValue(field, value)
    updateRequest[field] = convertedValue
    console.log("Sending update:", updateRequest)
    
    StateServiceClient.updateSettings(UpdateSettingsRequest.create(updateRequest))
        .then(() => console.log("Update success"))
        .catch((error) => {
            console.error(`Failed to update setting ${field}:`, error)
        })
}
```

### Option 3: Check if field exists in proto
```bash
# Should return the field definition
Get-Content "src/shared/proto/cline/state.ts" | Select-String -Pattern "taskDocumentationEnabled"
```

## 💡 Most Likely Issue:

**ExtensionStateContext chưa có field `taskDocumentationEnabled`!**

Cần check file: `webview-ui/src/context/ExtensionStateContext.tsx`
