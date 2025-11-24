import { useTranslation as useI18nextTranslation } from "react-i18next"

/**
 * Custom hook for translations
 * Wrapper around react-i18next's useTranslation
 */
export function useTranslation() {
	const { t, i18n } = useI18nextTranslation()

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
	}

	return {
		t,
		i18n,
		changeLanguage,
		currentLanguage: i18n.language,
	}
}
