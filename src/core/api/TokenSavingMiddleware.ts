import { ClineStorageMessage } from "@/shared/messages/content"
import { TokenSavingConfig, TokenSavingIntegration } from "../prompts/TokenSavingIntegration"

/**
 * TokenSavingMiddleware
 * Middleware to apply token saving to API requests
 */
export class TokenSavingMiddleware {
	private static instance: TokenSavingMiddleware
	private integration: TokenSavingIntegration
	private enabled: boolean = false

	private constructor() {
		const config: TokenSavingConfig = {
			enabled: false,
			compressionLevel: "medium",
			maxContextTokens: 100000,
			preserveCodeStructure: true,
		}
		this.integration = new TokenSavingIntegration(config)
	}

	static getInstance(): TokenSavingMiddleware {
		if (!TokenSavingMiddleware.instance) {
			TokenSavingMiddleware.instance = new TokenSavingMiddleware()
		}
		return TokenSavingMiddleware.instance
	}

	/**
	 * Enable token saving
	 */
	enable(config?: Partial<TokenSavingConfig>): void {
		this.enabled = true
		if (config) {
			this.integration.updateConfig({ ...config, enabled: true })
		}
	}

	/**
	 * Disable token saving
	 */
	disable(): void {
		this.enabled = false
		this.integration.updateConfig({ enabled: false })
	}

	/**
	 * Process messages before sending to API
	 */
	async processMessages(
		messages: ClineStorageMessage[],
		model: string,
	): Promise<{
		messages: ClineStorageMessage[]
		stats: {
			originalTokens: number
			compressedTokens: number
			tokensSaved: number
			savingsPercentage: number
		}
	}> {
		if (!this.enabled) {
			return {
				messages,
				stats: {
					originalTokens: 0,
					compressedTokens: 0,
					tokensSaved: 0,
					savingsPercentage: 0,
				},
			}
		}

		// Convert ClineStorageMessage to simple format for processing
		const simpleMessages = messages.map((msg) => ({
			role: msg.role,
			content: this.extractTextContent(msg),
		}))

		// Process with integration
		const result = await this.integration.processMessages(simpleMessages, model)

		// Convert back to ClineStorageMessage format
		const processedMessages = messages.map((msg, index) => {
			const processed = result.messages[index]
			if (processed && msg.role === "user") {
				// Update content if it was compressed
				return {
					...msg,
					content: this.updateMessageContent(msg, processed.content),
				}
			}
			return msg
		})

		return {
			messages: processedMessages,
			stats: result.stats,
		}
	}

	/**
	 * Extract text content from message
	 */
	private extractTextContent(message: ClineStorageMessage): string {
		if (typeof message.content === "string") {
			return message.content
		}

		if (Array.isArray(message.content)) {
			return message.content
				.filter((block) => block.type === "text")
				.map((block: any) => block.text)
				.join("\n")
		}

		return ""
	}

	/**
	 * Update message content with compressed version
	 */
	private updateMessageContent(original: ClineStorageMessage, compressed: string): ClineStorageMessage["content"] {
		if (typeof original.content === "string") {
			return compressed
		}

		if (Array.isArray(original.content)) {
			return original.content.map((block) => {
				if (block.type === "text") {
					return { ...block, text: compressed }
				}
				return block
			})
		}

		return original.content
	}

	/**
	 * Get cumulative statistics
	 */
	getStats() {
		return this.integration.getCumulativeStats()
	}

	/**
	 * Reset statistics
	 */
	resetStats(): void {
		this.integration.resetStats()
	}

	/**
	 * Check if enabled
	 */
	isEnabled(): boolean {
		return this.enabled
	}
}

// Export singleton instance
export const tokenSavingMiddleware = TokenSavingMiddleware.getInstance()
