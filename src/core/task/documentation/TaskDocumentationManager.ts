import * as fs from "fs/promises"
import * as path from "path"

export interface TaskEvent {
	timestamp: number
	type: "action" | "decision" | "change" | "error"
	description: string
	details?: string
}

export interface Subtask {
	id: string
	title: string
	completed: boolean
	progress: number
}

export interface TaskError {
	timestamp: number
	error: string
	stackTrace?: string
	context?: string
}

export interface TaskSolution {
	timestamp: number
	problem: string
	solution: string
	success: boolean
}

/**
 * TaskDocumentationManager
 * Manages automatic documentation generation for tasks
 * Creates 3 types of files: history, plan, and debug info
 */
export class TaskDocumentationManager {
	private taskId: string
	private outputDir: string
	private events: TaskEvent[] = []
	private errors: TaskError[] = []
	private solutions: TaskSolution[] = []

	constructor(taskId: string, workspaceRoot: string = process.cwd()) {
		this.taskId = taskId
		this.outputDir = path.join(workspaceRoot, ".cline", "tasks", taskId)
	}

	/**
	 * Initialize the documentation directory
	 */
	async initialize(): Promise<void> {
		try {
			await fs.mkdir(this.outputDir, { recursive: true })
		} catch (error) {
			console.error(`Failed to create task documentation directory: ${error}`)
			throw error
		}
	}

	/**
	 * Log a task action/event
	 */
	logAction(type: TaskEvent["type"], description: string, details?: string): void {
		this.events.push({
			timestamp: Date.now(),
			type,
			description,
			details,
		})
	}

	/**
	 * Log an error
	 */
	logError(error: string, stackTrace?: string, context?: string): void {
		this.errors.push({
			timestamp: Date.now(),
			error,
			stackTrace,
			context,
		})
	}

	/**
	 * Log a solution
	 */
	logSolution(problem: string, solution: string, success: boolean): void {
		this.solutions.push({
			timestamp: Date.now(),
			problem,
			solution,
			success,
		})
	}

	/**
	 * Generate task history file
	 */
	async generateHistoryFile(): Promise<void> {
		const filePath = path.join(this.outputDir, ".task-history.md")
		const content = this.buildHistoryContent()

		try {
			await fs.writeFile(filePath, content, "utf-8")
		} catch (error) {
			console.error(`Failed to write task history file: ${error}`)
			throw error
		}
	}

	/**
	 * Generate task plan file
	 */
	async generatePlanFile(baseTask: string, subtasks: Subtask[]): Promise<void> {
		const filePath = path.join(this.outputDir, ".task-plan.md")
		const content = this.buildPlanContent(baseTask, subtasks)

		try {
			await fs.writeFile(filePath, content, "utf-8")
		} catch (error) {
			console.error(`Failed to write task plan file: ${error}`)
			throw error
		}
	}

	/**
	 * Generate debug info file
	 */
	async generateDebugFile(): Promise<void> {
		const filePath = path.join(this.outputDir, ".task-debug.md")
		const content = this.buildDebugContent()

		try {
			await fs.writeFile(filePath, content, "utf-8")
		} catch (error) {
			console.error(`Failed to write debug info file: ${error}`)
			throw error
		}
	}

	/**
	 * Update progress file
	 */
	async updateProgress(completed: number, total: number): Promise<void> {
		const filePath = path.join(this.outputDir, ".task-progress.json")
		const progress = {
			taskId: this.taskId,
			completed,
			total,
			percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
			lastUpdated: new Date().toISOString(),
		}

		try {
			await fs.writeFile(filePath, JSON.stringify(progress, null, 2), "utf-8")
		} catch (error) {
			console.error(`Failed to write progress file: ${error}`)
			throw error
		}
	}

