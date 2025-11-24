/**
 * i18n system for Cline extension backend
 * Hệ thống i18n cho backend của extension Cline
 */

import { messages_en, Messages } from "./messages.en"
import { messages_vi } from "./messages.vi"

type Language = "en" | "vi"

const messages: Record<Language, Messages> = {
	en: messages_en,
	vi: messages_vi,
}

let currentLanguage: Language = "vi" // Default to Vietnamese

/**
 * Set the current language for backend messages
 */
export function setLanguage(lang: Language) {
	currentLanguage = lang
}

/**
 * Get the current language
 */
export function getLanguage(): Language {
	return currentLanguage
}

/**
 * Get a translated message with optional parameter substitution
 * @param key - Message key in dot notation (e.g., "errors.gitNotInstalled")
 * @param params - Optional parameters to substitute in the message
 */
export function t(key: string, params?: Record<string, string | number>): string {
	const keys = key.split(".")
	let message: any = messages[currentLanguage]

	for (const k of keys) {
		if (message && typeof message === "object" && k in message) {
			message = message[k]
		} else {
			// Fallback to English if key not found
			message = messages.en
			for (const fallbackKey of keys) {
				if (message && typeof message === "object" && fallbackKey in message) {
					message = message[fallbackKey]
				} else {
					return key // Return key if not found in fallback
				}
			}
			break
		}
	}

	if (typeof message !== "string") {
		return key
	}

	// Substitute parameters
	if (params) {
		return message.replace(/\{(\w+)\}/g, (match, paramKey) => {
			return paramKey in params ? String(params[paramKey]) : match
		})
	}

	return message
}

// Export messages for direct access if needed
export { messages_en, messages_vi }
export type { Messages }
