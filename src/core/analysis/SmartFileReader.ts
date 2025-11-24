import * as fs from "fs/promises"
import { FileType, FileTypeDetector } from "./FileTypeDetector"

export interface FileAnalysis {
	path: string
	content: string
	fileType: FileType
	language: string
	size: number
	lines: number
	summary?: string
	symbols?: string[]
	imports?: string[]
	exports?: string[]
}

/**
 * SmartFileReader
 * Reads files with intelligent analysis and metadata extraction
 */
export class SmartFileReader {
	private typeDetector: FileTypeDetector
	private cache: Map<string, FileAnalysis> = new Map()

	constructor() {
		this.typeDetector = new FileTypeDetector()
	}

	/**
	 * Read file with full analysis
	 */
	async readFileWithAnalysis(filePath: string): Promise<FileAnalysis> {
		// Check cache first
		if (this.cache.has(filePath)) {
			return this.cache.get(filePath)!
		}

		try {
			// Read file content
			const content = await fs.readFile(filePath, "utf-8")

			// Detect file type
			const fileType = this.typeDetector.detectFileType(filePath, content)
			const language = this.typeDetector.getLanguageName(fileType)

			// Get file stats
			const stats = await fs.stat(filePath)
			const size = stats.size
			const lines = content.split("\n").length

			// Extract metadata
			const symbols = this.extractSymbols(content, fileType)
			const imports = this.extractImports(content, fileType)
			const exports = this.extractExports(content, fileType)
			const summary = this.generateSummary(content, fileType)

			const analysis: FileAnalysis = {
				path: filePath,
				content,
				fileType,
				language,
				size,
				lines,
				summary,
				symbols,
				imports,
				exports,
			}

			// Cache the result
			this.cache.set(filePath, analysis)

			return analysis
		} catch (error) {
			throw new Error(`Failed to read file ${filePath}: ${error}`)
		}
	}

	/**
	 * Read multiple files in parallel
	 */
	async readMultipleFiles(filePaths: string[]): Promise<FileAnalysis[]> {
		return Promise.all(filePaths.map((path) => this.readFileWithAnalysis(path)))
	}

	/**
	 * Extract symbols (functions, classes, etc.)
	 */
	private extractSymbols(content: string, fileType: FileType): string[] {
		const symbols: string[] = []

		switch (fileType) {
			case "typescript":
			case "javascript":
				// Extract function names
				const funcMatches = content.matchAll(/(?:function|const|let|var)\s+(\w+)/g)
				for (const match of funcMatches) {
					symbols.push(match[1])
				}
				// Extract class names
				const classMatches = content.matchAll(/class\s+(\w+)/g)
				for (const match of classMatches) {
					symbols.push(match[1])
				}
				break

			case "python":
				// Extract function names
				const pyFuncMatches = content.matchAll(/def\s+(\w+)/g)
				for (const match of pyFuncMatches) {
					symbols.push(match[1])
				}
				// Extract class names
				const pyClassMatches = content.matchAll(/class\s+(\w+)/g)
				for (const match of pyClassMatches) {
					symbols.push(match[1])
				}
				break

			case "java":
			case "csharp":
				// Extract class names
				const javaClassMatches = content.matchAll(/(?:public|private|protected)?\s*class\s+(\w+)/g)
				for (const match of javaClassMatches) {
					symbols.push(match[1])
				}
				break
		}

		return symbols
	}

	/**
	 * Extract import statements
	 */
	private extractImports(content: string, fileType: FileType): string[] {
		const imports: string[] = []

		switch (fileType) {
			case "typescript":
			case "javascript":
				const importMatches = content.matchAll(/import\s+.*?from\s+['"](.+?)['"]/g)
				for (const match of importMatches) {
					imports.push(match[1])
				}
				break

			case "python":
				const pyImportMatches = content.matchAll(/(?:from\s+(\S+)\s+)?import\s+(.+)/g)
				for (const match of pyImportMatches) {
					imports.push(match[1] || match[2])
				}
				break

			case "java":
				const javaImportMatches = content.matchAll(/import\s+(.+?);/g)
				for (const match of javaImportMatches) {
					imports.push(match[1])
				}
				break
		}

		return imports
	}

	/**
	 * Extract export statements
	 */
	private extractExports(content: string, fileType: FileType): string[] {
		const exports: string[] = []

		if (fileType === "typescript" || fileType === "javascript") {
			const exportMatches = content.matchAll(/export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g)
			for (const match of exportMatches) {
				exports.push(match[1])
			}
		}

		return exports
	}

	/**
	 * Generate file summary
	 */
	private generateSummary(content: string, fileType: FileType): string {
		const lines = content.split("\n")
		const firstLines = lines.slice(0, 5).join("\n")

		// Extract first comment block if exists
		const commentMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
		if (commentMatch) {
			return commentMatch[1].trim()
		}

		// Extract first few lines as summary
		return firstLines.substring(0, 200) + (firstLines.length > 200 ? "..." : "")
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear()
	}

	/**
	 * Get cache size
	 */
	getCacheSize(): number {
		return this.cache.size
	}

	/**
	 * Check if file is in cache
	 */
	isCached(filePath: string): boolean {
		return this.cache.has(filePath)
	}
}
