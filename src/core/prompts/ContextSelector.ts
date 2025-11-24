import { TokenCounter } from "./TokenCounter"

export interface Context {
	content: string
	path?: string
	relevance?: number
	dependencies?: string[]
}

/**
 * ContextSelector
 * Intelligently selects most relevant context within token budget
 */
export class ContextSelector {
	private tokenCounter: TokenCounter

	constructor() {
		this.tokenCounter = new TokenCounter()
	}

	/**
	 * Select most relevant files within token budget
	 */
	async selectRelevantFiles(files: string[], query: string, maxTokens: number): Promise<string[]> {
		if (files.length === 0) return []

		// Calculate relevance scores for all files
		const scoredFiles = files.map((file) => ({
			file,
			score: this.calculateRelevance(file, query),
		}))

		// Sort by relevance (highest first)
		scoredFiles.sort((a, b) => b.score - a.score)

		// Select files until token budget is reached
		const selected: string[] = []
		let totalTokens = 0

		for (const { file } of scoredFiles) {
			const fileTokens = this.tokenCounter.countTokens(file)

			if (totalTokens + fileTokens <= maxTokens) {
				selected.push(file)
				totalTokens += fileTokens
			} else {
				break
			}
		}

		return selected
	}

	/**
	 * Prioritize contexts by relevance and token budget
	 */
	async prioritizeContext(contexts: Context[], maxTokens: number): Promise<Context[]> {
		if (contexts.length === 0) return []

		// Calculate relevance if not provided
		const scoredContexts = contexts.map((ctx) => ({
			...ctx,
			relevance: ctx.relevance ?? 0.5,
		}))

		// Sort by relevance (highest first)
		scoredContexts.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))

		// Select contexts until token budget is reached
		const selected: Context[] = []
		let totalTokens = 0

		for (const ctx of scoredContexts) {
			const ctxTokens = this.tokenCounter.countTokens(ctx.content)

			if (totalTokens + ctxTokens <= maxTokens) {
				selected.push(ctx)
				totalTokens += ctxTokens
			} else {
				// Try to include partial content if possible
				const remainingTokens = maxTokens - totalTokens
				if (remainingTokens > 100) {
					// Only include if we have at least 100 tokens left
					const truncated = this.truncateToTokenLimit(ctx.content, remainingTokens)
					selected.push({
						...ctx,
						content: truncated,
					})
				}
				break
			}
		}

		return selected
	}

	/**
	 * Load context incrementally as needed
	 */
	async *loadContextIncrementally(query: string): AsyncGenerator<Context> {
		// This is a placeholder for incremental loading
		// In real implementation, this would load files on-demand
		yield {
			content: "Incremental context loading not yet implemented",
			relevance: 0,
		}
	}

	/**
	 * Calculate relevance score using TF-IDF-like approach
	 */
	private calculateRelevance(text: string, query: string): number {
		const textLower = text.toLowerCase()
		const queryTerms = query.toLowerCase().split(/\s+/)

		let score = 0

		for (const term of queryTerms) {
			if (!term) continue

			// Count occurrences
			const occurrences = (textLower.match(new RegExp(term, "g")) || []).length

			// TF (Term Frequency)
			const tf = occurrences / textLower.split(/\s+/).length

			// Simple IDF approximation (would need document corpus for real IDF)
			const idf = Math.log(1 + 1 / (1 + occurrences))

			score += tf * idf
		}

		// Boost score if query terms appear in file path
		if (text.includes(query)) {
			score *= 1.5
		}

		return score
	}

	/**
	 * Truncate content to fit within token limit
	 */
	private truncateToTokenLimit(content: string, maxTokens: number): string {
		const maxChars = maxTokens * 4 // Rough approximation

		if (content.length <= maxChars) {
			return content
		}

		// Keep beginning and add truncation marker
		return content.substring(0, maxChars) + "\n\n... [truncated to fit token budget] ..."
	}

	/**
	 * Include dependency chain for selected files
	 */
	async includeDependencies(selectedFiles: string[], allFiles: Map<string, string[]>): Promise<string[]> {
		const result = new Set<string>(selectedFiles)

		// BFS to find all dependencies
		const queue = [...selectedFiles]
		const visited = new Set<string>()

		while (queue.length > 0) {
			const file = queue.shift()!

			if (visited.has(file)) continue
			visited.add(file)

			const deps = allFiles.get(file) || []
			for (const dep of deps) {
				if (!result.has(dep)) {
					result.add(dep)
					queue.push(dep)
				}
			}
		}

		return Array.from(result)
	}

	/**
	 * Get selection statistics
	 */
	getSelectionStats(selected: Context[], total: Context[]): {
		selectedCount: number
		totalCount: number
		selectedTokens: number
		totalTokens: number
		coverage: number
	} {
		const selectedTokens = selected.reduce((sum, ctx) => sum + this.tokenCounter.countTokens(ctx.content), 0)

		const totalTokens = total.reduce((sum, ctx) => sum + this.tokenCounter.countTokens(ctx.content), 0)

		return {
			selectedCount: selected.length,
			totalCount: total.length,
			selectedTokens,
			totalTokens,
			coverage: total.length > 0 ? selected.length / total.length : 0,
		}
	}
}
