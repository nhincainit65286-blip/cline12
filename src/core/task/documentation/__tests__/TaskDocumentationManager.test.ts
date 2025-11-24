import * as fs from "fs/promises"
import * as path from "path"
import { TaskDocumentationManager } from "../TaskDocumentationManager"

// Mock fs module
jest.mock("fs/promises")

describe("TaskDocumentationManager", () => {
	let manager: TaskDocumentationManager
	const mockTaskId = "test-task-123"
	const mockWorkspaceRoot = "/mock/workspace"

	beforeEach(() => {
		jest.clearAllMocks()
		manager = new TaskDocumentationManager(mockTaskId, mockWorkspaceRoot)
	})

	describe("initialize", () => {
		it("should create output directory", async () => {
			;(fs.mkdir as jest.Mock).mockResolvedValue(undefined)

			await manager.initialize()

			expect(fs.mkdir).toHaveBeenCalledWith(
				path.join(mockWorkspaceRoot, ".cline", "tasks", mockTaskId),
				{ recursive: true }
			)
		})

		it("should throw error if directory creation fails", async () => {
			const error = new Error("Permission denied")
			;(fs.mkdir as jest.Mock).mockRejectedValue(error)

			await expect(manager.initialize()).rejects.toThrow("Permission denied")
		})
	})

	describe("logAction", () => {
		it("should log action event", () => {
			manager.logAction("action", "Test action", "Test details")

			// Access private events array through any to test
			const events = (manager as any).events
			expect(events).toHaveLength(1)
			expect(events[0]).toMatchObject({
				type: "action",
				description: "Test action",
				details: "Test details",
			})
			expect(events[0].timestamp).toBeDefined()
		})

		it("should log event without details", () => {
			manager.logAction("decision", "Test decision")

			const events = (manager as any).events
			expect(events).toHaveLength(1)
			expect(events[0].details).toBeUndefined()
		})
	})

	describe("logError", () => {
		it("should log error with stack trace", () => {
			manager.logError("Test error", "Stack trace", "Error context")

			const errors = (manager as any).errors
			expect(errors).toHaveLength(1)
			expect(errors[0]).toMatchObject({
				error: "Test error",
				stackTrace: "Stack trace",
				context: "Error context",
			})
		})
	})

	describe("logSolution", () => {
		it("should log successful solution", () => {
			manager.logSolution("Test problem", "Test solution", true)

			const solutions = (manager as any).solutions
			expect(solutions).toHaveLength(1)
			expect(solutions[0]).toMatchObject({
				problem: "Test problem",
				solution: "Test solution",
				success: true,
			})
		})
	})

	describe("generateHistoryFile", () => {
		it("should generate history file with events", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			manager.logAction("action", "Test action")
			await manager.generateHistoryFile()

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining(".task-history.md"),
				expect.stringContaining("Test action"),
				"utf-8"
			)
		})

		it("should handle empty events", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			await manager.generateHistoryFile()

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.any(String),
				expect.stringContaining("No events recorded yet"),
				"utf-8"
			)
		})
	})

	describe("generatePlanFile", () => {
		it("should generate plan file with subtasks", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			const baseTask = "Test base task"
			const subtasks = [
				{ id: "1", title: "Subtask 1", completed: true, progress: 100 },
				{ id: "2", title: "Subtask 2", completed: false, progress: 50 },
			]

			await manager.generatePlanFile(baseTask, subtasks)

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining(".task-plan.md"),
				expect.stringContaining("Test base task"),
				"utf-8"
			)
		})
	})

	describe("generateDebugFile", () => {
		it("should generate debug file with errors and solutions", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			manager.logError("Test error", "Stack trace")
			manager.logSolution("Test problem", "Test solution", true)

			await manager.generateDebugFile()

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining(".task-debug.md"),
				expect.stringContaining("Test error"),
				"utf-8"
			)
		})
	})

	describe("updateProgress", () => {
		it("should update progress file with correct percentage", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			await manager.updateProgress(3, 10)

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.stringContaining(".task-progress.json"),
				expect.stringContaining('"percentage": 30'),
				"utf-8"
			)
		})

		it("should handle zero total", async () => {
			;(fs.writeFile as jest.Mock).mockResolvedValue(undefined)

			await manager.updateProgress(0, 0)

			expect(fs.writeFile).toHaveBeenCalledWith(
				expect.any(String),
				expect.stringContaining('"percentage": 0'),
				"utf-8"
			)
		})
	})
})
