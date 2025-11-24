/**
 * TokenCounter
 * Accurate token counting and cost estimation for various models
 */
export class TokenCounter {
	// Token cost per 1M tokens (input/output) for common models
	private static readonly MODEL_COSTS: Record<
		string,
		{ input: number; output: number; cacheWrite?: number; cacheRead?: number }
	> = {
		// Claude models
		"claude-3-5-sonnet-20241022": { input: 3.0, output: 15.0, cacheWrite: 3.75, cacheRead: 0.3 },
		"claude-3-5-sonnet-20240620": { input: 3.0, output: 15.0, cacheWrite: 3.75, cacheRead: 0.3 },
		"claude-3-5-haiku-20241022": { input: 1.0, output: 5.0, cacheWrite: 1.25, cacheRead: 0.1 },
		"claude-3-opus-20240229": { input: 15.0, output: 75.0, cacheWrite: 18.75, cacheRead: 1.5 },
		"claude-3-sonnet-20240229": { input: 3.0, output: 15.0, cacheWrite: 3.75, cacheRead: 0.3 },
		"claude-3-haiku-20240307": { input: 0.25, output: 1.25, cacheWrite: 0.3, cacheRead: 0.03 },

		// GPT models
		"gpt-4o": { input: 2.5, output: 10.0 },
		"gpt-4o-mini": { input: 0.15, output: 0.6 },
		"gpt-4-turbo": { input: 10.0, output: 30.0 },
		"gpt-4": { input: 30.0, output: 60.0 },
		"gpt-3.5-turbo": { input: 0.5, output: 1.5 },

		// Gemini models
		"gemini-2.0-flash-exp": { input: 0.0, output: 0.0 }, // Free during preview
		"gemini-1.5-pro": { input: 1.25, output: 5.0 },
		"gemini-1.5-flash": { input: 0.075, output: 0.3 },

		// Default fallback
		default: { input: 1.0, output: 3.0 },
	}

	/**
	 * Count tokens in text
	 * Uses approximation: ~4 characters per token for English text
	 */
	countTokens(text: string, model?: string): number {
		if (!text) return 0

		// Rough approximation: 1 token ≈ 4 characters for English
		// This is a simplified version. For production, use tiktoken library
		const charCount = text.length
		const tokenCount = Math.ceil(charCount / 4)

		return tokenCount
	}

	/**
	 * Count tokens in multiple texts
	 */
	countTokensInArray(texts: string[], model?: string): number {
		return texts.reduce((total, text) => total + this.countTokens(text, model), 0)
	}

	/**
	 * Estimate cost for API request
	 */
	estimateCost(tokensIn: number, tokensOut: number, model: string): number {
		const costs = this.getModelCosts(model)

		const inputCost = (tokensIn / 1_000_000) * costs.input
		const outputCost = (tokensOut / 1_000_000) * costs.output

		return inputCost + outputCost
	}

	/**
	 * Estimate cost with cache
	 */
	estimateCostWithCache(
		tokensIn: number,
		tokensOut: number,
		cacheWrites: number,
		cacheReads: number,
		model: string
	): number {
		const costs = this.getModelCosts(model)

		const inputCost = (tokensIn / 1_000_000) * costs.input
		const outputCost = (tokensOut / 1_000_000) * costs.output
		const cacheWriteCost = costs.cacheWrite ? (cacheWrites / 1_000_000) * costs.cacheWrite : 0
		const cacheReadCost = costs.cacheRead ? (cacheReads / 1_000_000) * costs.cacheRead : 0

		return inputCost + outputCost + cacheWriteCost + cacheReadCost
	}

	/**
	 * Get model costs
	 */
	private getModelCosts(model: string): {
		input: number
		output: number
		cacheWrite?: number
		cacheRead?: number
	} {
		// Try exact match first
		if (TokenCounter.MODEL_COSTS[model]) {
			return TokenCounter.MODEL_COSTS[model]
		}

		// Try partial match (e.g., "claude-3-5-sonnet" matches "claude-3-5-sonnet-20241022")
		for (const [key, value] of Object.entries(TokenCounter.MODEL_COSTS)) {
			if (model.includes(key) || key.includes(model)) {
				return value
			}
		}

		// Fallback to default
		return TokenCounter.MODEL_COSTS.default
	}

	/**
	 * Format cost as USD string
	 */
	formatCost(cost: number): string {
		if (cost < 0.01) {
			return `$${cost.toFixed(4)}`
		}
		return `$${cost.toFixed(2)}`
	}

	/**
	 * Calculate tokens saved by compression
	 */
	calculateTokensSaved(originalTokens: number, compressedTokens: number): {
		saved: number
		percentage: number
	} {
		const saved = originalTokens - compressedTokens
		const percentage = originalTokens > 0 ? (saved / originalTokens) * 100 : 0

		return { saved, percentage }
	}

	/**
	 * Estimate if request will exceed context window
	 */
	willExceedContextWindow(tokens: number, model: string): boolean {
		const contextWindows: Record<string, number> = {
			"claude-3-5-sonnet": 200_000,
			"claude-3-5-haiku": 200_000,
			"claude-3-opus": 200_000,
			"gpt-4o": 128_000,
			"gpt-4-turbo": 128_000,
			"gemini-1.5-pro": 2_000_000,
			"gemini-1.5-flash": 1_000_000,
			default: 100_000,
		}

		let contextWindow = contextWindows.default

		for (const [key, value] of Object.entries(contextWindows)) {
			if (model.includes(key)) {
				contextWindow = value
				break
			}
		}

		return tokens > contextWindow
	}

	/**
	 * Get recommended compression level based on token count
	 */
	getRecommendedCompressionLevel(tokens: number, contextWindow: number): "none" | "light" | "medium" | "aggressive" {
		const usage = tokens / contextWindow

		if (usage < 0.5) return "none"
		if (usage < 0.7) return "light"
		if (usage < 0.9) return "medium"
		return "aggressive"
	}
}
