import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react"
import React, { useEffect } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { useTranslation } from "@/hooks/useTranslation"
import { updateSetting } from "./utils/settingsHandlers"

// Map language display names to i18n codes
const languageCodeMap: Record<string, string> = {
	English: "en",
	"Vietnamese - Tiếng Việt": "vi",
	// Add more mappings as needed
}

const PreferredLanguageSetting: React.FC = () => {
	const { preferredLanguage } = useExtensionState()
	const { t, changeLanguage, i18n } = useTranslation()

	// Sync i18n language with preferred language setting
	useEffect(() => {
		if (preferredLanguage) {
			// If user has set a preference, use it
			const langCode = languageCodeMap[preferredLanguage] || "vi"
			changeLanguage(langCode)
		} else {
			// If no preference, sync setting with current i18n language (default Vietnamese)
			const currentLang = i18n.language
			const displayName = Object.keys(languageCodeMap).find(
				key => languageCodeMap[key] === currentLang
			) || "Vietnamese - Tiếng Việt"
			
			// Set default to Vietnamese
			if (displayName !== "English") {
				updateSetting("preferredLanguage", displayName)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preferredLanguage])

	const handleLanguageChange = (newLanguage: string) => {
		updateSetting("preferredLanguage", newLanguage)
		// Also update i18n immediately
		const langCode = languageCodeMap[newLanguage] || "en"
		changeLanguage(langCode)
	}

	return (
		<div style={{}}>
			<label className="block mb-1 text-base font-medium" htmlFor="preferred-language-dropdown">
				{t("settings.preferredLanguage")}
			</label>
			<VSCodeDropdown
				currentValue={preferredLanguage || "English"}
				id="preferred-language-dropdown"
				onChange={(e: any) => {
					handleLanguageChange(e.target.value)
				}}
				style={{ width: "100%" }}>
				<VSCodeOption value="English">English</VSCodeOption>
				<VSCodeOption value="Arabic - العربية">Arabic - العربية</VSCodeOption>
				<VSCodeOption value="Portuguese - Português (Brasil)">Portuguese - Português (Brasil)</VSCodeOption>
				<VSCodeOption value="Czech - Čeština">Czech - Čeština</VSCodeOption>
				<VSCodeOption value="French - Français">French - Français</VSCodeOption>
				<VSCodeOption value="German - Deutsch">German - Deutsch</VSCodeOption>
				<VSCodeOption value="Hindi - हिन्दी">Hindi - हिन्दी</VSCodeOption>
				<VSCodeOption value="Hungarian - Magyar">Hungarian - Magyar</VSCodeOption>
				<VSCodeOption value="Italian - Italiano">Italian - Italiano</VSCodeOption>
				<VSCodeOption value="Japanese - 日本語">Japanese - 日本語</VSCodeOption>
				<VSCodeOption value="Korean - 한국어">Korean - 한국어</VSCodeOption>
				<VSCodeOption value="Polish - Polski">Polish - Polski</VSCodeOption>
				<VSCodeOption value="Portuguese - Português (Portugal)">Portuguese - Português (Portugal)</VSCodeOption>
				<VSCodeOption value="Russian - Русский">Russian - Русский</VSCodeOption>
				<VSCodeOption value="Simplified Chinese - 简体中文">Simplified Chinese - 简体中文</VSCodeOption>
				<VSCodeOption value="Spanish - Español">Spanish - Español</VSCodeOption>
				<VSCodeOption value="Traditional Chinese - 繁體中文">Traditional Chinese - 繁體中文</VSCodeOption>
				<VSCodeOption value="Turkish - Türkçe">Turkish - Türkçe</VSCodeOption>
				<VSCodeOption value="Vietnamese - Tiếng Việt">Vietnamese - Tiếng Việt</VSCodeOption>
			</VSCodeDropdown>
			<p className="text-sm text-description mt-1">
				{preferredLanguage === "Vietnamese - Tiếng Việt"
					? "Ngôn ngữ mà Cline sử dụng để giao tiếp."
					: "The language that Cline should use for communication."}
			</p>
		</div>
	)
}

export default React.memo(PreferredLanguageSetting)
