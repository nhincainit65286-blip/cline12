import { McpDisplayMode, OpenaiReasoningEffort, UpdateSettingsRequest } from "@shared/proto/cline/state"
import { StateServiceClient } from "@/services/grpc-client"

/**
 * Converts values to their corresponding proto format
 * @param field - The field name
 * @param value - The value to convert
 * @returns The converted value
 * @throws Error if the value is invalid for the field
 */
const convertToProtoValue = (field: keyof UpdateSettingsRequest, value: any): any => {
	if (field === "openaiReasoningEffort" && typeof value === "string") {
		switch (value) {
			case "minimal":
				return OpenaiReasoningEffort.MINIMAL
			case "low":
				return OpenaiReasoningEffort.LOW
			case "medium":
				return OpenaiReasoningEffort.MEDIUM
			case "high":
				return OpenaiReasoningEffort.HIGH
			default:
				throw new Error(`Invalid OpenAI reasoning effort value: ${value}`)
		}
	} else if (field === "mcpDisplayMode" && typeof value === "string") {
		switch (value) {
			case "rich":
				return McpDisplayMode.RICH
			case "plain":
				return McpDisplayMode.PLAIN
			case "markdown":
				return McpDisplayMode.MARKDOWN
			default:
				throw new Error(`Invalid MCP display mode value: ${value}`)
		}
	}
	return value
}

/**
 * Updates a single field in the settings.
 *
 * @param field - The field key to update
 * @param value - The new value for the field
 */
export const updateSetting = (field: keyof UpdateSettingsRequest, value: any) => {
	console.log("=== UPDATE SETTING CALLED ===")
	console.log("field:", field)
	console.log("value:", value)
	
	const updateRequest: Partial<UpdateSettingsRequest> = {}

	const convertedValue = convertToProtoValue(field, value)
	updateRequest[field] = convertedValue
	
	console.log("updateRequest before create:", updateRequest)
	
	const createdRequest = UpdateSettingsRequest.create({})
	// Manually set the field to bypass proto create() bug
	if (field === "tokenSavingEnabled") {
		createdRequest.tokenSavingEnabled = convertedValue
	} else if (field === "compressionLevel") {
		createdRequest.compressionLevel = convertedValue
	} else {
		// For other fields, use the normal way
		createdRequest[field] = convertedValue
	}
	
	console.log("createdRequest after manual set:", createdRequest)
	console.log("createdRequest.tokenSavingEnabled:", createdRequest.tokenSavingEnabled)

	StateServiceClient.updateSettings(createdRequest).catch((error) => {
		console.error(`Failed to update setting ${field}:`, error)
	})
}
