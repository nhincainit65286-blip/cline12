# Task Documentation & Tracking

## Overview

The Task Documentation & Tracking feature automatically generates comprehensive documentation for every task executed by Kiro. This helps both AI and users track progress, understand decisions, and debug issues effectively.

## Features

### 1. Automatic Documentation Generation

When enabled, Kiro automatically creates three types of documentation files for each task:

#### Task History File (`.task-history.md`)
- Complete timeline of all actions, decisions, and changes
- Timestamped events with detailed context
- Easy to review what happened during task execution

#### Task Plan File (`.task-plan.md`)
- Structured plan with base task description
- List of subtasks with completion status
- Progress percentage tracking

#### Debug Info File (`.task-debug.md`)
- Technical details about errors encountered
- Solutions applied and their success status
- Stack traces and error context for debugging

### 2. Real-time Progress Tracking

- Live updates on task completion percentage
- Subtask progress monitoring
- Visual progress indicators in the UI

### 3. File Organization

All documentation files are stored in:
```
.cline/tasks/{task-id}/
├── .task-history.md
├── .task-plan.md
├── .task-debug.md
└── .task-progress.json
```

## Configuration

### Enable Task Documentation

1. Open Kiro Settings (Cmd/Ctrl + ,)
2. Navigate to "Feature Settings" tab
3. Find "Task Documentation & Tracking" section
4. Check "Enable Task Documentation & Tracking"

### Enable Progress Tracking

1. In the same section, check "Real-time Progress Tracking"
2. This enables live progress updates during task execution

## Usage

### Viewing Task Documentation

After a task completes, you can find the documentation files in:
```
.cline/tasks/{task-id}/
```

Open these files in VS Code to review:
- What actions were taken
- What decisions were made
- What errors occurred and how they were resolved
- Overall progress and completion status

### Understanding Task History

The task history file shows a chronological timeline:

```markdown
### ⚡ Task started
**Time:** 2025-11-22T05:00:00.000Z
**Type:** action

### 📝 AI response
**Time:** 2025-11-22T05:00:15.000Z
**Type:** change

### ⚡ Tool executed: write_to_file
**Time:** 2025-11-22T05:00:30.000Z
**Type:** action
```

### Understanding Task Plan

The task plan shows structured progress:

```markdown
## Base Task
Create a new React component

## Subtasks
**Progress:** 3/5 (60%)

✅ **Create component file** (100%)
✅ **Add TypeScript types** (100%)
✅ **Implement component logic** (100%)
⬜ **Add unit tests** (50%)
⬜ **Update documentation** (0%)
```

### Understanding Debug Info

The debug info helps troubleshoot issues:

```markdown
## Errors Encountered

### Error 1
**Time:** 2025-11-22T05:00:45.000Z
**Error:** Type error in component props
**Context:** Component implementation

## Solutions Applied

### Solution 1 - ✅ Success
**Time:** 2025-11-22T05:01:00.000Z
**Problem:** Type error in component props
**Solution:** Added optional chaining and default values
```

## Benefits

### For Users
- **Transparency**: See exactly what Kiro did during task execution
- **Debugging**: Quickly identify and understand errors
- **Learning**: Understand AI's decision-making process
- **Accountability**: Complete audit trail of all actions

### For AI
- **Context**: Better understanding of task history for future decisions
- **Learning**: Analyze past mistakes and solutions
- **Consistency**: Maintain context across task resumptions
- **Debugging**: Self-diagnose issues with complete history

## Best Practices

### 1. Review Documentation After Complex Tasks
After completing complex tasks, review the documentation to:
- Verify all intended actions were taken
- Understand any errors that occurred
- Learn from the AI's approach

### 2. Use Debug Info for Troubleshooting
When tasks fail or produce unexpected results:
- Check `.task-debug.md` for error details
- Review solutions that were attempted
- Use stack traces to identify root causes

### 3. Track Progress on Long-Running Tasks
For tasks that take a long time:
- Monitor `.task-progress.json` for real-time updates
- Check `.task-plan.md` to see remaining subtasks
- Use progress percentage to estimate completion time

