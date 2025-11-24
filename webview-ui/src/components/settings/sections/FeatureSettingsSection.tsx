import { McpDisplayMode } from "@shared/McpDisplayMode"
import { EmptyRequest } from "@shared/proto/index.cline"
import { OpenaiReasoningEffort } from "@shared/storage/types"
import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { memo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import McpDisplayModeDropdown from "@/components/mcp/chat-display/McpDisplayModeDropdown"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PLATFORM_CONFIG, PlatformType } from "@/config/platform.config"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { isMacOSOrLinux } from "@/utils/platformUtils"
import Section from "../Section"
import SubagentOutputLineLimitSlider from "../SubagentOutputLineLimitSlider"
import { updateSetting } from "../utils/settingsHandlers"

interface FeatureSettingsSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const FeatureSettingsSection = ({ renderSectionHeader }: FeatureSettingsSectionProps) => {
	const { t } = useTranslation()
	const {
		enableCheckpointsSetting,
		mcpMarketplaceEnabled,
		mcpDisplayMode,
		mcpResponsesCollapsed,
		openaiReasoningEffort,
		strictPlanModeEnabled,
		yoloModeToggled,
		dictationSettings,
		useAutoCondense,
		focusChainSettings,
		multiRootSetting,
		hooksEnabled,
		remoteConfigSettings,
		subagentsEnabled,
		nativeToolCallSetting,
		taskDocumentationEnabled,
		taskProgressTrackingEnabled,
		tokenSavingEnabled,
		compressionLevel,
	} = useExtensionState()

	const [isClineCliInstalled, setIsClineCliInstalled] = useState(false)

	// Debug: Log token saving state
	useEffect(() => {
		console.log("=== TOKEN SAVING STATE ===")
		console.log("tokenSavingEnabled:", tokenSavingEnabled)
		console.log("compressionLevel:", compressionLevel)
	}, [tokenSavingEnabled, compressionLevel])

	const handleReasoningEffortChange = (newValue: OpenaiReasoningEffort) => {
		updateSetting("openaiReasoningEffort", newValue)
	}

	// Poll for CLI installation status while the component is mounted
	useEffect(() => {
		const checkInstallation = async () => {
			try {
				const result = await StateServiceClient.checkCliInstallation(EmptyRequest.create())
				setIsClineCliInstalled(result.value)
			} catch (error) {
				console.error("Failed to check CLI installation:", error)
			}
		}

		checkInstallation()

		// Poll ever 1.5 seconds to see if CLI is installed (only when form is open)
		const pollInterval = setInterval(checkInstallation, 1500)

		return () => {
			clearInterval(pollInterval)
		}
	}, [])

