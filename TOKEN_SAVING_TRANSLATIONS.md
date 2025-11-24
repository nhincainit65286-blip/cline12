# Token Saving Translations

## Add to en.json (after taskDocumentation section):

```json
"tokenSaving": "Enable Token Saving",
"tokenSavingDesc": "Automatically compress context to reduce token usage by 30-50%. Removes comments, extra whitespace, and deduplicates similar content while preserving code functionality. Saves significant API costs.",
"compressionLevel": "Compression Level",
"compressionLevelLight": "Light - Remove whitespace only",
"compressionLevelMedium": "Medium - Smart truncation (Recommended)",
"compressionLevelAggressive": "Aggressive - Maximum compression",
"tokensSaved": "Tokens Saved",
"costSavings": "Cost Savings",
"compressionStats": "Compression Statistics"
```

## Add to vi.json (after taskDocumentation section):

```json
"tokenSaving": "Bật Tiết kiệm Token",
"tokenSavingDesc": "Tự động nén context để giảm 30-50% token usage. Loại bỏ comments, khoảng trắng thừa và nội dung trùng lặp trong khi vẫn giữ nguyên chức năng code. Tiết kiệm đáng kể chi phí API.",
"compressionLevel": "Mức độ Nén",
"compressionLevelLight": "Nhẹ - Chỉ loại bỏ khoảng trắng",
"compressionLevelMedium": "Trung bình - Cắt giảm thông minh (Khuyến nghị)",
"compressionLevelAggressive": "Mạnh - Nén tối đa",
"tokensSaved": "Token đã tiết kiệm",
"costSavings": "Tiết kiệm Chi phí",
"compressionStats": "Thống kê Nén"
```

## Manual Steps:

1. Open `webview-ui/src/i18n/locales/en.json`
2. Find the `taskDocumentation` section (around line 238)
3. Add the English translations after `taskDocumentationDesc`
4. Open `webview-ui/src/i18n/locales/vi.json`
5. Find the `taskDocumentation` section
6. Add the Vietnamese translations after `taskDocumentationDesc`
7. Save both files
8. Run `npm run build:webview`

## UI Component to Add:

Add to `FeatureSettingsSection.tsx` after Task Documentation section:

```tsx
{/* Token Saving */}
<div style={{ marginBottom: 20 }}>
	<div className="flex items-center gap-2">
		<VSCodeCheckbox
			checked={tokenSavingEnabled ?? false}
			onChange={(e: any) => {
				const checked = e.target.checked === true
				updateSetting("tokenSavingEnabled", checked)
			}}>
			<span style={{ fontWeight: 500 }}>{t("settings.features.tokenSaving")}</span>
		</VSCodeCheckbox>
		<div
			className="px-2 py-0.5 rounded text-xs font-semibold"
			style={{
				backgroundColor: "var(--vscode-charts-green)",
				color: "var(--vscode-editor-background)",
			}}>
			SAVE $$$
		</div>
	</div>
	<p className="text-xs" style={{ color: "var(--vscode-descriptionForeground)", marginTop: 5 }}>
		{t("settings.features.tokenSavingDesc")}
	</p>
	
	{/* Compression Level */}
	{tokenSavingEnabled && (
		<div style={{ marginTop: 10, marginLeft: 20 }}>
			<label style={{ fontSize: "12px", fontWeight: 500 }}>
				{t("settings.features.compressionLevel")}
			</label>
			<VSCodeDropdown
				value={compressionLevel ?? "medium"}
				onChange={(e: any) => {
					updateSetting("compressionLevel", e.target.value)
				}}
				style={{ marginTop: 5, width: "100%" }}>
				<VSCodeOption value="light">
					{t("settings.features.compressionLevelLight")}
				</VSCodeOption>
				<VSCodeOption value="medium">
					{t("settings.features.compressionLevelMedium")}
				</VSCodeOption>
				<VSCodeOption value="aggressive">
					{t("settings.features.compressionLevelAggressive")}
				</VSCodeOption>
			</VSCodeDropdown>
		</div>
	)}
</div>
```

## State Management:

Add to `ExtensionMessage.ts`:
```typescript
tokenSavingEnabled?: boolean
compressionLevel?: "light" | "medium" | "aggressive"
```

Add to `state.proto`:
```protobuf
optional bool token_saving_enabled = 36;
optional string compression_level = 37;
```

Add to `state-keys.ts`:
```typescript
tokenSavingEnabled: boolean
compressionLevel: "light" | "medium" | "aggressive"
```

Then run:
```bash
npm run protos
npm run build:webview
```