### 4. Archive Important Task Documentation
For critical tasks:
- Copy documentation files to a permanent location
- Include them in project documentation
- Reference them in code reviews or retrospectives

## Technical Details

### File Format
- All documentation files use Markdown format
- Progress data stored in JSON for easy parsing
- Files are human-readable and version-control friendly

### Performance Impact
- Minimal overhead (<100ms per task action)
- Documentation generated asynchronously
- No blocking operations during task execution

### Storage
- Files stored in workspace-local `.cline` directory
- Automatically cleaned up with old tasks
- Typical size: 10-50KB per task

## Troubleshooting

### Documentation Files Not Generated

**Problem**: Task completes but no documentation files created

**Solutions**:
1. Verify "Task Documentation & Tracking" is enabled in settings
2. Check file permissions in workspace directory
3. Look for errors in Kiro output panel
4. Ensure `.cline/tasks/` directory exists

### Progress Not Updating

**Problem**: Progress indicator shows 0% or doesn't update

**Solutions**:
1. Verify "Real-time Progress Tracking" is enabled
2. Refresh the UI (reload window)
3. Check `.task-progress.json` file exists
4. Ensure task is actually running (not paused)

### Files Too Large

**Problem**: Documentation files become very large (>1MB)

**Solutions**:
1. This is normal for very long-running tasks
2. Files are text-based and compress well
3. Consider breaking large tasks into smaller subtasks
4. Old task files are automatically cleaned up

## API Reference

### TaskDocumentationManager

Core class for managing task documentation:

```typescript
class TaskDocumentationManager {
  constructor(taskId: string, workspaceRoot: string)
  
  async initialize(): Promise<void>
  logAction(type: EventType, description: string, details?: string): void
  logError(error: string, stackTrace?: string, context?: string): void
  logSolution(problem: string, solution: string, success: boolean): void
  
  async generateHistoryFile(): Promise<void>
  async generatePlanFile(baseTask: string, subtasks: Subtask[]): Promise<void>
  async generateDebugFile(): Promise<void>
  async updateProgress(completed: number, total: number): Promise<void>
}
```

### TaskDocumentationIntegration

Integration layer for task lifecycle:

```typescript
class TaskDocumentationIntegration {
  constructor(taskId: string, workspaceRoot: string)
  
  async enable(progressTracking: boolean): Promise<void>
  disable(): void
  isEnabled(): boolean
  
  async onTaskStart(baseTask: string): Promise<void>
  async onMessageAdded(message: ClineMessage): Promise<void>
  async onToolExecution(toolName: string, details: string): Promise<void>
  async onError(error: string, stackTrace?: string, context?: string): Promise<void>
  async onErrorRecovery(problem: string, solution: string, success: boolean): Promise<void>
  async onTaskComplete(baseTask: string, success: boolean): Promise<void>
  
  async updateSubtaskProgress(completed: number, total: number): Promise<void>
  getDocumentationPath(): string
}
```

## Future Enhancements

Planned improvements for future versions:

1. **Export to Multiple Formats**
   - PDF export for sharing
   - HTML export for web viewing
   - JSON export for programmatic access

2. **Advanced Analytics**
   - Task duration analysis
   - Error pattern detection
   - Success rate tracking
   - Performance metrics

3. **Search and Filter**
   - Search across all task documentation
   - Filter by date, status, or error type
   - Quick navigation to specific events

4. **Visualization**
   - Timeline visualization
   - Dependency graphs
   - Progress charts
   - Error heatmaps

5. **Integration**
   - Export to project management tools
   - Integration with CI/CD pipelines
   - Slack/Teams notifications
   - Email summaries

## Feedback

We'd love to hear your feedback on this feature:
- What documentation is most useful?
- What additional information would you like to see?
- How can we improve the format or organization?

Please share your thoughts in our [GitHub Discussions](https://github.com/cline/cline/discussions).