	/**
	 * Build history content
	 */
	private buildHistoryContent(): string {
		const lines: string[] = []

		lines.push("# Task History")
		lines.push("")
		lines.push(`**Task ID:** ${this.taskId}`)
		lines.push(`**Generated:** ${new Date().toISOString()}`)
		lines.push("")
		lines.push("---")
		lines.push("")

		if (this.events.length === 0) {
			lines.push("No events recorded yet.")
		} else {
			lines.push("## Timeline")
			lines.push("")

			for (const event of this.events) {
				const time = new Date(event.timestamp).toISOString()
				const icon = this.getEventIcon(event.type)

				lines.push(`### ${icon} ${event.description}`)
				lines.push(`**Time:** ${time}`)
				lines.push(`**Type:** ${event.type}`)

				if (event.details) {
					lines.push("")
					lines.push("**Details:**")
					lines.push("```")
					lines.push(event.details)
					lines.push("```")
				}

				lines.push("")
			}
		}

		return lines.join("\n")
	}

	/**
	 * Build plan content
	 */
	private buildPlanContent(baseTask: string, subtasks: Subtask[]): string {
		const lines: string[] = []

		lines.push("# Task Plan")
		lines.push("")
		lines.push(`**Task ID:** ${this.taskId}`)
		lines.push(`**Generated:** ${new Date().toISOString()}`)
		lines.push("")
		lines.push("---")
		lines.push("")

		lines.push("## Base Task")
		lines.push("")
		lines.push(baseTask)
		lines.push("")

		if (subtasks.length > 0) {
			lines.push("## Subtasks")
			lines.push("")

			const completed = subtasks.filter((st) => st.completed).length
			const total = subtasks.length
			const percentage = Math.round((completed / total) * 100)

			lines.push(`**Progress:** ${completed}/${total} (${percentage}%)`)
			lines.push("")

			for (const subtask of subtasks) {
				const checkbox = subtask.completed ? "✅" : "⬜"
				const progress = subtask.progress > 0 ? ` (${subtask.progress}%)` : ""

				lines.push(`${checkbox} **${subtask.title}**${progress}`)
			}
		}

		return lines.join("\n")
	}

	/**
	 * Build debug content
	 */
	private buildDebugContent(): string {
		const lines: string[] = []

		lines.push("# Task Debug Info")
		lines.push("")
		lines.push(`**Task ID:** ${this.taskId}`)
		lines.push(`**Generated:** ${new Date().toISOString()}`)
		lines.push("")
		lines.push("---")
		lines.push("")

		// Errors section
		lines.push("## Errors Encountered")
		lines.push("")

		if (this.errors.length === 0) {
			lines.push("No errors recorded.")
		} else {
			for (let i = 0; i < this.errors.length; i++) {
				const error = this.errors[i]
				const time = new Date(error.timestamp).toISOString()

				lines.push(`### Error ${i + 1}`)
				lines.push(`**Time:** ${time}`)
				lines.push(`**Error:** ${error.error}`)

				if (error.context) {
					lines.push(`**Context:** ${error.context}`)
				}

				if (error.stackTrace) {
					lines.push("")
					lines.push("**Stack Trace:**")
					lines.push("```")
					lines.push(error.stackTrace)
					lines.push("```")
				}

				lines.push("")
			}
		}

		// Solutions section
		lines.push("## Solutions Applied")
		lines.push("")

		if (this.solutions.length === 0) {
			lines.push("No solutions recorded.")
		} else {
			for (let i = 0; i < this.solutions.length; i++) {
				const solution = this.solutions[i]
				const time = new Date(solution.timestamp).toISOString()
				const status = solution.success ? "✅ Success" : "❌ Failed"

				lines.push(`### Solution ${i + 1} - ${status}`)
				lines.push(`**Time:** ${time}`)
				lines.push(`**Problem:** ${solution.problem}`)
				lines.push(`**Solution:** ${solution.solution}`)
				lines.push("")
			}
		}

		return lines.join("\n")
	}

	/**
	 * Get icon for event type
	 */
	private getEventIcon(type: TaskEvent["type"]): string {
		switch (type) {
			case "action":
				return "⚡"
			case "decision":
				return "🤔"
			case "change":
				return "📝"
			case "error":
				return "❌"
			default:
				return "•"
		}
	}
}
