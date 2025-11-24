import { ContextCompressor } from "../ContextCompressor"

describe("ContextCompressor", () => {
	let compressor: ContextCompressor

	beforeEach(() => {
		compressor = new ContextCompressor()
	})

	describe("compressCode", () => {
		it("should remove single-line comments", () => {
			const code = `
function test() {
	// This is a comment
	return true
}
			`
			const compressed = compressor.compressCode(code, "javascript")
			expect(compressed).not.toContain("// This is a comment")
			expect(compressed).toContain("return true")
		})

		it("should remove multi-line comments", () => {
			const code = `
function test() {
	/* This is a
	   multi-line comment */
	return true
}
			`
			const compressed = compressor.compressCode(code, "javascript")
			expect(compressed).not.toContain("multi-line comment")
			expect(compressed).toContain("return true")
		})

		it("should remove empty lines", () => {
			const code = `
function test() {

	return true

}
			`
			const compressed = compressor.compressCode(code, "javascript")
			const lines = compressed.split("\n").filter((line) => line.trim())
			expect(lines.length).toBeLessThan(code.split("\n").length)
		})

		it("should preserve Python indentation", () => {
			const code = `
def test():
    if True:
        return True
			`
			const compressed = compressor.compressCode(code, "python")
			expect(compressed).toContain("    if True:")
		})

		it("should return original code on error", () => {
			const code = "test code"
			const compressed = compressor.compressCode(code, "unknown")
			expect(compressed).toBe(code.trim())
		})
	})

	describe("summarizeFile", () => {
		it("should return full content if under limit", () => {
			const content = "short content"
			const summary = compressor.summarizeFile(content, 1000)
			expect(summary).toBe(content)
		})

		it("should truncate long content", () => {
			const content = "a".repeat(10000)
			const summary = compressor.summarizeFile(content, 100)
			expect(summary.length).toBeLessThan(content.length)
			expect(summary).toContain("[truncated]")
		})

		it("should preserve header and footer", () => {
			const content = "HEADER" + "x".repeat(10000) + "FOOTER"
			const summary = compressor.summarizeFile(content, 100)
			expect(summary).toContain("HEADER")
			expect(summary).toContain("FOOTER")
		})
	})

	describe("smartTruncate", () => {
		it("should return full text if under limit", () => {
			const text = "short text"
			const truncated = compressor.smartTruncate(text, 1000)
			expect(truncated).toBe(text)
		})

		it("should truncate middle of long text", () => {
			const text = "START" + "x".repeat(10000) + "END"
			const truncated = compressor.smartTruncate(text, 100)
			expect(truncated).toContain("START")
			expect(truncated).toContain("END")
			expect(truncated).toContain("[content truncated")
			expect(truncated.length).toBeLessThan(text.length)
		})
	})

	describe("deduplicateContext", () => {
		it("should remove exact duplicates", () => {
			const contexts = ["test 1", "test 2", "test 1", "test 3"]
			const deduplicated = compressor.deduplicateContext(contexts)
			expect(deduplicated).toHaveLength(3)
			expect(deduplicated).toEqual(["test 1", "test 2", "test 3"])
		})

		it("should remove similar content", () => {
			const contexts = ["hello world", "HELLO WORLD", "goodbye world"]
			const deduplicated = compressor.deduplicateContext(contexts)
			expect(deduplicated.length).toBeLessThan(contexts.length)
		})

		it("should keep different content", () => {
			const contexts = ["test 1", "test 2", "test 3"]
			const deduplicated = compressor.deduplicateContext(contexts)
			expect(deduplicated).toHaveLength(3)
		})
	})

	describe("getCompressionRatio", () => {
		it("should calculate compression ratio", () => {
			const original = "a".repeat(1000)
			const compressed = "a".repeat(500)
			const ratio = compressor.getCompressionRatio(original, compressed)
			expect(ratio).toBe(0.5)
		})

		it("should return 0 for empty original", () => {
			const ratio = compressor.getCompressionRatio("", "test")
			expect(ratio).toBe(0)
		})

		it("should return negative for expansion", () => {
			const original = "test"
			const compressed = "test test"
			const ratio = compressor.getCompressionRatio(original, compressed)
			expect(ratio).toBeLessThan(0)
		})
	})
})
