# Cleanup Notes - Xóa UI chưa hoàn thiện

## Cần xóa trong FeatureSettingsSection.tsx:

### 1. Token Saving Section (lines ~426-467)
```tsx
{/* Token Saving */}
<div style={{ marginTop: 20 }}>
  ...
</div>
```

### 2. Smart File Reading Section (lines ~469-494)
```tsx
{/* Smart File Reading */}
<div style={{ marginTop: 20 }}>
  ...
</div>
```

### 3. AI Discovery Mode Section (lines ~496-590)
```tsx
{/* AI Discovery Mode */}
<div style={{ marginTop: 20, marginBottom: 20 }}>
  ...
</div>
```

### 4. Core Enhancements Section (lines ~592-710)
```tsx
{/* Core Enhancements */}
<div style={{ ... }}>
  ...
</div>
```

## GIỮ LẠI:

### Task Documentation & Tracking Section (lines ~712-850)
- Đây là feature duy nhất đã integrate
- Có thể test được
- Giữ nguyên toàn bộ

## Translations cần xóa:

### en.json - Xóa các keys:
- tokenSaving
- tokenSavingDesc
- tokenSavingLevel*
- smartFileReading
- smartFileReadingDesc
- aiDiscoveryMode
- aiDiscoveryModeDesc
- coreEnhancements
- advancedCodeUnderstanding*
- intelligentErrorRecovery*
- contextAwareSuggestions*
- collaborativeCodingMode*

### vi.json - Xóa các keys tương ứng

## Kết quả sau cleanup:

Settings UI sẽ chỉ có:
- ✅ Task Documentation & Tracking (working)
- ❌ Không có các features chưa hoàn thiện

Clean, không confuse user!
