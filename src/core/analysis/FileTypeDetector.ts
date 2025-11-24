import * as path from "path"

export type FileType =
	| "typescript"
	| "javascript"
	| "python"
	| "java"
	| "rust"
	| "go"
	| "cpp"
	| "c"
	| "csharp"
	| "ruby"
	| "php"
	| "swift"
	| "kotlin"
	| "markdown"
	| "json"
	| "yaml"
	| "xml"
	| "html"
	| "css"
	| "sql"
	| "shell"
	| "binary"
	| "text"
	| "unknown"

/**
 * FileTypeDetector
 * Detects file types based on extension and content
 */
export class FileTypeDetector {
	private static readonly EXTENSION_MAP: Record<string, FileType> = {
		// TypeScript/JavaScript
		".ts": "typescript",
		".tsx": "typescript",
		".js": "javascript",
		".jsx": "javascript",
		".mjs": "javascript",
		".cjs": "javascript",

		// Python
		".py": "python",
		".pyw": "python",
		".pyx": "python",

		// Java/Kotlin
		".java": "java",
		".kt": "kotlin",
		".kts": "kotlin",

		// C/C++
		".c": "c",
		".h": "c",
		".cpp": "cpp",
		".cc": "cpp",
		".cxx": "cpp",
		".hpp": "cpp",

		// C#
		".cs": "csharp",

		// Go
		".go": "go",

		// Rust
		".rs": "rust",

		// Ruby
		".rb": "ruby",

		// PHP
		".php": "php",

		// Swift
		".swift": "swift",

		// Web
		".html": "html",
		".htm": "html",
		".css": "css",
		".scss": "css",
		".sass": "css",
		".less": "css",

		// Data
		".json": "json",
		".yaml": "yaml",
		".yml": "yaml",
		".xml": "xml",
		".toml": "yaml",

		// Markdown
		".md": "markdown",
		".markdown": "markdown",

		// SQL
		".sql": "sql",

		// Shell
		".sh": "shell",
		".bash": "shell",
		".zsh": "shell",
		".fish": "shell",
	}

	private static readonly BINARY_EXTENSIONS = new Set([
		".exe",
		".dll",
		".so",
		".dylib",
		".bin",
		".dat",
		".pdf",
		".zip",
		".tar",
		".gz",
		".jpg",
		".jpeg",
		".png",
		".gif",
		".bmp",
		".ico",
		".mp3",
		".mp4",
		".avi",
		".mov",
		".woff",
		".woff2",
		".ttf",
		".eot",
	])

	/**
	 * Detect file type from path and content
	 */
	detectFileType(filePath: string, content?: string): FileType {
		// Check if binary by extension first
		const ext = path.extname(filePath).toLowerCase()

		if (FileTypeDetector.BINARY_EXTENSIONS.has(ext)) {
			return "binary"
		}

		// Check extension map
		if (FileTypeDetector.EXTENSION_MAP[ext]) {
			return FileTypeDetector.EXTENSION_MAP[ext]
		}

		// If content provided, analyze it
		if (content) {
			return this.detectFromContent(content)
		}

		return "unknown"
	}

	/**
	 * Detect file type from content
	 */
	private detectFromContent(content: string): FileType {
		// Check for binary content
		if (this.isBinaryContent(content)) {
			return "binary"
		}

		// Check for specific patterns
		if (content.includes("#!/usr/bin/env python") || content.includes("def ") || content.includes("import ")) {
			return "python"
		}

		if (content.includes("function") || content.includes("const ") || content.includes("let ")) {
			return "javascript"
		}

		if (content.includes("interface ") || content.includes("type ") || content.includes(": string")) {
			return "typescript"
		}

		if (content.includes("public class") || content.includes("private class")) {
			return "java"
		}

		if (content.includes("fn ") && content.includes("->")) {
			return "rust"
		}

		if (content.includes("func ") && content.includes("package ")) {
			return "go"
		}

		if (content.startsWith("<?php")) {
			return "php"
		}

		if (content.startsWith("#!/bin/bash") || content.startsWith("#!/bin/sh")) {
			return "shell"
		}

		if (content.trim().startsWith("{") || content.trim().startsWith("[")) {
			try {
				JSON.parse(content)
				return "json"
			} catch {
				// Not JSON
			}
		}

		if (content.includes("<!DOCTYPE html") || content.includes("<html")) {
			return "html"
		}

		return "text"
	}

	/**
	 * Check if content is binary
	 */
	private isBinaryContent(content: string): boolean {
		// Check for null bytes
		if (content.includes("\0")) {
			return true
		}

		// Check for high ratio of non-printable characters
		let nonPrintable = 0
		for (let i = 0; i < Math.min(content.length, 1000); i++) {
			const code = content.charCodeAt(i)
			if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
				nonPrintable++
			}
		}

		return nonPrintable / Math.min(content.length, 1000) > 0.3
	}

	/**
	 * Check if file type is supported for analysis
	 */
	isAnalyzable(fileType: FileType): boolean {
		return ![
			"binary",
			"unknown",
			"markdown",
			"json",
			"yaml",
			"xml",
			"html",
			"css",
			"sql",
		].includes(fileType)
	}

	/**
	 * Get language name for display
	 */
	getLanguageName(fileType: FileType): string {
		const names: Record<FileType, string> = {
			typescript: "TypeScript",
			javascript: "JavaScript",
			python: "Python",
			java: "Java",
			rust: "Rust",
			go: "Go",
			cpp: "C++",
			c: "C",
			csharp: "C#",
			ruby: "Ruby",
			php: "PHP",
			swift: "Swift",
			kotlin: "Kotlin",
			markdown: "Markdown",
			json: "JSON",
			yaml: "YAML",
			xml: "XML",
			html: "HTML",
			css: "CSS",
			sql: "SQL",
			shell: "Shell",
			binary: "Binary",
			text: "Text",
			unknown: "Unknown",
		}

		return names[fileType] || "Unknown"
	}
}
