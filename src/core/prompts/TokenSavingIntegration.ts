import { ContextCompressor } from "./ContextCompressor"
import { ContextSelector } from "./ContextSelector"
import { TokenCounter } from "./TokenCounter"

export interface TokenSavingConfig {
	enabled: boolean
	compressionLevel: "none" | "light" | "medium" | "aggressive"
	maxContextTokens: number
	preserveCodeStructure: boolean
}

export interface TokenSavingStats {
	originalTokens: number
	compressedTokens: number
	tokensSaved: number
	savingsPercentage: number
	compressionTime: number
}

/**
 * TokenSavingIntegration
 * Integrates token saving features into API requests
 */
export class TokenSavingIntegration {
	private compressor: ContextCompressor
	private selector: ContextSelector
	private counter: TokenCounter
	private config: TokenSavingConfig
	private stats: TokenSavingStats[] = []

	constructor(config: TokenSavingConfig) {
		this.compressor = new ContextCompressor()
		this.selector = new ContextSelector()
		this.counter = new TokenCounter()
		this.config = config
	}

	/**
	 * Process messages before sending to API
	 */
	async processMessages(messages: Array<{ role: string; content: string }>, model: string): Promise<{
		messages: Array<{ role: string; content: string }>
		stats: TokenSavingStats
	}> {
		if (!this.config.enabled) {
			return {
				messages,
				stats: {
					originalTokens: 0,
					compressedTokens: 0,
					tokensSaved: 0,
					savingsPercentage: 0,
					compressionTime: 0,
				},
			}
		}

		const startTime = performance.now()

		// Count original tokens
		const originalTokens = messages.reduce(
			(sum, msg) => sum + this.counter.countTokens(msg.content, model),
			0
		)

		// Process each message
		const processedMessages = await Promise.all(
			messages.map(async (msg) => {
				if (msg.role === "user") {
					// Apply compression to user messages
					const compressed = await this.compressContent(msg.content, model)
					return { ...msg, content: compressed }
				}
				return msg
			})
		)

		// Count compressed tokens
		const compressedTokens = processedMessages.reduce(
			(sum, msg) => sum + this.counter.countTokens(msg.content, model),
			0
		)

		const compressionTime = performance.now() - startTime

		const stats: TokenSavingStats = {
			originalTokens,
			compressedTokens,
			tokensSaved: originalTokens - compressedTokens,
			savingsPercentage: originalTokens > 0 ? ((originalTokens - compressedTokens) / originalTokens) * 100 : 0,
			compressionTime,
		}

		this.stats.push(stats)

		return {
			messages: processedMessages,
			stats,
		}
	}

	/**
	 * Compress content based on configuration
	 */
	private async compressContent(content: string, model: string): Promise<string> {
		let compressed = content

		// Detect if content is code
		const isCode = this.detectCode(content)

		if (isCode) {
			// Apply code compression
			const language = this.detectLanguage(content)
			compressed = this.compressor.compressCode(content, language)
		} else {
			// Apply text compression based on level
			switch (this.config.compressionLevel) {
				case "light":
					// Remove extra whitespace only
					compressed = content.replace(/\s+/g, " ").trim()
					break
				case "medium":
					// Smart truncation
					compressed = this.compressor.smartTruncate(content, this.config.maxContextTokens)
					break
				case "aggressive":
					// Summarize
					compressed = this.compressor.summarizeFile(content, this.config.maxContextTokens)
					break
				default:
					compressed = content
			}
		}

		return compressed
	}

	/**
	 * Detect if content is code
	 */
	private detectCode(content: string): boolean {
		// Simple heuristics
		const codeIndicators = [
			/function\s+\w+\s*\(/,
			/class\s+\w+/,
			/import\s+.*from/,
			/const\s+\w+\s*=/,
			/def\s+\w+\s*\(/,
			/public\s+class/,
		]

		return codeIndicators.some((pattern) => pattern.test(content))
	}

	/**
	 * Detect programming language
	 */
	private detectLanguage(content: string): string {
		if (content.includes("def ") && content.includes(":")) return "python"
		if (content.includes("function") || content.includes("const")) return "javascript"
		if (content.includes("public class")) return "java"
		if (content.includes("fn ") && content.includes("->")) return "rust"
		return "javascript" // default
	}

	/**
	 * Get cumulative statistics
	 */
	getCumulativeStats(): {
		totalRequests: number
		totalTokensSaved: number
		averageSavingsPercentage: number
		totalCompressionTime: number
	} {
		if (this.stats.length === 0) {
			return {
				totalRequests: 0,
				totalTokensSaved: 0,
				averageSavingsPercentage: 0,
				totalCompressionTime: 0,
			}
		}

		const totalTokensSaved = this.stats.reduce((sum, stat) => sum + stat.tokensSaved, 0)
		const averageSavingsPercentage =
			this.stats.reduce((sum, stat) => sum + stat.savingsPercentage, 0) / this.stats.length
		const totalCompressionTime = this.stats.reduce((sum, stat) => sum + stat.compressionTime, 0)

		return {
			totalRequests: this.stats.length,
			totalTokensSaved,
			averageSavingsPercentage,
			totalCompressionTime,
		}
	}

	/**
	 * Reset statistics
	 */
	resetStats(): void {
		this.stats = []
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<TokenSavingConfig>): void {
		this.config = { ...this.config, ...config }
	}

	/**
	 * Get current configuration
	 */
	getConfig(): TokenSavingConfig {
		return { ...this.config }
	}
}