	return (
		<div>
			{renderSectionHeader("features")}
			<Section>
				<div style={{ marginBottom: 20 }}>
					{/* Subagents - Only show on macOS and Linux */}
					{isMacOSOrLinux() && PLATFORM_CONFIG.type === PlatformType.VSCODE && (
						<div
							className="relative p-3 mb-3 rounded-md"
							id="subagents-section"
							style={{
								border: "1px solid var(--vscode-widget-border)",
								backgroundColor: "var(--vscode-list-hoverBackground)",
							}}>
							<div
								className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-xs font-semibold"
								style={{
									backgroundColor: "var(--vscode-button-secondaryBackground)",
									color: "var(--vscode-button-secondaryForeground)",
								}}>
								NEW
							</div>

							<div
								className="mt-1.5 mb-2 px-2 pt-0.5 pb-1.5 rounded"
								style={{
									backgroundColor: "color-mix(in srgb, var(--vscode-sideBar-background) 99%, black)",
								}}>
								<p
									className="text-xs mb-2 flex items-start"
									style={{ color: "var(--vscode-inputValidation-warningForeground)" }}>
									<span
										className="codicon codicon-warning mr-1"
										style={{ fontSize: "12px", marginTop: "1px", flexShrink: 0 }}></span>
									<span>
										{t("settings.features.cliRequired")}
										<code
											className="ml-1 px-1 rounded"
											style={{
												backgroundColor: "var(--vscode-editor-background)",
												color: "var(--vscode-foreground)",
												opacity: 0.9,
											}}>
											{t("settings.features.cliInstallCommand")}
										</code>
										, then run
										<code
											className="ml-1 px-1 rounded"
											style={{
												backgroundColor: "var(--vscode-editor-background)",
												color: "var(--vscode-foreground)",
												opacity: 0.9,
											}}>
											{t("settings.features.cliAuthCommand")}
										</code>
										{t("settings.features.cliAuthDesc")}
									</span>
								</p>
								{!isClineCliInstalled && (
									<VSCodeButton
										appearance="secondary"
										onClick={async () => {
											try {
												await StateServiceClient.installClineCli(EmptyRequest.create())
											} catch (error) {
												console.error("Failed to initiate CLI installation:", error)
											}
										}}
										style={{
											transform: "scale(0.85)",
											transformOrigin: "left center",
											marginLeft: "-2px",
										}}>
										{t("settings.features.installNow")}
									</VSCodeButton>
								)}
							</div>
							<VSCodeCheckbox
								checked={subagentsEnabled}
								disabled={!isClineCliInstalled}
								onChange={(e: any) => {
									const checked = e.target.checked === true
									updateSetting("subagentsEnabled", checked)
								}}>
								<span className="font-semibold">{t("settings.features.subagents")}</span>
							</VSCodeCheckbox>
							<p className="text-xs mt-1 mb-0">
								<span className="text-description">{t("settings.features.subagentsDesc")}</span>
							</p>
							{subagentsEnabled && (
								<div className="mt-3">
									<SubagentOutputLineLimitSlider />
								</div>
							)}
						</div>
					)}

					<div>
						<VSCodeCheckbox
							checked={enableCheckpointsSetting}
							onChange={(e: any) => {
								const checked = e.target.checked === true
								updateSetting("enableCheckpointsSetting", checked)
							}}>
							{t("settings.features.checkpoints")}
						</VSCodeCheckbox>
						<p className="text-xs text-(--vscode-descriptionForeground)">{t("settings.features.checkpointsDesc")}</p>
					</div>
					<div style={{ marginTop: 10 }}>
						<Tooltip>
							<TooltipTrigger>
								<div className="flex items-center gap-2">
									<VSCodeCheckbox
										checked={mcpMarketplaceEnabled}
										disabled={remoteConfigSettings?.mcpMarketplaceEnabled !== undefined}
										onChange={(e: any) => {
											const checked = e.target.checked === true
											updateSetting("mcpMarketplaceEnabled", checked)
										}}>
										{t("settings.features.mcpMarketplace")}
									</VSCodeCheckbox>
									{remoteConfigSettings?.mcpMarketplaceEnabled !== undefined && (
										<i className="codicon codicon-lock text-description text-sm" />
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent hidden={remoteConfigSettings?.mcpMarketplaceEnabled === undefined}>
								This setting is managed by your organization's remote configuration
							</TooltipContent>
						</Tooltip>

						<p className="text-xs text-description">{t("settings.features.mcpMarketplaceDesc")}</p>
					</div>
					<div style={{ marginTop: 10 }}>
						<label
							className="block text-sm font-medium text-(--vscode-foreground) mb-1"
							htmlFor="mcp-display-mode-dropdown">
							{t("settings.features.mcpDisplayMode")}
						</label>
						<McpDisplayModeDropdown
							className="w-full"
							id="mcp-display-mode-dropdown"
							onChange={(newMode: McpDisplayMode) => updateSetting("mcpDisplayMode", newMode)}
							value={mcpDisplayMode}
						/>
						<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
							{t("settings.features.mcpDisplayModeDesc")}
						</p>
					</div>
					<div style={{ marginTop: 10 }}>
						<VSCodeCheckbox
							checked={mcpResponsesCollapsed}
							onChange={(e: any) => {
								const checked = e.target.checked === true
								updateSetting("mcpResponsesCollapsed", checked)
							}}>
							{t("settings.features.mcpResponsesCollapsed")}
						</VSCodeCheckbox>
						<p className="text-xs text-(--vscode-descriptionForeground)">
							{t("settings.features.mcpResponsesCollapsedDesc")}
						</p>
					</div>
					<div style={{ marginTop: 10 }}>
						<label
							className="block text-sm font-medium text-(--vscode-foreground) mb-1"
							htmlFor="openai-reasoning-effort-dropdown">
							{t("settings.features.reasoningEffort")}
						</label>
						<VSCodeDropdown
							className="w-full"
							currentValue={openaiReasoningEffort || "medium"}
							id="openai-reasoning-effort-dropdown"
							onChange={(e: any) => {
								const newValue = e.target.currentValue as OpenaiReasoningEffort
								handleReasoningEffortChange(newValue)
							}}>
							<VSCodeOption value="minimal">{t("settings.features.reasoningEffortMinimal")}</VSCodeOption>
							<VSCodeOption value="low">{t("settings.features.reasoningEffortLow")}</VSCodeOption>
							<VSCodeOption value="medium">{t("settings.features.reasoningEffortMedium")}</VSCodeOption>
							<VSCodeOption value="high">{t("settings.features.reasoningEffortHigh")}</VSCodeOption>
						</VSCodeDropdown>
						<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
							{t("settings.features.reasoningEffortDesc")}
						</p>
					</div>
					<div style={{ marginTop: 10 }}>
						<VSCodeCheckbox
							checked={strictPlanModeEnabled}
							onChange={(e: any) => {
								const checked = e.target.checked === true
								updateSetting("strictPlanModeEnabled", checked)
							}}>
							{t("settings.features.strictPlanMode")}
						</VSCodeCheckbox>
						<p className="text-xs text-(--vscode-descriptionForeground)">
							{t("settings.features.strictPlanModeDesc")}
						</p>
					</div>
					{
						<div style={{ marginTop: 10 }}>
							<VSCodeCheckbox
								checked={focusChainSettings?.enabled || false}
								onChange={(e: any) => {
									const checked = e.target.checked === true
									updateSetting("focusChainSettings", { ...focusChainSettings, enabled: checked })
								}}>
								{t("settings.features.focusChain")}
							</VSCodeCheckbox>
							<p className="text-xs text-(--vscode-descriptionForeground)">
								{t("settings.features.focusChainDesc")}
							</p>
						</div>
					}
					{focusChainSettings?.enabled && (
						<div style={{ marginTop: 10, marginLeft: 20 }}>
							<label
								className="block text-sm font-medium text-(--vscode-foreground) mb-1"
								htmlFor="focus-chain-remind-interval">
								{t("settings.features.focusChainInterval")}
							</label>
							<VSCodeTextField
								className="w-20"
								id="focus-chain-remind-interval"
								onChange={(e: any) => {
									const value = parseInt(e.target.value, 10)
									if (!Number.isNaN(value) && value >= 1 && value <= 100) {
										updateSetting("focusChainSettings", {
											...focusChainSettings,
											remindClineInterval: value,
										})
									}
								}}
								value={String(focusChainSettings?.remindClineInterval || 6)}
							/>
							<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
								{t("settings.features.focusChainIntervalDesc")}
							</p>
						</div>
					)}
					{dictationSettings?.featureEnabled && (
						<div className="mt-2.5">
							<VSCodeCheckbox
								checked={dictationSettings?.dictationEnabled}
								onChange={(e: any) => {
									const checked = e.target.checked === true
									const updatedDictationSettings = {
										...dictationSettings,
										dictationEnabled: checked,
									}
									updateSetting("dictationSettings", updatedDictationSettings)
								}}>
								Enable Dictation
							</VSCodeCheckbox>
							<p className="text-xs text-description mt-1">
								Enables speech-to-text transcription using your Cline account. Uses the Aqua Voice's Avalon model,
								at $0.0065 credits per minute of audio processed. 5 minutes max per message.
							</p>
						</div>
					)}
					<div style={{ marginTop: 10 }}>
						<VSCodeCheckbox
							checked={useAutoCondense}
							onChange={(e: any) => {
								const checked = e.target.checked === true
								updateSetting("useAutoCondense", checked)
							}}>
							{t("settings.features.autoCompact")}
						</VSCodeCheckbox>
						<p className="text-xs text-(--vscode-descriptionForeground)">
							{t("settings.features.autoCompactDesc")}{" "}
							<a
								className="text-(--vscode-textLink-foreground) hover:text-(--vscode-textLink-activeForeground)"
								href="https://docs.cline.bot/features/auto-compact"
								rel="noopener noreferrer"
								target="_blank">
								{t("settings.features.autoCompactLearnMore")}
							</a>
						</p>
					</div>
					{multiRootSetting.featureFlag && (
						<div className="mt-2.5">
							<VSCodeCheckbox
								checked={multiRootSetting.user}
								onChange={(e: any) => {
									const checked = e.target.checked === true
									updateSetting("multiRootEnabled", checked)
								}}>
								{t("settings.features.multiRoot")}
							</VSCodeCheckbox>
							<p className="text-xs">
								<span className="text-description">{t("settings.features.multiRootDesc")}</span>
							</p>
						</div>
					)}
					<div className="mt-2.5">
						<VSCodeCheckbox
							checked={hooksEnabled?.user}
							disabled={!isMacOSOrLinux()}
							onChange={(e: any) => {
								const checked = e.target.checked === true
								updateSetting("hooksEnabled", checked)
							}}>
							{t("settings.features.hooks")}
						</VSCodeCheckbox>
						<p className="text-xs">
							<span className="text-description">{t("settings.features.hooksDesc")}</span>
						</p>
					</div>
					{nativeToolCallSetting?.featureFlag && (
						<div className="mt-2.5">
							<VSCodeCheckbox
								checked={nativeToolCallSetting?.user}
								onChange={(e) => {
									const enabled = (e?.target as HTMLInputElement).checked
									updateSetting("nativeToolCallEnabled", enabled)
								}}>
								{t("settings.features.nativeToolCall")}
							</VSCodeCheckbox>
							<p className="text-xs">
								<span className="text-description">{t("settings.features.nativeToolCallDesc")}</span>
							</p>
						</div>
					)}
					<div style={{ marginTop: 10 }}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-2">
									<VSCodeCheckbox
										checked={yoloModeToggled}
										disabled={remoteConfigSettings?.yoloModeToggled !== undefined}
										onChange={(e: any) => {
											const checked = e.target.checked === true
											updateSetting("yoloModeToggled", checked)
										}}>
										{t("settings.features.yoloMode")}
									</VSCodeCheckbox>
									{remoteConfigSettings?.yoloModeToggled !== undefined && (
										<i className="codicon codicon-lock text-description text-sm" />
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent
								className="max-w-xs"
								hidden={remoteConfigSettings?.yoloModeToggled === undefined}
								side="top">
								This setting is managed by your organization's remote configuration
							</TooltipContent>
						</Tooltip>

						<p className="text-xs text-(--vscode-errorForeground)">{t("settings.features.yoloModeDesc")}</p>
					</div>

					{/* Token Saving */}
					<div style={{ marginTop: 20 }}>
						<div
							style={{
								padding: 12,
								border: "1px solid var(--vscode-charts-green)",
								borderRadius: 6,
								backgroundColor: "var(--vscode-editor-background)",
							}}>
							<div className="flex items-center gap-2 mb-2">
								<VSCodeCheckbox
									checked={tokenSavingEnabled ?? false}
									onChange={(e: any) => {
										const checked = e.target.checked === true
										updateSetting("tokenSavingEnabled", checked)
									}}>
									<span style={{ fontWeight: 600 }}>{t("settings.features.tokenSaving")}</span>
								</VSCodeCheckbox>
								<div
									className="px-2 py-0.5 rounded text-xs font-semibold"
									style={{
										backgroundColor: "var(--vscode-charts-green)",
										color: "var(--vscode-editor-background)",
									}}>
									SAVE $$
								</div>
							</div>
							<p className="text-xs" style={{ color: "var(--vscode-descriptionForeground)", marginBottom: 10 }}>
								{t("settings.features.tokenSavingDesc")}
							</p>

							{/* Compression Level */}
							{tokenSavingEnabled && (
								<div style={{ marginTop: 10, marginLeft: 20 }}>
									<label style={{ fontSize: "12px", fontWeight: 500, display: "block", marginBottom: 5 }}>
										{t("settings.features.tokenSavingLevel")}
									</label>
									<VSCodeDropdown
										onChange={(e: any) => {
											updateSetting("compressionLevel", e.target.value)
										}}
										style={{ width: "100%" }}
										value={compressionLevel ?? "medium"}>
										<VSCodeOption value="none">{t("settings.features.tokenSavingLevelNone")}</VSCodeOption>
										<VSCodeOption value="light">{t("settings.features.tokenSavingLevelLow")}</VSCodeOption>
										<VSCodeOption value="medium">
											{t("settings.features.tokenSavingLevelMedium")}
										</VSCodeOption>
										<VSCodeOption value="aggressive">
											{t("settings.features.tokenSavingLevelAggressive")}
										</VSCodeOption>
									</VSCodeDropdown>
									<p className="text-xs" style={{ color: "var(--vscode-descriptionForeground)", marginTop: 5 }}>
										{t("settings.features.tokenSavingLevelDesc")}
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Task Documentation & Tracking */}
					<div style={{ marginTop: 20 }}>
						<div
							style={{
								padding: 12,
								border: "1px solid var(--vscode-button-background)",
								borderRadius: 6,
								backgroundColor: "var(--vscode-editor-background)",
							}}>
							<div className="flex items-center gap-2 mb-2">
								<VSCodeCheckbox
									checked={taskDocumentationEnabled ?? false}
									onChange={(e: any) => {
										const checked = e.target.checked === true
										console.log("=== TASK DOCUMENTATION CHECKBOX ===")
										console.log("Current value:", taskDocumentationEnabled)
										console.log("New value:", checked)
										console.log("Calling updateSetting...")
										updateSetting("taskDocumentationEnabled", checked)
										console.log("updateSetting called")
									}}>
									<span style={{ fontWeight: 600 }}>{t("settings.features.taskDocumentation")}</span>
								</VSCodeCheckbox>
								<div
									className="px-2 py-0.5 rounded text-xs font-semibold"
									style={{
										backgroundColor: "var(--vscode-statusBarItem-prominentBackground)",
										color: "var(--vscode-statusBarItem-prominentForeground)",
									}}>
									POWERFUL
								</div>
							</div>
							<p className="text-xs" style={{ color: "var(--vscode-descriptionForeground)", marginBottom: 10 }}>
								{t("settings.features.taskDocumentationDesc")}
							</p>

							{/* Auto-generate Files Section */}
							<div
								style={{
									marginTop: 10,
									padding: 10,
									backgroundColor: "var(--vscode-sideBar-background)",
									borderRadius: 4,
									border: "1px solid var(--vscode-panel-border)",
								}}>
								<div
									style={{
										fontSize: "12px",
										fontWeight: 500,
										marginBottom: 8,
										color: "var(--vscode-foreground)",
									}}>
									<span className="codicon codicon-file-code mr-1"></span>
									{t("settings.features.autoGenerateFiles")}:
								</div>

								{/* Task Files List */}
								<div style={{ fontSize: "11px", color: "var(--vscode-descriptionForeground)" }}>
									<div style={{ marginBottom: 6, display: "flex", alignItems: "start" }}>
										<span className="codicon codicon-history mr-2" style={{ marginTop: 2 }}></span>
										<div>
											<div style={{ fontWeight: 500, color: "var(--vscode-foreground)" }}>
												{t("settings.features.taskHistoryFile")}
											</div>
											<div style={{ fontSize: "10px", marginTop: 2 }}>
												{t("settings.features.taskHistoryFileDesc")}
											</div>
										</div>
									</div>

									<div style={{ marginBottom: 6, display: "flex", alignItems: "start" }}>
										<span className="codicon codicon-list-tree mr-2" style={{ marginTop: 2 }}></span>
										<div>
											<div style={{ fontWeight: 500, color: "var(--vscode-foreground)" }}>
												{t("settings.features.taskPlanFile")}
											</div>
											<div style={{ fontSize: "10px", marginTop: 2 }}>
												{t("settings.features.taskPlanFileDesc")}
											</div>
										</div>
									</div>

									<div style={{ display: "flex", alignItems: "start" }}>
										<span className="codicon codicon-bug mr-2" style={{ marginTop: 2 }}></span>
										<div>
											<div style={{ fontWeight: 500, color: "var(--vscode-foreground)" }}>
												{t("settings.features.debugInfoFile")}
											</div>
											<div style={{ fontSize: "10px", marginTop: 2 }}>
												{t("settings.features.debugInfoFileDesc")}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Progress Tracking */}
							<div style={{ marginTop: 10 }}>
								<VSCodeCheckbox
									checked={taskProgressTrackingEnabled ?? true}
									onChange={(e: any) => {
										const checked = e.target.checked === true
										updateSetting("taskProgressTrackingEnabled", checked)
									}}>
									<span style={{ fontSize: "12px", fontWeight: 500 }}>
										{t("settings.features.progressTracking")}
									</span>
								</VSCodeCheckbox>
								<p
									className="text-xs"
									style={{ color: "var(--vscode-descriptionForeground)", marginTop: 3, marginLeft: 20 }}>
									{t("settings.features.progressTrackingDesc")}
								</p>
							</div>

							{/* File Location Info */}
							<div
								style={{
									marginTop: 10,
									padding: 8,
									backgroundColor:
										"color-mix(in srgb, var(--vscode-inputValidation-infoBackground) 30%, transparent)",
									borderRadius: 4,
									border: "1px solid var(--vscode-inputValidation-infoBorder)",
								}}>
								<div
									style={{
										fontSize: "11px",
										color: "var(--vscode-foreground)",
										display: "flex",
										alignItems: "center",
										gap: 6,
									}}>
									<span className="codicon codicon-folder"></span>
									<span style={{ fontWeight: 500 }}>{t("settings.features.taskFileLocation")}</span>
								</div>
								<div
									style={{
										fontSize: "10px",
										color: "var(--vscode-descriptionForeground)",
										marginTop: 4,
										fontFamily: "var(--vscode-editor-font-family)",
									}}>
									{t("settings.features.taskFileLocationDesc")}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Section>
		</div>
	)
}

export default memo(FeatureSettingsSection)
