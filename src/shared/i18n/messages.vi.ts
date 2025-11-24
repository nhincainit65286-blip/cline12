/**
 * Vietnamese messages for Cline extension backend
 * Các thông báo tiếng Việt cho backend của extension Cline
 */

import { Messages } from "./messages.en"

export const messages_vi: Messages = {
	// Error messages - Thông báo lỗi
	errors: {
		gitNotInstalled: "Git chưa được cài đặt",
		notGitRepository: "Không phải là git repository",
		noChangesForCommit: "Không có thay đổi nào trong workspace để tạo commit message",
		operationTimeout: "Hết thời gian chờ thao tác",
		operationFailed: "Thao tác thất bại sau {attempts} lần thử: {message}",
		allCommandsFailed: "Tất cả lệnh OS đều thất bại",
		failedToGetCommitInfo: "Không thể lấy thông tin commit: {error}",
		failedToGetWorkingState: "Không thể lấy trạng thái làm việc: {error}",
		errorReadingDirectory: "Lỗi khi đọc thư mục tại {path}",
		binaryNotFound: "Không tìm thấy binary {name} tại: {location}",
		failedToWriteClipboard: "Không thể ghi vào clipboard: {error}",
		failedToReadClipboard: "Không thể đọc từ clipboard: {error}",
		healthCheckTimeout: "Kiểm tra sức khỏe HostBridge hết thời gian sau {timeout}ms",
	},

	// Notification messages - Thông báo
	notifications: {
		noMcpOAuthSecrets: "Không tìm thấy MCP OAuth secrets - không có server nào được xác thực",
		expiredTokens: "Đã hết hạn {count} MCP OAuth token. Reload window để test token refresh flow.",
		failedToExpireTokens: "Không thể hết hạn tokens: {error}",
		reloadWindow: "Reload Window",
	},

	// Git messages - Thông báo Git
	git: {
		searchingCommits: "Đang tìm kiếm commits...",
		gettingCommitInfo: "Đang lấy thông tin commit...",
		gettingWorkingState: "Đang lấy trạng thái làm việc...",
		gettingRemotes: "Đang lấy git remotes...",
		gettingLatestCommit: "Đang lấy commit hash mới nhất...",
	},

	// General messages - Thông báo chung
	general: {
		loading: "Đang tải...",
		saving: "Đang lưu...",
		success: "Thành công",
		failed: "Thất bại",
		cancelled: "Đã hủy",
		confirm: "Xác nhận",
		cancel: "Hủy",
		yes: "Có",
		no: "Không",
		ok: "OK",
		done: "Hoàn thành",
		retry: "Thử lại",
		delete: "Xóa",
		yesReconstruct: "Có, Xây dựng lại",
	},

	// Commands - Lệnh
	commands: {
		addToChat: "Thêm vào Chat",
		fixWithCline: "Sửa với Cline",
		explainCode: "Giải thích Code",
		improveCode: "Cải thiện Code",
		focusChatInput: "Focus vào Chat",
		openWalkthrough: "Mở Hướng dẫn",
		reconstructTaskHistory: "Khôi phục Lịch sử Task",
		generateCommit: "Tạo Commit Message",
		abortCommit: "Hủy Tạo Commit",
		terminalOutput: "Lấy Output Terminal",
		noActiveTerminal: "Không tìm thấy terminal đang hoạt động",
		noTextSelected: "Chưa chọn text nào",
		noFileOpen: "Chưa mở file nào",
	},

	// Task messages - Thông báo Task
	tasks: {
		started: "Task đã bắt đầu",
		completed: "Task hoàn thành thành công",
		failed: "Task thất bại: {error}",
		aborted: "Task đã bị hủy",
		inProgress: "Task đang thực hiện...",
	},

	// Commit messages - Thông báo Commit
	commits: {
		generated: "Đã tạo commit message",
		generationFailed: "Không thể tạo commit message: {error}",
		aborted: "Đã hủy tạo commit",
		noChanges: "Không có thay đổi để commit",
	},

	// Extension lifecycle - Vòng đời Extension
	extension: {
		activated: "Extension Cline đã kích hoạt",
		deactivated: "Extension Cline đã tắt",
		ready: "Cline đã sẵn sàng",
	},

	// Settings messages - Thông báo Cài đặt
	settings: {
		saved: "Đã lưu cài đặt thành công",
		saveFailed: "Không thể lưu cài đặt: {error}",
		reset: "Đã đặt lại cài đặt về mặc định",
		resetFailed: "Không thể đặt lại cài đặt: {error}",
	},

	// History messages - Thông báo Lịch sử
	history: {
		cleared: "Đã xóa lịch sử",
		clearFailed: "Không thể xóa lịch sử: {error}",
		exported: "Đã xuất lịch sử thành công",
		exportFailed: "Không thể xuất lịch sử: {error}",
		imported: "Đã nhập lịch sử thành công",
		importFailed: "Không thể nhập lịch sử: {error}",
	},

	// Connection messages - Thông báo Kết nối
	connection: {
		established: "Đã kết nối",
		lost: "Mất kết nối",
		reconnecting: "Đang kết nối lại...",
		reconnected: "Đã kết nối lại thành công",
		failed: "Kết nối thất bại: {error}",
	},

	// Authentication messages - Thông báo Xác thực
	auth: {
		required: "Yêu cầu xác thực",
		success: "Xác thực thành công",
		failed: "Xác thực thất bại: {error}",
		expired: "Xác thực đã hết hạn",
		logout: "Đã đăng xuất thành công",
		logoutSuccess: "Đã đăng xuất khỏi Cline thành công",
		logoutFailed: "Đăng xuất thất bại",
		loginFailed: "Đăng nhập vào Cline thất bại",
		ocaLogoutSuccess: "Đã đăng xuất khỏi OCA thành công",
		ocaLogoutFailed: "Đăng xuất OCA thất bại",
		ocaLoginFailed: "Đăng nhập vào OCA thất bại",
		mcpAuthSuccess: "Đã xác thực MCP server thành công",
		mcpAuthFailed: "Xác thực MCP server thất bại",
	},

	// Update messages - Thông báo Cập nhật
	updates: {
		available: "Có bản cập nhật mới: v{version}",
		installed: "Đã cài đặt bản cập nhật thành công",
		failed: "Cập nhật thất bại: {error}",
		checking: "Đang kiểm tra cập nhật...",
	},

	// Prompts - Câu hỏi
	prompts: {
		confirmDelete: "Bạn có chắc chắn muốn xóa?",
		confirmClear: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử?",
		confirmReset: "Bạn có chắc chắn muốn đặt lại cài đặt?",
		confirmAbort: "Bạn có chắc chắn muốn hủy?",
		enterValue: "Nhập giá trị",
		selectOption: "Chọn một tùy chọn",
		selectFile: "Chọn một file",
		selectFolder: "Chọn một thư mục",
		enterApiKey: "Nhập API key của bạn",
		enterModelName: "Nhập tên model",
		enterMessage: "Nhập tin nhắn của bạn",
	},

	// Commit Message Generation - Tạo Commit Message
	commit: {
		generating: "Đang tạo commit message cho {{repo}}...",
		generationFailed: "Không thể tạo commit message: {{error}}",
		noChanges: "Không có thay đổi trong repository {{repo}} để tạo commit message",
		noChangesInWorkspace: "Không tìm thấy thay đổi nào trong các repository của workspace",
		gitNotFound: "Không tìm thấy Git extension",
		noRepositories: "Không có Git repository nào",
		repositoryNotFound: "Không tìm thấy repository cho SCM được cung cấp",
		selectRepository: "Chọn repository để tạo commit message",
		generateForAll: "Tạo cho tất cả repositories có thay đổi",
		generateForAllDescription: "Tạo commit messages cho {{count}} repositories",
		emptyResponse: "API trả về rỗng",
	},

	// Workspace messages - Thông báo Workspace
	workspace: {
		initFailed: "Không thể khởi tạo workspace. Sử dụng chế độ single folder.",
	},

	// Checkpoint messages - Thông báo Checkpoint
	checkpoint: {
		initFailed: "Không thể khởi tạo checkpoint manager: {{error}}",
		initTimeout: "Khởi tạo checkpoint bị timeout: {{error}}",
	},

	// Mentions messages - Thông báo Mentions
	mentions: {
		urlFetchError: "Lỗi khi tải nội dung từ {{url}}: {{error}}",
	},

	// Terminal messages - Thông báo Terminal
	terminal: {
		getContentsFailed: "Không thể lấy nội dung terminal",
	},

	// Webview messages - Thông báo Webview
	webview: {
		devServerNotRunning:
			"Cline: Webview dev server chưa chạy, HMR sẽ không hoạt động. Vui lòng chạy 'npm run dev:webview' trước khi khởi động extension để bật HMR. Đang sử dụng bundled assets.",
	},

	// Task History messages - Thông báo Lịch sử Task
	taskHistory: {
		reconstructConfirm:
			"Thao tác này sẽ xây dựng lại lịch sử task từ dữ liệu task hiện có. Hệ thống sẽ sao lưu lịch sử hiện tại và cố gắng khôi phục từ các thư mục task. Tiếp tục?",
		reconstructing: "Đang xây dựng lại lịch sử task...",
		reconstructSuccess: "Đã xây dựng lại lịch sử task thành công! Tìm thấy và khôi phục {{count}} tasks.",
		reconstructWarning:
			"Xây dựng lại hoàn tất với cảnh báo:\n- Đã khôi phục: {{reconstructed}} tasks\n- Đã bỏ qua: {{skipped}} tasks\n- Lỗi: {{errorCount}}\n\nMột số lỗi đầu tiên:\n{{errors}}",
		reconstructFailed: "Không thể xây dựng lại lịch sử task: {{error}}",
	},

	// MCP messages - Thông báo MCP
	mcp: {
		restarting: "Đang khởi động lại {{server}} MCP server...",
		connected: "{{server}} MCP server đã kết nối",
		connectFailed: "Không thể kết nối đến {{server}} MCP server",
		notification: "MCP {{name}}: {{method}} - {{params}}",
		invalidSettingsFormat: "Định dạng cài đặt MCP không hợp lệ. Vui lòng đảm bảo cài đặt của bạn tuân theo định dạng JSON đúng.",
		invalidSettingsSchema: "Schema cài đặt MCP không hợp lệ.",
		updateAutoApproveFailed: "Không thể cập nhật cài đặt autoApprove",
		updateStateFailed: "Không thể cập nhật trạng thái server: {{error}}",
		updateTimeoutFailed: "Không thể cập nhật timeout server: {{error}}",
	},
}
