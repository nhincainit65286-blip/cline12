# i18n (Internationalization) Guide

## Overview

This project uses `react-i18next` for internationalization. Currently supported languages:
- English (en) - Default
- Vietnamese (vi) - Tiếng Việt

## Usage

### In React Components

```tsx
import { useTranslation } from "@/hooks/useTranslation"

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t("common.save")}</h1>
      <p>{t("chat.inputPlaceholder")}</p>
    </div>
  )
}
```

### Changing Language

The language is automatically synced with the `preferredLanguage` setting in ExtensionState. When users change their preferred language in Settings, the UI language updates automatically.

You can also manually change language:

```tsx
const { changeLanguage } = useTranslation()

changeLanguage("vi") // Switch to Vietnamese
changeLanguage("en") // Switch to English
```

### Getting Current Language

```tsx
const { currentLanguage } = useTranslation()

console.log(currentLanguage) // "en" or "vi"
```

## Translation Files

Translation files are located in `webview-ui/src/i18n/locales/`:

- `en.json` - English translations (base)
- `vi.json` - Vietnamese translations

### File Structure

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    ...
  },
  "chat": {
    "send": "Send",
    ...
  },
  "settings": {
    "title": "Settings",
    ...
  }
}
```

## Adding New Translations

1. Add the key to `en.json`:
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

2. Add the translation to `vi.json`:
```json
{
  "mySection": {
    "myKey": "Văn bản tiếng Việt của tôi"
  }
}
```

3. Use in component:
```tsx
{t("mySection.myKey")}
```

## Best Practices

1. **Use descriptive keys**: `settings.apiConfiguration` instead of `settings.api`
2. **Group related translations**: Keep all chat-related strings under `chat.*`
3. **Avoid hardcoded strings**: Always use translation keys
4. **Keep translations consistent**: Use the same terms throughout the app
5. **Test with both languages**: Make sure UI doesn't break with longer Vietnamese text

## Language Code Mapping

The extension uses display names like "Vietnamese - Tiếng Việt" but i18n uses codes like "vi". The mapping is in `PreferredLanguageSetting.tsx`:

```tsx
const languageCodeMap: Record<string, string> = {
  "English": "en",
  "Vietnamese - Tiếng Việt": "vi",
  // Add more as needed
}
```

## Adding a New Language

1. Create new translation file: `locales/[code].json`
2. Copy structure from `en.json` and translate all strings
3. Add to i18n config in `config.ts`:
```tsx
resources: {
  en: { translation: en },
  vi: { translation: vi },
  [newCode]: { translation: newTranslations },
}
```
4. Add mapping in `PreferredLanguageSetting.tsx`
5. Update this README

## Notes

- Fallback language is English
- Missing translations will show the English version
- Language preference is saved in extension state
- UI updates immediately when language changes
