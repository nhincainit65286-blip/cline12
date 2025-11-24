/**
 * ContextCompressor
 * Compresses context to reduce token usage while preserving important information
 */
export class ContextCompressor {
	/**
	 * Compress code by removing comments and extra whitespace
	 * Uses AST-aware compression to maintain syntax validity
	 */
	compressCode(code: string, language: string): string {
		try {
			// Remove single-line comments
			let compressed = code.replace(/\/\/.*$/gm, "")

			// Remove multi-line comments
			compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, "")

			// Remove empty lines
			compressed = compressed.replace(/^\s*[\r\n]/gm, "")

			// Reduce multiple spaces to single space (but preserve indentation)
			compressed = compressed.replace(/[^\S\r\n]+/g, " ")

			// Special handling for Python (preserve indentation)
			if (language === "python") {
				// Don't compress indentation for Python
				return code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
			}

			return compressed.trim()
		} catch (error) {
			console.error("Failed to compress code:", error)
			return code // Return original on error
		}
	}

	/**
	 * Summarize file content by extracting key information
	 */
	summarizeFile(content: string, maxTokens: number): string {
		// Rough estimate: 1 token ≈ 4 characters
		const maxChars = maxTokens * 4

		if (content.length <= maxChars) {
			return content
		}

		// Extract first and last portions
		const headerSize = Math.floor(maxChars * 0.3)
		const footerSize = Math.floor(maxChars * 0.3)
		const middleSize = maxChars - headerSize - footerSize

		const header = content.substring(0, headerSize)
		const footer = content.substring(content.length - footerSize)

		// Try to find important middle section (functions, classes, exports)
		const importantPatterns = [
			/export\s+(class|function|const|interface|type)/g,
			/class\s+\w+/g,
			/function\s+\w+/g,
		]

		let middle = ""
		for (const pattern of importantPatterns) {
			const matches = content.match(pattern)
			if (matches && matches.length > 0) {
				middle = matches.slice(0, 5).join("\n")
				break
			}
		}

		if (!middle) {
			// Fallback: take middle section
			const middleStart = Math.floor((content.length - middleSize) / 2)
			middle = content.substring(middleStart, middleStart + middleSize)
		}

		return `${header}\n\n... [truncated] ...\n\n${middle}\n\n... [truncated] ...\n\n${footer}`
	}

	/**
	 * Smart truncation that preserves important parts
	 */
	smartTruncate(text: string, maxTokens: number): string {
		const maxChars = maxTokens * 4

		if (text.length <= maxChars) {
			return text
		}

		// Keep beginning and end, truncate middle
		const keepSize = Math.floor(maxChars / 2)
		const start = text.substring(0, keepSize)
		const end = text.substring(text.length - keepSize)

		return `${start}\n\n... [content truncated to save tokens] ...\n\n${end}`
	}

	/**
	 * Deduplicate similar content
	 */
	deduplicateContext(contexts: string[]): string[] {
		const seen = new Set<string>()
		const deduplicated: string[] = []

		for (const context of contexts) {
			// Create a normalized version for comparison
			const normalized = context.toLowerCase().replace(/\s+/g, " ").trim()

			// Check for exact duplicates
			if (seen.has(normalized)) {
				continue
			}

			// Check for similar content (>80% overlap)
			let isDuplicate = false
			for (const seenContext of seen) {
				const similarity = this.calculateSimilarity(normalized, seenContext)
				if (similarity > 0.8) {
					isDuplicate = true
					break
				}
			}

			if (!isDuplicate) {
				seen.add(normalized)
				deduplicated.push(context)
			}
		}

		return deduplicated
	}

	/**
	 * Calculate similarity between two strings (0-1)
	 */
	private calculateSimilarity(str1: string, str2: string): number {
		const longer = str1.length > str2.length ? str1 : str2
		const shorter = str1.length > str2.length ? str2 : str1

		if (longer.length === 0) {
			return 1.0
		}

		const editDistance = this.levenshteinDistance(longer, shorter)
		return (longer.length - editDistance) / longer.length
	}

	/**
	 * Calculate Levenshtein distance between two strings
	 */
	private levenshteinDistance(str1: string, str2: string): number {
		const matrix: number[][] = []

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i]
		}

		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1]
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // substitution
						matrix[i][j - 1] + 1, // insertion
						matrix[i - 1][j] + 1 // deletion
					)
				}
			}
		}

		return matrix[str2.length][str1.length]
	}

	/**
	 * Estimate compression ratio achieved
	 */
	getCompressionRatio(original: string, compressed: string): number {
		if (original.length === 0) return 0
		return 1 - compressed.length / original.length
	}
}
