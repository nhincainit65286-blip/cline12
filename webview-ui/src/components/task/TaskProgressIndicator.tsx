import React, { useEffect, useState } from "react"
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react"

interface TaskProgress {
	taskId: string
	completed: number
	total: number
	percentage: number
	lastUpdated: string
}

interface TaskProgressIndicatorProps {
	taskId: string
	workspaceRoot?: string
	enabled?: boolean
}

export const TaskProgressIndicator: React.FC<TaskProgressIndicatorProps> = ({ 
	taskId, 
	workspaceRoot,
	enabled = false 
}) => {
	const [progress, setProgress] = useState<TaskProgress | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!enabled) {
			setLoading(false)
			return
		}

		// Load progress from file
		const loadProgress = async () => {
			try {
				// Request progress data from extension
				// In a real implementation, this would use a proper message protocol
				// For now, we'll show a placeholder
				
				// Simulate loading progress
				// TODO: Implement actual file reading via extension API
				setProgress({
					taskId,
					completed: 0,
					total: 1,
					percentage: 0,
					lastUpdated: new Date().toISOString()
				})
				setLoading(false)
			} catch (err) {
				console.error("Failed to load task progress:", err)
				setError(err instanceof Error ? err.message : "Unknown error")
				setLoading(false)
			}
		}

		loadProgress()

		// Poll for updates every 2 seconds
		const interval = setInterval(loadProgress, 2000)

		return () => clearInterval(interval)
	}, [taskId, workspaceRoot, enabled])

	if (!enabled) {
		return null
	}

	if (loading) {
		return (
			<div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0" }}>
				<VSCodeProgressRing />
				<span style={{ fontSize: "12px", opacity: 0.8 }}>Loading progress...</span>
			</div>
		)
	}

	if (error) {
		return (
			<div style={{ padding: "8px", fontSize: "12px", color: "var(--vscode-errorForeground)" }}>
				Failed to load progress: {error}
			</div>
		)
	}

	if (!progress) {
		return null
	}

	const { completed, total, percentage } = progress

	return (
		<div
			style={{
				padding: "12px",
				background: "var(--vscode-editor-background)",
				border: "1px solid var(--vscode-panel-border)",
				borderRadius: "4px",
				marginTop: "8px",
			}}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
				<span style={{ fontSize: "13px", fontWeight: 500 }}>Task Progress</span>
				<span style={{ fontSize: "13px", fontWeight: 600, color: "var(--vscode-charts-blue)" }}>
					{percentage}%
				</span>
			</div>

			{/* Progress bar */}
			<div
				style={{
					width: "100%",
					height: "6px",
					background: "var(--vscode-progressBar-background)",
					borderRadius: "3px",
					overflow: "hidden",
					marginBottom: "8px",
				}}>
				<div
					style={{
						width: `${percentage}%`,
						height: "100%",
						background: "var(--vscode-progressBar-foreground)",
						transition: "width 0.3s ease",
					}}
				/>
			</div>

			{/* Subtask count */}
			<div style={{ fontSize: "11px", opacity: 0.8 }}>
				{completed} of {total} subtasks completed
			</div>
		</div>
	)
}
