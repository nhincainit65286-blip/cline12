import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslations from "./locales/en.json"
import viTranslations from "./locales/vi.json"

// Khởi tạo i18next
i18n
	.use(initReactI18next) // Kết nối với React
	.init({
		resources: {
			en: { translation: enTranslations },
			vi: { translation: viTranslations },
		},
		lng: "vi", // Ngôn ngữ mặc định là tiếng Việt
		fallbackLng: "en", // Ngôn ngữ dự phòng là tiếng Anh
		interpolation: {
			escapeValue: false, // React đã escape
		},
	})

export default i18n
