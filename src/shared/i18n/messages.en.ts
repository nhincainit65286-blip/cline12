/**
 * English messages for Cline extension backend
 * These messages are used in notifications, errors, and other user-facing text
 */

export const messages_en = {
	// Error messages
	errors: {
		gitNotInstalled: "Git is not installed",
		notGitRepository: "Not a git repository",
		noChangesForCommit: "No changes in workspace for commit message",
		operationTimeout: "Operation timeout",
		operationFailed: "Operation failed after {attempts} attempts: {message}",
		allCommandsFailed: "All OS commands failed",
		failedToGetCommitInfo: "Failed to get commit info: {error}",
		failedToGetWorkingState: "Failed to get working state: {error}",
		errorReadingDirectory: "Error reading directory at {path}",
		binaryNotFound: "Could not find binary {name} at: {location}",
		failedToWriteClipboard: "Failed to write to clipboard: {error}",
		failedToReadClipboard: "Failed to read from clipboard: {error}",
		healthCheckTimeout: "HostBridge health check timed out after {timeout}ms",
	},

	// Notification messages
	notifications: {
		noMcpOAuthSecrets: "No MCP OAuth secrets found - no servers are authenticated",
		expiredTokens: "Expired {count} MCP OAuth token(s). Reload window to test token refresh flow.",
		failedToExpireTokens: "Failed to expire tokens: {error}",
		reloadWindow: "Reload Window",
	},

	// Git messages
	git: {
		searchingCommits: "Searching commits...",
		gettingCommitInfo: "Getting commit info...",
		gettingWorkingState: "Getting working state...",
		gettingRemotes: "Getting git remotes...",
		gettingLatestCommit: "Getting latest commit hash...",
	},

	// General messages
	general: {
		loading: "Loading...",
		saving: "Saving...",
		success: "Success",
		failed: "Failed",
		cancelled: "Cancelled",
		confirm: "Confirm",
		cancel: "Cancel",
		yes: "Yes",
		no: "No",
		ok: "OK",
		done: "Done",
		retry: "Retry",
		delete: "Delete",
		yesReconstruct: "Yes, Reconstruct",
	},

	// Commands
	commands: {
		addToChat: "Add to Chat",
		fixWithCline: "Fix with Cline",
		explainCode: "Explain Code",
		improveCode: "Improve Code",
		focusChatInput: "Focus Chat Input",
		openWalkthrough: "Open Walkthrough",
		reconstructTaskHistory: "Reconstruct Task History",
		generateCommit: "Generate Commit Message",
		abortCommit: "Abort Commit Generation",
		terminalOutput: "Get Terminal Output",
		noActiveTerminal: "No active terminal found",
		noTextSelected: "No text selected",
		noFileOpen: "No file open",
	},

	// Task messages
	tasks: {
		started: "Task started",
		completed: "Task completed successfully",
		failed: "Task failed: {error}",
		aborted: "Task aborted",
		inProgress: "Task in progress...",
	},

	// Commit messages
	commits: {
		generated: "Commit message generated",
		generationFailed: "Failed to generate commit message: {error}",
		aborted: "Commit generation aborted",
		noChanges: "No changes to commit",
	},

	// Extension lifecycle
	extension: {
		activated: "Cline extension activated",
		deactivated: "Cline extension deactivated",
		ready: "Cline is ready",
	},

	// Settings messages
	settings: {
		saved: "Settings saved successfully",
		saveFailed: "Failed to save settings: {error}",
		reset: "Settings reset to defaults",
		resetFailed: "Failed to reset settings: {error}",
	},

	// History messages
	history: {
		cleared: "History cleared",
		clearFailed: "Failed to clear history: {error}",
		exported: "History exported successfully",
		exportFailed: "Failed to export history: {error}",
		imported: "History imported successfully",
		importFailed: "Failed to import history: {error}",
	},

	// Connection messages
	connection: {
		established: "Connection established",
		lost: "Connection lost",
		reconnecting: "Reconnecting...",
		reconnected: "Reconnected successfully",
		failed: "Connection failed: {error}",
	},

	// Authentication messages
	auth: {
		required: "Authentication required",
		success: "Authentication successful",
		failed: "Authentication failed: {error}",
		expired: "Authentication expired",
		logout: "Logged out successfully",
		logoutSuccess: "Successfully logged out of Cline",
		logoutFailed: "Logout failed",
		loginFailed: "Failed to log in to Cline",
		ocaLogoutSuccess: "Successfully logged out of OCA",
		ocaLogoutFailed: "OCA Logout failed",
		ocaLoginFailed: "Failed to log in to OCA",
		mcpAuthSuccess: "Successfully authenticated MCP server",
		mcpAuthFailed: "Failed to authenticate MCP server",
	},

	// Update messages
	updates: {
		available: "Update available: v{version}",
		installed: "Update installed successfully",
		failed: "Update failed: {error}",
		checking: "Checking for updates...",
	},

	// Prompts
	prompts: {
		confirmDelete: "Are you sure you want to delete this?",
		confirmClear: "Are you sure you want to clear all history?",
		confirmReset: "Are you sure you want to reset settings?",
		confirmAbort: "Are you sure you want to abort?",
		enterValue: "Enter value",
		selectOption: "Select an option",
		selectFile: "Select a file",
		selectFolder: "Select a folder",
		enterApiKey: "Enter your API key",
		enterModelName: "Enter model name",
		enterMessage: "Enter your message",
	},

	// Commit Message Generation
	commit: {
		generating: "Generating commit message for {{repo}}...",
		generationFailed: "Failed to generate commit message: {{error}}",
		noChanges: "No changes in repository {{repo}} for commit message",
		noChangesInWorkspace: "No changes found in any workspace repositories",
		gitNotFound: "Git extension not found",
		noRepositories: "No Git repositories available",
		repositoryNotFound: "Repository not found for provided SCM",
		selectRepository: "Select repository for commit message generation",
		generateForAll: "Generate for all repositories with changes",
		generateForAllDescription: "Generate commit messages for {{count}} repositories",
		emptyResponse: "empty API response",
	},

	// Workspace messages
	workspace: {
		initFailed: "Failed to initialize workspace. Using single folder mode.",
	},

	// Checkpoint messages
	checkpoint: {
		initFailed: "Failed to initialize checkpoint manager: {{error}}",
		initTimeout: "Checkpoint initialization timed out: {{error}}",
	},

	// Mentions messages
	mentions: {
		urlFetchError: "Error fetching content for {{url}}: {{error}}",
	},

	// Terminal messages
	terminal: {
		getContentsFailed: "Failed to get terminal contents",
	},

	// Webview messages
	webview: {
		devServerNotRunning:
			"Cline: Local webview dev server is not running, HMR will not work. Please run 'npm run dev:webview' before launching the extension to enable HMR. Using bundled assets.",
	},

	// Task History messages
	taskHistory: {
		reconstructConfirm:
			"This will rebuild your task history from existing task data. This operation will backup your current task history and attempt to reconstruct it from task folders. Continue?",
		reconstructing: "Reconstructing task history...",
		reconstructSuccess: "Task history successfully reconstructed! Found and restored {{count}} tasks.",
		reconstructWarning:
			"Reconstruction completed with warnings:\n- Reconstructed: {{reconstructed}} tasks\n- Skipped: {{skipped}} tasks\n- Errors: {{errorCount}}\n\nFirst few errors:\n{{errors}}",
		reconstructFailed: "Failed to reconstruct task history: {{error}}",
	},

	// MCP messages
	mcp: {
		restarting: "Restarting {{server}} MCP server...",
		connected: "{{server}} MCP server connected",
		connectFailed: "Failed to connect to {{server}} MCP server",
		notification: "MCP {{name}}: {{method}} - {{params}}",
		invalidSettingsFormat: "Invalid MCP settings format. Please ensure your settings follow the correct JSON format.",
		invalidSettingsSchema: "Invalid MCP settings schema.",
		updateAutoApproveFailed: "Failed to update autoApprove settings",
		updateStateFailed: "Failed to update server state: {{error}}",
		updateTimeoutFailed: "Failed to update server timeout: {{error}}",
	},
}

export type Messages = typeof messages_en
