import { ActionMetadata } from "./types"
import i18n from "@/i18n/config"

const t = (key: string) => i18n.t(key)

export const ACTION_METADATA: ActionMetadata[] = [
	{
		id: "readFiles",
		label: t("settings.readProjectFiles"),
		shortName: t("common.read"),
		description: t("autoApprove.readProjectFilesDesc"),
		icon: "codicon-search",
		subAction: {
			id: "readFilesExternally",
			label: t("settings.readAllFiles"),
			shortName: t("autoApprove.readAll"),
			description: t("autoApprove.readAllFilesDesc"),
			icon: "codicon-folder-opened",
			parentActionId: "readFiles",
		},
	},
	{
		id: "editFiles",
		label: t("settings.editProjectFiles"),
		shortName: t("common.edit"),
		description: t("autoApprove.editProjectFilesDesc"),
		icon: "codicon-edit",
		subAction: {
			id: "editFilesExternally",
			label: t("settings.editAllFiles"),
			shortName: t("autoApprove.editAll"),
			description: t("autoApprove.editAllFilesDesc"),
			icon: "codicon-files",
			parentActionId: "editFiles",
		},
	},
	{
		id: "executeSafeCommands",
		label: t("settings.executeSafeCommands"),
		shortName: t("autoApprove.safeCommands"),
		description: t("autoApprove.executeSafeCommandsDesc"),
		icon: "codicon-terminal",
		subAction: {
			id: "executeAllCommands",
			label: t("settings.executeAllCommands"),
			shortName: t("autoApprove.allCommands"),
			description: t("autoApprove.executeAllCommandsDesc"),
			icon: "codicon-terminal-bash",
			parentActionId: "executeSafeCommands",
		},
	},
	{
		id: "useBrowser",
		label: t("settings.useTheBrowser"),
		shortName: t("settings.browser"),
		description: t("autoApprove.useBrowserDesc"),
		icon: "codicon-globe",
	},
	{
		id: "useMcp",
		label: t("settings.useMcpServers"),
		shortName: "MCP",
		description: t("autoApprove.useMcpDesc"),
		icon: "codicon-server",
	},
]

export const NOTIFICATIONS_SETTING: ActionMetadata = {
	id: "enableNotifications",
	label: t("generalSettings.enableNotifications"),
	shortName: t("autoApprove.notifications"),
	description: t("autoApprove.notificationsDesc"),
	icon: "codicon-bell",
}
