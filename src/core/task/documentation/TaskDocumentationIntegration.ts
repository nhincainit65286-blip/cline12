import { TaskDocumentationManager } from "./TaskDocumentationManager"
import type { ClineMessage } from "@shared/ExtensionMessage"

/**
 * TaskDocumentationIntegration
 * Integrates task documentation with Task lifecycle
 */
export class TaskDocumentationIntegration {
	private manager?: TaskDocumentationManager
	private enabled: boolean = false
	private progressTrackingEnabled: boolean = false
	private taskId: string
	private workspaceRoot: string
	private subtaskCount: number = 0
	private completedSubtasks: number = 0

	constructor(taskId: string, workspaceRoot: string) {
		this.taskId = taskId
		this.workspaceRoot = workspaceRoot
	}

	/**
	 * Enable task documentation
	 */
	async enable(progressTracking: boolean = true): Promise<void> {
		this.enabled = true
		this.progressTrackingEnabled = progressTracking

		if (!this.manager) {
			this.manager = new TaskDocumentationManager(this.taskId, this.workspaceRoot)
			await this.manager.initialize()
		}
	}

	/**
	 * Disable task documentation
	 */
	disable(): void {
		this.enabled = false
		this.progressTrackingEnabled = false
	}

	/**
	 * Check if documentation is enabled
	 */
	isEnabled(): boolean {
		return this.enabled
	}

	/**
	 * On task start - generate initial plan file
	 */
	async onTaskStart(baseTask: string): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			// Log task start
			this.manager.logAction("action", "Task started", baseTask)

			// Generate initial plan file
			await this.manager.generatePlanFile(baseTask, [])

			// Initialize progress
			if (this.progressTrackingEnabled) {
				await this.manager.updateProgress(0, 1)
			}
		} catch (error) {
			console.error("Failed to document task start:", error)
		}
	}

	/**
	 * On message added - log as event
	 */
	async onMessageAdded(message: ClineMessage): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			// Log different message types
			if (message.type === "ask") {
				this.manager.logAction("decision", `AI asking: ${message.ask}`, message.text)
			} else if (message.type === "say") {
				if (message.say === "error") {
					this.manager.logError(message.text || "Unknown error", undefined, "Task execution")
				} else if (message.say === "tool") {
					this.manager.logAction("action", "Tool used", message.text)
				} else if (message.say === "text") {
					this.manager.logAction("change", "AI response", message.text)
				}
			}
		} catch (error) {
			console.error("Failed to log message:", error)
		}
	}

	/**
	 * On tool execution - log action
	 */
	async onToolExecution(toolName: string, details: string): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			this.manager.logAction("action", `Tool executed: ${toolName}`, details)
		} catch (error) {
			console.error("Failed to log tool execution:", error)
		}
	}

	/**
	 * On error - log error and attempt to log solution
	 */
	async onError(error: string, stackTrace?: string, context?: string): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			this.manager.logError(error, stackTrace, context)
		} catch (err) {
			console.error("Failed to log error:", err)
		}
	}

	/**
	 * On error recovery - log solution
	 */
	async onErrorRecovery(problem: string, solution: string, success: boolean): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			this.manager.logSolution(problem, solution, success)
		} catch (error) {
			console.error("Failed to log solution:", error)
		}
	}

	/**
	 * Update subtask progress
	 */
	async updateSubtaskProgress(completed: number, total: number): Promise<void> {
		if (!this.enabled || !this.manager || !this.progressTrackingEnabled) return

		try {
			this.subtaskCount = total
			this.completedSubtasks = completed
			await this.manager.updateProgress(completed, total)
		} catch (error) {
			console.error("Failed to update progress:", error)
		}
	}

	/**
	 * On task complete - generate all documentation files
	 */
	async onTaskComplete(baseTask: string, success: boolean): Promise<void> {
		if (!this.enabled || !this.manager) return

		try {
			// Log completion
			this.manager.logAction(
				success ? "action" : "error",
				success ? "Task completed successfully" : "Task failed",
				baseTask
			)

			// Generate all documentation files
			await Promise.all([
				this.manager.generateHistoryFile(),
				this.manager.generatePlanFile(baseTask, []),
				this.manager.generateDebugFile(),
			])

			// Final progress update
			if (this.progressTrackingEnabled) {
				await this.manager.updateProgress(
					success ? this.subtaskCount : this.completedSubtasks,
					this.subtaskCount || 1
				)
			}
		} catch (error) {
			console.error("Failed to document task completion:", error)
		}
	}

	/**
	 * Get documentation directory path
	 */
	getDocumentationPath(): string {
		return this.manager ? (this.manager as any).outputDir : ""
	}
}
