# Kế hoạch Implementation - Advanced Features

## 📋 Tổng quan

Document này mô tả kế hoạch chi tiết để implement 5 nhóm tính năng mới đã có UI:

1. **Token Saving** - Tiết kiệm Token
2. **Smart File Reading & Deep Analysis** - Đọc File Thông minh
3. **AI Discovery Mode** - Chế độ Khám phá AI
4. **Core Enhancements** - Nâng cấp Cốt lõi
5. **Task Documentation & Tracking** - Tài liệu & Theo dõi Task

---

## 🎯 Phase 1: Task Documentation & Tracking (Ưu tiên cao)

**Thời gian ước tính:** 2-3 ngày
**Độ phức tạp:** Trung bình
**Giá trị:** Cao - Giúp theo dõi và debug tasks hiệu quả

### 📋 Base Tasks

#### Base Task 1: Setup State Management & Types
**Mục tiêu:** Tạo types và state management cho task documentation system

**Debug Info:**
- **Common Errors:**
  - Type conflicts với existing ExtensionMessage
  - State not persisting across sessions
  - Race conditions khi update state
- **Solutions:**
  - Use discriminated unions cho message types
  - Implement proper state serialization
  - Add mutex locks cho concurrent updates
- **Testing:**
  - Unit test cho state updates
  - Test state persistence
  - Test concurrent state modifications

**Files to Create/Modify:**
- `src/shared/ExtensionMessage.ts` - Add new message types
- `src/core/controller/state/StateManager.ts` - Add TaskDocumentationConfig
- `src/shared/WebviewMessage.ts` - Add UI state messages

**Acceptance Criteria:**
- ✅ Types compile without errors
- ✅ State persists across extension reload
- ✅ No race conditions in state updates

---

#### Base Task 2: Implement File Generation System
**Mục tiêu:** Tạo system để generate 3 loại files (history, plan, debug)

**Debug Info:**
- **Common Errors:**
  - File write permissions denied
  - Path traversal vulnerabilities
  - Concurrent file writes causing corruption
  - Large files causing memory issues
- **Solutions:**
  - Check permissions before write
  - Sanitize file paths properly
  - Use file locks for concurrent writes
  - Stream large content instead of loading all in memory
- **Testing:**
  - Test file creation in various OS
  - Test with long file paths
  - Test concurrent writes
  - Test with large content (>10MB)

**Files to Create:**
- `src/core/task/documentation/TaskDocumentationManager.ts`
- `src/core/task/documentation/FileGenerator.ts`
- `src/core/task/documentation/templates/history-template.md`
- `src/core/task/documentation/templates/plan-template.md`
- `src/core/task/documentation/templates/debug-template.md`

**Acceptance Criteria:**
- ✅ Files created successfully in .cline/tasks/{task-id}/
- ✅ No file corruption with concurrent writes
- ✅ Handles large content (>10MB) without memory issues
- ✅ Works on Windows, Mac, Linux

---

#### Base Task 3: Integrate with Task Lifecycle
**Mục tiêu:** Hook documentation system vào task lifecycle events

**Debug Info:**
- **Common Errors:**
  - Events not firing in correct order
  - Memory leaks from event listeners
  - Missing events causing incomplete documentation
  - Async timing issues
- **Solutions:**
  - Use event emitter with proper ordering
  - Clean up listeners on task completion
  - Add fallback for missed events
  - Use Promise.all for parallel async operations
- **Testing:**
  - Test all lifecycle events fire
  - Test event order is correct
  - Test memory doesn't leak
  - Test with rapid task creation/deletion

**Files to Modify:**
- `src/core/controller/index.ts` - Add lifecycle hooks
- `src/core/task/index.ts` - Emit documentation events
- `src/core/controller/task/executeTask.ts` - Log task actions

**Acceptance Criteria:**
- ✅ All task events logged correctly
- ✅ No memory leaks after 100+ tasks
- ✅ Documentation complete even if task fails
- ✅ Events fire in correct order

---

#### Base Task 4: Implement Progress Tracking
**Mục tiêu:** Real-time progress tracking và updates

**Debug Info:**
- **Common Errors:**
  - Progress percentage calculation wrong
  - UI not updating in real-time
  - Progress file corruption
  - Race conditions in progress updates
- **Solutions:**
  - Use atomic operations for progress updates
  - Debounce UI updates (max 1 update/100ms)
  - Validate progress data before write
  - Use optimistic UI updates
- **Testing:**
  - Test progress calculation accuracy
  - Test UI updates smoothly
  - Test with rapid progress changes
  - Test progress persists on crash

**Files to Create:**
- `src/core/task/documentation/ProgressTracker.ts`
- `webview-ui/src/components/task/ProgressIndicator.tsx`

**Files to Modify:**
- `src/core/controller/index.ts` - Send progress updates
- `webview-ui/src/components/chat/chat-view/components/layout/TaskSection.tsx` - Display progress

**Acceptance Criteria:**
- ✅ Progress calculation 100% accurate
- ✅ UI updates smoothly without lag
- ✅ Progress persists on extension crash
- ✅ No race conditions in updates

---

#### Base Task 5: Testing & Documentation
**Mục tiêu:** Comprehensive testing và user documentation

**Debug Info:**
- **Common Errors:**
  - Tests flaky due to timing issues
  - Mock data not realistic
  - Integration tests too slow
  - Missing edge case tests
- **Solutions:**
  - Use proper async/await in tests
  - Generate realistic mock data
  - Parallelize integration tests
  - Add property-based testing for edge cases
- **Testing:**
  - Unit tests (>80% coverage)
  - Integration tests
  - E2E tests with real tasks
  - Performance tests

**Files to Create:**
- `src/core/task/documentation/__tests__/TaskDocumentationManager.test.ts`
- `src/core/task/documentation/__tests__/FileGenerator.test.ts`
- `src/core/task/documentation/__tests__/ProgressTracker.test.ts`
- `docs/features/task-documentation.md`

**Acceptance Criteria:**
- ✅ >80% code coverage
- ✅ All tests pass consistently
- ✅ Performance <100ms overhead per task
- ✅ User documentation complete

### 1.1 State Management

**File:** `src/shared/ExtensionMessage.ts`

```typescript
// Thêm vào WebviewMessage type
export interface WebviewMessage {
  // ... existing
  taskDocumentation?: boolean
  taskProgressTracking?: boolean
}
```

**File:** `src/core/controller/state/StateManager.ts`

```typescript
interface TaskDocumentationConfig {
  enabled: boolean
  generateHistory: boolean
  generatePlan: boolean
  generateDebug: boolean
  progressTracking: boolean
  outputPath: string // .cline/tasks/{task-id}/
}
```

### 1.2 File Generation System

**File:** `src/core/task/documentation/TaskDocumentationManager.ts` (NEW)

```typescript
export class TaskDocumentationManager {
  private taskId: string
  private outputDir: string
  
  constructor(taskId: string) {
    this.taskId = taskId
    this.outputDir = `.cline/tasks/${taskId}/`
  }
  
  // Tạo task history file
  async generateHistoryFile(events: TaskEvent[]): Promise<void>
  
  // Tạo task plan file
  async generatePlanFile(baseTask: string, subtasks: Subtask[]): Promise<void>
  
  // Tạo debug info file
  async generateDebugFile(errors: Error[], solutions: Solution[]): Promise<void>
  
  // Cập nhật progress
  async updateProgress(completed: number, total: number): Promise<void>
}
```

### 1.3 Integration Points

**File:** `src/core/controller/index.ts`

```typescript
// Hook vào task lifecycle
private async onTaskStart(task: Task) {
  if (this.state.taskDocumentation?.enabled) {
    this.docManager = new TaskDocumentationManager(task.id)
    await this.docManager.generatePlanFile(task.baseTask, task.subtasks)
  }
}

private async onTaskAction(action: TaskAction) {
  if (this.docManager) {
    await this.docManager.logAction(action)
  }
}

private async onTaskComplete(task: Task) {
  if (this.docManager) {
    await this.docManager.generateHistoryFile(task.events)
    await this.docManager.generateDebugFile(task.errors, task.solutions)
  }
}
```

### 1.4 File Templates

**File:** `src/core/task/documentation/templates/` (NEW)

- `history-template.md` - Template cho task history
- `plan-template.md` - Template cho task plan
- `debug-template.md` - Template cho debug info

### 1.5 Testing

- Unit tests cho TaskDocumentationManager
- Integration tests với task lifecycle
- E2E tests với real tasks

---

## 🎯 Phase 2: Token Saving (Ưu tiên cao)

**Thời gian ước tính:** 3-4 ngày
**Độ phức tạp:** Cao
**Giá trị:** Rất cao - Giảm chi phí API đáng kể

### 📋 Base Tasks

#### Base Task 1: Implement Context Compression
**Mục tiêu:** Nén context để giảm token usage mà không mất thông tin quan trọng

**Debug Info:**
- **Common Errors:**
  - Over-compression làm mất thông tin quan trọng
  - Compression breaks code syntax
  - Slow compression (>500ms)
  - Language-specific issues (Python indentation)
- **Solutions:**
  - Use AST-aware compression
  - Validate syntax after compression
  - Cache compression results
  - Special handling cho indentation-sensitive languages
- **Testing:**
  - Test với 10+ programming languages
  - Test compression ratio (target: 30-50%)
  - Test syntax validity after compression
  - Benchmark compression speed

**Files to Create:**
- `src/core/prompts/ContextCompressor.ts`
- `src/core/prompts/compression/CodeCompressor.ts`
- `src/core/prompts/compression/TextCompressor.ts`
- `src/core/prompts/compression/__tests__/ContextCompressor.test.ts`

**Acceptance Criteria:**
- ✅ 30-50% token reduction
- ✅ No syntax errors after compression
- ✅ <200ms compression time
- ✅ Works with all major languages

---

#### Base Task 2: Implement Token Counting System
**Mục tiêu:** Accurate token counting và cost estimation

**Debug Info:**
- **Common Errors:**
  - Token count mismatch với API actual usage
  - tiktoken not working on some platforms
  - Memory issues với large texts
  - Wrong model encoding used
- **Solutions:**
  - Use official tiktoken library
  - Fallback to approximation if tiktoken fails
  - Stream large texts for counting
  - Map model names to correct encodings
- **Testing:**
  - Compare counts với API actual usage
  - Test với texts >1MB
  - Test all supported models
  - Test on Windows/Mac/Linux

**Files to Create:**
- `src/core/prompts/TokenCounter.ts`
- `src/core/prompts/token/TiktokenWrapper.ts`
- `src/core/prompts/token/CostCalculator.ts`
- `src/core/prompts/token/__tests__/TokenCounter.test.ts`

**Acceptance Criteria:**
- ✅ <5% error vs actual API usage
- ✅ Handles texts >10MB
- ✅ Works on all platforms
- ✅ Accurate cost estimation

---

#### Base Task 3: Implement Smart Context Selection
**Mục tiêu:** Chọn context quan trọng nhất trong token budget

**Debug Info:**
- **Common Errors:**
  - Wrong files selected (not relevant)
  - Important context excluded
  - Selection too slow (>1s)
  - Not considering file dependencies
- **Solutions:**
  - Use TF-IDF for relevance scoring
  - Include dependency chain
  - Cache relevance scores
  - Parallel processing for speed
- **Testing:**
  - Test relevance accuracy (manual review)
  - Test với large codebases (1000+ files)
  - Test selection speed
  - Test dependency inclusion

**Files to Create:**
- `src/core/prompts/ContextSelector.ts`
- `src/core/prompts/selection/RelevanceScorer.ts`
- `src/core/prompts/selection/DependencyResolver.ts`
- `src/core/prompts/selection/__tests__/ContextSelector.test.ts`

**Acceptance Criteria:**
- ✅ >80% relevant files selected
- ✅ All dependencies included
- ✅ <500ms selection time
- ✅ Works with 1000+ file codebases

---

#### Base Task 4: Integrate with API Providers
**Mục tiêu:** Integrate token saving vào all API providers

**Debug Info:**
- **Common Errors:**
  - Breaking existing API calls
  - Different behavior per provider
  - Streaming responses broken
  - Cache invalidation issues
- **Solutions:**
  - Feature flag for gradual rollout
  - Provider-specific adapters
  - Preserve streaming functionality
  - Smart cache invalidation
- **Testing:**
  - Test với Anthropic, OpenAI, Google, etc.
  - Test streaming responses
  - Test cache hit/miss scenarios
  - A/B test quality vs baseline

**Files to Modify:**
- `src/api/providers/anthropic.ts`
- `src/api/providers/openai.ts`
- `src/api/providers/google.ts`
- `src/api/providers/openrouter.ts`
- `src/api/transform/stream.ts`

**Acceptance Criteria:**
- ✅ Works with all providers
- ✅ Streaming still works
- ✅ No quality degradation
- ✅ 30-50% token reduction

---

#### Base Task 5: Monitoring & Optimization
**Mục tiêu:** Monitor token usage và optimize based on data

**Debug Info:**
- **Common Errors:**
  - Metrics not accurate
  - Dashboard not updating
  - Memory leaks from tracking
  - Privacy concerns with logging
- **Solutions:**
  - Use sampling for metrics
  - Aggregate metrics periodically
  - Clean up old metrics data
  - Anonymize sensitive data
- **Testing:**
  - Test metrics accuracy
  - Test dashboard updates
  - Test memory usage over time
  - Test privacy compliance

**Files to Create:**
- `src/core/prompts/TokenUsageTracker.ts`
- `src/core/prompts/metrics/MetricsCollector.ts`
- `webview-ui/src/components/settings/TokenUsageDashboard.tsx`
- `src/core/prompts/__tests__/TokenUsageTracker.test.ts`

**Acceptance Criteria:**
- ✅ Accurate usage metrics
- ✅ Dashboard shows savings
- ✅ No memory leaks
- ✅ Privacy compliant

### 2.1 Context Compression

**File:** `src/core/prompts/ContextCompressor.ts` (NEW)

```typescript
export class ContextCompressor {
  // Nén code bằng cách loại bỏ comments, whitespace
  compressCode(code: string, language: string): string
  
  // Summarize file content
  summarizeFile(content: string, maxTokens: number): string
  
  // Smart truncation - giữ lại phần quan trọng
  smartTruncate(text: string, maxTokens: number): string
  
  // Deduplicate similar content
  deduplicateContext(contexts: string[]): string[]
}
```

### 2.2 Token Counting

**File:** `src/core/prompts/TokenCounter.ts` (NEW)

```typescript
export class TokenCounter {
  // Count tokens using tiktoken
  countTokens(text: string, model: string): number
  
  // Estimate cost
  estimateCost(tokens: number, model: string): number
  
  // Track usage
  trackUsage(request: APIRequest, response: APIResponse): void
}
```

### 2.3 Smart Context Selection

**File:** `src/core/prompts/ContextSelector.ts` (NEW)

```typescript
export class ContextSelector {
  // Chọn files quan trọng nhất
  selectRelevantFiles(files: string[], query: string, maxTokens: number): string[]
  
  // Prioritize context
  prioritizeContext(contexts: Context[], maxTokens: number): Context[]
  
  // Incremental context loading
  loadContextIncrementally(query: string): AsyncGenerator<Context>
}
```

### 2.4 Integration

**File:** `src/api/providers/anthropic.ts`

```typescript
// Thêm compression trước khi gửi request
private async prepareRequest(messages: Message[]): Promise<Message[]> {
  if (this.state.tokenSaving?.enabled) {
    const compressor = new ContextCompressor()
    const selector = new ContextSelector()
    
    // Compress và select context
    messages = await selector.selectRelevantMessages(messages, this.maxTokens)
    messages = messages.map(m => ({
      ...m,
      content: compressor.compressCode(m.content, this.language)
    }))
  }
  
  return messages
}
```

---

## 🎯 Phase 3: Smart File Reading (Ưu tiên trung bình)

**Thời gian ước tính:** 4-5 ngày
**Độ phức tạp:** Cao
**Giá trị:** Cao - Hiểu code tốt hơn

### 📋 Base Tasks

#### Base Task 1: Setup AST Parser Infrastructure
**Mục tiêu:** Setup multi-language AST parsing system

**Debug Info:**
- **Common Errors:**
  - Parser crashes on invalid syntax
  - Memory issues với large files (>1MB)
  - Parser not available for some languages
  - Version conflicts với tree-sitter
- **Solutions:**
  - Graceful fallback on parse errors
  - Stream parsing for large files
  - Fallback to regex for unsupported languages
  - Pin tree-sitter versions
- **Testing:**
  - Test với valid và invalid syntax
  - Test với files >10MB
  - Test 20+ programming languages
  - Test parser performance

**Files to Create:**
- `src/core/analysis/ASTParser.ts`
- `src/core/analysis/parsers/TypeScriptParser.ts`
- `src/core/analysis/parsers/PythonParser.ts`
- `src/core/analysis/parsers/JavaParser.ts`
- `src/core/analysis/parsers/FallbackParser.ts`
- `src/core/analysis/__tests__/ASTParser.test.ts`

**Acceptance Criteria:**
- ✅ Parses 20+ languages
- ✅ Handles invalid syntax gracefully
- ✅ <500ms parse time for 1MB files
- ✅ No memory leaks

---

#### Base Task 2: Implement Type Inference System
**Mục tiêu:** Infer types từ code without running it

**Debug Info:**
- **Common Errors:**
  - Wrong type inference (false positives)
  - Can't resolve external types
  - Slow inference (>2s per file)
  - Circular type references crash
- **Solutions:**
  - Use TypeScript compiler API for TS files
  - Build type database from node_modules
  - Cache inference results
  - Detect và handle circular references
- **Testing:**
  - Test accuracy vs TypeScript compiler
  - Test với complex generic types
  - Test performance on large files
  - Test circular reference handling

**Files to Create:**
- `src/core/analysis/TypeInference.ts`
- `src/core/analysis/types/TypeResolver.ts`
- `src/core/analysis/types/TypeDatabase.ts`
- `src/core/analysis/types/__tests__/TypeInference.test.ts`

**Acceptance Criteria:**
- ✅ >90% accuracy for TypeScript
- ✅ Resolves external types
- ✅ <1s inference per file
- ✅ Handles circular references

---

#### Base Task 3: Build Dependency Graph System
**Mục tiêu:** Build và analyze dependency graph của codebase

**Debug Info:**
- **Common Errors:**
  - Circular dependencies not detected
  - Missing transitive dependencies
  - Graph building too slow (>10s)
  - Memory issues với large graphs (1000+ files)
- **Solutions:**
  - Use Tarjan's algorithm for cycles
  - Recursive dependency resolution
  - Incremental graph building
  - Graph compression for large codebases
- **Testing:**
  - Test circular dependency detection
  - Test transitive dependencies
  - Test với 1000+ file codebases
  - Test graph update performance

**Files to Create:**
- `src/core/analysis/DependencyGraph.ts`
- `src/core/analysis/graph/GraphBuilder.ts`
- `src/core/analysis/graph/CycleDetector.ts`
- `src/core/analysis/graph/__tests__/DependencyGraph.test.ts`

**Acceptance Criteria:**
- ✅ Detects all circular dependencies
- ✅ Includes transitive dependencies
- ✅ <5s build time for 1000 files
- ✅ Handles large graphs efficiently

---

#### Base Task 4: Implement Smart File Reader
**Mục tiêu:** Unified interface cho smart file reading với full analysis

**Debug Info:**
- **Common Errors:**
  - Analysis fails on binary files
  - Wrong file type detection
  - Analysis too slow for large files
  - Inconsistent results across file types
- **Solutions:**
  - Detect binary files early
  - Use file extension + content for type detection
  - Parallel analysis of multiple files
  - Standardize output format
- **Testing:**
  - Test với text và binary files
  - Test file type detection accuracy
  - Test parallel analysis
  - Test output consistency

**Files to Create:**
- `src/core/analysis/SmartFileReader.ts`
- `src/core/analysis/FileTypeDetector.ts`
- `src/core/analysis/FileAnalyzer.ts`
- `src/core/analysis/__tests__/SmartFileReader.test.ts`

**Acceptance Criteria:**
- ✅ Detects file types 100% accurately
- ✅ Handles binary files gracefully
- ✅ <1s analysis per file
- ✅ Consistent output format

---

#### Base Task 5: Integration & Caching
**Mục tiêu:** Integrate smart reading vào existing file operations + caching

**Debug Info:**
- **Common Errors:**
  - Cache invalidation bugs
  - Stale analysis results
  - Cache growing too large (>1GB)
  - Race conditions in cache updates
- **Solutions:**
  - File watcher for cache invalidation
  - TTL for cache entries
  - LRU eviction for cache size limit
  - Lock-free cache implementation
- **Testing:**
  - Test cache hit/miss rates
  - Test cache invalidation on file changes
  - Test cache size limits
  - Test concurrent cache access

**Files to Create:**
- `src/core/analysis/AnalysisCache.ts`
- `src/core/analysis/cache/CacheManager.ts`
- `src/core/analysis/cache/FileWatcher.ts`
- `src/core/analysis/__tests__/AnalysisCache.test.ts`

**Files to Modify:**
- `src/core/mentions/index.ts` - Use smart file reader
- `src/core/controller/index.ts` - Cache analysis results

**Acceptance Criteria:**
- ✅ >80% cache hit rate
- ✅ Cache invalidates on file changes
- ✅ Cache size <500MB
- ✅ No race conditions

### 3.1 AST Parser Integration

**Dependencies:**
```json
{
  "@babel/parser": "^7.23.0",
  "@typescript-eslint/parser": "^6.0.0",
  "tree-sitter": "^0.20.0",
  "tree-sitter-typescript": "^0.20.0"
}
```

**File:** `src/core/analysis/ASTParser.ts` (NEW)

```typescript
export class ASTParser {
  // Parse TypeScript/JavaScript
  parseTypeScript(code: string): AST
  
  // Parse Python
  parsePython(code: string): AST
  
  // Extract symbols (functions, classes, variables)
  extractSymbols(ast: AST): Symbol[]
  
  // Find dependencies
  findDependencies(ast: AST): Dependency[]
}
```

### 3.2 Type Inference

**File:** `src/core/analysis/TypeInference.ts` (NEW)

```typescript
export class TypeInference {
  // Infer types from code
  inferTypes(ast: AST): TypeMap
  
  // Resolve type references
  resolveTypeReferences(symbol: Symbol): Type
  
  // Find type errors
  findTypeErrors(ast: AST): TypeError[]
}
```

### 3.3 Dependency Graph

**File:** `src/core/analysis/DependencyGraph.ts` (NEW)

```typescript
export class DependencyGraph {
  // Build dependency graph
  buildGraph(files: string[]): Graph
  
  // Find circular dependencies
  findCircularDeps(graph: Graph): CircularDep[]
  
  // Get file impact
  getImpactedFiles(file: string, graph: Graph): string[]
}
```

### 3.4 Smart File Reader

**File:** `src/core/analysis/SmartFileReader.ts` (NEW)

```typescript
export class SmartFileReader {
  private parser: ASTParser
  private typeInference: TypeInference
  private depGraph: DependencyGraph
  
  // Read file with full analysis
  async readFileWithAnalysis(path: string): Promise<FileAnalysis> {
    const content = await fs.readFile(path, 'utf-8')
    const ast = this.parser.parse(content)
    const symbols = this.parser.extractSymbols(ast)
    const types = this.typeInference.inferTypes(ast)
    const deps = this.parser.findDependencies(ast)
    
    return {
      content,
      ast,
      symbols,
      types,
      dependencies: deps
    }
  }
  
  // Detect file type
  detectFileType(path: string): FileType
  
  // Get file summary
  getFileSummary(analysis: FileAnalysis): string
}
```

---

## 🎯 Phase 4: AI Discovery Mode (Ưu tiên thấp)

**Thời gian ước tính:** 3-4 ngày
**Độ phức tạp:** Trung bình
**Giá trị:** Trung bình - UX improvement

### 📋 Base Tasks

#### Base Task 1: Design Question Flow System
**Mục tiêu:** Design và implement question flow logic

**Debug Info:**
- **Common Errors:**
  - Questions not relevant to user's goal
  - Flow gets stuck in loops
  - Too many questions (user fatigue)
  - Questions too technical for beginners
- **Solutions:**
  - Use decision tree with max depth
  - Track asked questions to avoid loops
  - Limit to 5-7 questions max
  - Adjust language based on user level
- **Testing:**
  - Test với different user goals
  - Test flow doesn't loop
  - Test question relevance
  - User testing for clarity

**Files to Create:**
- `src/core/discovery/QuestionFlowEngine.ts`
- `src/core/discovery/flow/DecisionTree.ts`
- `src/core/discovery/flow/QuestionGenerator.ts`
- `src/core/discovery/__tests__/QuestionFlowEngine.test.ts`

**Acceptance Criteria:**
- ✅ Questions relevant to goal
- ✅ No infinite loops
- ✅ Max 7 questions per flow
- ✅ Clear for all skill levels

---

#### Base Task 2: Implement Context Gathering
**Mục tiêu:** Gather context từ user answers và codebase

**Debug Info:**
- **Common Errors:**
  - Missing important context
  - Gathering too much (slow)
  - Can't parse user's free-form answers
  - Context not structured properly
- **Solutions:**
  - Use NLP for answer parsing
  - Prioritize context gathering
  - Structured answer formats when possible
  - Validate context completeness
- **Testing:**
  - Test với various answer formats
  - Test context completeness
  - Test gathering speed
  - Test structured output

**Files to Create:**
- `src/core/discovery/ContextGatherer.ts`
- `src/core/discovery/context/AnswerParser.ts`
- `src/core/discovery/context/CodebaseAnalyzer.ts`
- `src/core/discovery/__tests__/ContextGatherer.test.ts`

**Acceptance Criteria:**
- ✅ Parses free-form answers
- ✅ Gathers complete context
- ✅ <2s gathering time
- ✅ Structured output format

---

#### Base Task 3: Build Suggestion Engine
**Mục tiêu:** Generate intelligent suggestions based on gathered context

**Debug Info:**
- **Common Errors:**
  - Suggestions not actionable
  - Too generic (not specific to codebase)
  - Suggestions conflict with each other
  - Not considering user's skill level
- **Solutions:**
  - Use templates for actionable suggestions
  - Include codebase-specific examples
  - Rank và filter conflicting suggestions
  - Adjust complexity to user level
- **Testing:**
  - Test suggestion quality (manual review)
  - Test specificity to codebase
  - Test consistency
  - User testing for usefulness

**Files to Create:**
- `src/core/discovery/SuggestionEngine.ts`
- `src/core/discovery/suggestions/SuggestionGenerator.ts`
- `src/core/discovery/suggestions/SuggestionRanker.ts`
- `src/core/discovery/__tests__/SuggestionEngine.test.ts`

**Acceptance Criteria:**
- ✅ Suggestions actionable
- ✅ Specific to codebase
- ✅ No conflicts
- ✅ Appropriate complexity

---

#### Base Task 4: Create Discovery UI Components
**Mục tiêu:** Build beautiful và intuitive UI cho discovery mode

**Debug Info:**
- **Common Errors:**
  - UI not responsive
  - Progress indicator confusing
  - Can't go back to previous questions
  - Suggestions not readable
- **Solutions:**
  - Mobile-first responsive design
  - Clear progress bar with steps
  - Navigation history with back button
  - Card-based suggestion layout
- **Testing:**
  - Test on different screen sizes
  - Test navigation flow
  - Test accessibility
  - User testing for UX

**Files to Create:**
- `webview-ui/src/components/discovery/DiscoveryWizard.tsx`
- `webview-ui/src/components/discovery/QuestionCard.tsx`
- `webview-ui/src/components/discovery/ProgressIndicator.tsx`
- `webview-ui/src/components/discovery/SuggestionList.tsx`
- `webview-ui/src/components/discovery/DiscoveryWizard.test.tsx`

**Acceptance Criteria:**
- ✅ Responsive on all screens
- ✅ Clear progress indication
- ✅ Can navigate back
- ✅ Accessible (WCAG 2.1 AA)

---

#### Base Task 5: Integration & Analytics
**Mục tiêu:** Integrate discovery mode vào main flow + track usage

**Debug Info:**
- **Common Errors:**
  - Discovery mode not discoverable
  - Analytics not tracking correctly
  - High abandonment rate
  - Suggestions not being used
- **Solutions:**
  - Prominent entry point in UI
  - Track each step of flow
  - A/B test different flows
  - Follow-up on suggestion usage
- **Testing:**
  - Test entry point visibility
  - Test analytics accuracy
  - Test completion rate
  - Test suggestion adoption

**Files to Create:**
- `src/core/discovery/DiscoveryAnalytics.ts`
- `webview-ui/src/components/discovery/DiscoveryEntryPoint.tsx`

**Files to Modify:**
- `webview-ui/src/components/chat/ChatView.tsx` - Add entry point
- `src/core/controller/index.ts` - Handle discovery messages

**Acceptance Criteria:**
- ✅ Entry point visible
- ✅ >60% completion rate
- ✅ Analytics tracking works
- ✅ >40% suggestion adoption

### 4.1 Question Flow Engine

**File:** `src/core/discovery/QuestionFlowEngine.ts` (NEW)

```typescript
export class QuestionFlowEngine {
  // Generate questions based on context
  generateQuestions(context: Context): Question[]
  
  // Process user answers
  processAnswers(answers: Answer[]): Context
  
  // Determine next question
  getNextQuestion(currentQ: Question, answer: Answer): Question | null
}
```

### 4.2 Context Gatherer

**File:** `src/core/discovery/ContextGatherer.ts` (NEW)

```typescript
export class ContextGatherer {
  // Gather context from answers
  gatherContext(answers: Answer[]): Context
  
  // Analyze codebase
  analyzeCodebase(path: string): CodebaseInfo
  
  // Generate suggestions
  generateSuggestions(context: Context): Suggestion[]
}
```

### 4.3 UI Components

**File:** `webview-ui/src/components/discovery/DiscoveryWizard.tsx` (NEW)

- Question display
- Answer input
- Progress indicator
- Suggestion display

---

## 🎯 Phase 5: Core Enhancements (Ưu tiên trung bình)

**Thời gian ước tính:** 5-7 ngày
**Độ phức tạp:** Rất cao
**Giá trị:** Rất cao - Cải thiện AI capabilities

### 📋 Base Tasks

#### Base Task 1: Implement Advanced Code Understanding
**Mục tiêu:** Deep semantic analysis của code để hiểu intent và patterns

**Debug Info:**
- **Common Errors:**
  - Misunderstanding code intent
  - Missing implicit dependencies
  - Can't detect design patterns
  - Analysis too slow (>5s per file)
- **Solutions:**
  - Use control flow analysis
  - Data flow analysis for dependencies
  - Pattern matching với known patterns
  - Incremental analysis
- **Testing:**
  - Test intent detection accuracy
  - Test pattern recognition
  - Test với complex codebases
  - Performance benchmarks

**Files to Create:**
- `src/core/understanding/CodeUnderstandingEngine.ts`
- `src/core/understanding/SemanticAnalyzer.ts`
- `src/core/understanding/IntentDetector.ts`
- `src/core/understanding/PatternMatcher.ts`
- `src/core/understanding/__tests__/CodeUnderstandingEngine.test.ts`

**Acceptance Criteria:**
- ✅ >85% intent detection accuracy
- ✅ Detects 20+ design patterns
- ✅ <3s analysis per file
- ✅ Handles complex codebases

---

#### Base Task 2: Build Intelligent Error Recovery System
**Mục tiêu:** Auto-detect và recover từ errors

**Debug Info:**
- **Common Errors:**
  - Can't detect all error types
  - Recovery strategies fail
  - Infinite retry loops
  - Not learning from past errors
- **Solutions:**
  - Comprehensive error pattern database
  - Multiple recovery strategies per error
  - Max retry limit (3 attempts)
  - ML model for learning
- **Testing:**
  - Test với 50+ error types
  - Test recovery success rate
  - Test retry limits
  - Test learning effectiveness

**Files to Create:**
- `src/core/recovery/ErrorRecoverySystem.ts`
- `src/core/recovery/ErrorDetector.ts`
- `src/core/recovery/RecoveryStrategyGenerator.ts`
- `src/core/recovery/ErrorLearningModel.ts`
- `src/core/recovery/__tests__/ErrorRecoverySystem.test.ts`

**Acceptance Criteria:**
- ✅ Detects 50+ error types
- ✅ >80% recovery success rate
- ✅ Max 3 retry attempts
- ✅ Learns from errors

---

#### Base Task 3: Create Context-Aware Suggestion Engine
**Mục tiêu:** Provide intelligent suggestions based on current context

**Debug Info:**
- **Common Errors:**
  - Suggestions not relevant to context
  - Too many suggestions (overwhelming)
  - Suggestions conflict với existing code
  - Not learning user preferences
- **Solutions:**
  - Context scoring algorithm
  - Limit to top 5 suggestions
  - Validate suggestions against codebase
  - Track accepted/rejected suggestions
- **Testing:**
  - Test suggestion relevance
  - Test suggestion quality
  - Test preference learning
  - User acceptance testing

**Files to Create:**
- `src/core/suggestions/SuggestionEngine.ts`
- `src/core/suggestions/ContextAnalyzer.ts`
- `src/core/suggestions/SuggestionGenerator.ts`
- `src/core/suggestions/PreferenceLearner.ts`
- `src/core/suggestions/__tests__/SuggestionEngine.test.ts`

**Acceptance Criteria:**
- ✅ >70% suggestion acceptance rate
- ✅ Max 5 suggestions at a time
- ✅ No conflicting suggestions
- ✅ Learns preferences over time

---

#### Base Task 4: Implement Collaborative Coding Mode
**Mục tiêu:** Enhanced mode for pair programming với AI

**Debug Info:**
- **Common Errors:**
  - Code review too generic
  - Comments not actionable
  - Explanations too technical/simple
  - Q&A context not maintained
- **Solutions:**
  - Codebase-specific review rules
  - Actionable comment templates
  - Adjust explanation level dynamically
  - Maintain conversation context
- **Testing:**
  - Test review quality
  - Test comment usefulness
  - Test explanation clarity
  - Test Q&A context retention

**Files to Create:**
- `src/core/collaboration/CollaborativeMode.ts`
- `src/core/collaboration/CodeReviewer.ts`
- `src/core/collaboration/CommentGenerator.ts`
- `src/core/collaboration/ExplanationEngine.ts`
- `src/core/collaboration/InteractiveQA.ts`
- `src/core/collaboration/__tests__/CollaborativeMode.test.ts`

**Acceptance Criteria:**
- ✅ Useful code reviews
- ✅ Actionable comments
- ✅ Clear explanations
- ✅ Context maintained in Q&A

---

#### Base Task 5: Integration & Performance Optimization
**Mục tiêu:** Integrate all enhancements + optimize performance

**Debug Info:**
- **Common Errors:**
  - Features conflict với each other
  - High memory usage (>500MB)
  - Slow response times (>2s)
  - Battery drain on laptops
- **Solutions:**
  - Feature coordination layer
  - Shared caching across features
  - Lazy loading of heavy components
  - Background processing for heavy tasks
- **Testing:**
  - Test feature interactions
  - Test memory usage
  - Test response times
  - Test battery impact

**Files to Create:**
- `src/core/enhancements/EnhancementCoordinator.ts`
- `src/core/enhancements/SharedCache.ts`
- `src/core/enhancements/BackgroundProcessor.ts`
- `src/core/enhancements/__tests__/EnhancementCoordinator.test.ts`

**Files to Modify:**
- `src/core/controller/index.ts` - Integrate enhancements
- `src/api/providers/anthropic.ts` - Use enhancements

**Acceptance Criteria:**
- ✅ No feature conflicts
- ✅ Memory usage <300MB
- ✅ Response time <1s
- ✅ Minimal battery impact

### 5.1 Advanced Code Understanding

**File:** `src/core/understanding/CodeUnderstandingEngine.ts` (NEW)

```typescript
export class CodeUnderstandingEngine {
  // Deep semantic analysis
  analyzeSemantics(code: string): SemanticInfo
  
  // Understand code intent
  understandIntent(code: string): Intent
  
  // Find patterns
  findPatterns(codebase: string[]): Pattern[]
}
```

### 5.2 Intelligent Error Recovery

**File:** `src/core/recovery/ErrorRecoverySystem.ts` (NEW)

```typescript
export class ErrorRecoverySystem {
  // Detect errors
  detectErrors(output: string): Error[]
  
  // Generate recovery strategies
  generateRecoveryStrategies(error: Error): Strategy[]
  
  // Apply recovery
  async applyRecovery(strategy: Strategy): Promise<Result>
  
  // Learn from mistakes
  learnFromError(error: Error, solution: Solution): void
}
```

### 5.3 Context-Aware Suggestions

**File:** `src/core/suggestions/SuggestionEngine.ts` (NEW)

```typescript
export class SuggestionEngine {
  // Analyze current context
  analyzeContext(file: string, cursor: Position): Context
  
  // Generate suggestions
  generateSuggestions(context: Context): Suggestion[]
  
  // Learn from user preferences
  learnPreferences(accepted: Suggestion[], rejected: Suggestion[]): void
}
```

### 5.4 Collaborative Coding Mode

**File:** `src/core/collaboration/CollaborativeMode.ts` (NEW)

```typescript
export class CollaborativeMode {
  // Real-time code review
  reviewCode(code: string): Review
  
  // Generate inline comments
  generateComments(code: string): Comment[]
  
  // Interactive Q&A
  answerQuestion(question: string, context: Context): Answer
  
  // Step-by-step explanations
  explainCode(code: string): Explanation[]
}
```

---

## 📊 Implementation Timeline

### Sprint 1 (Week 1-2): Task Documentation
- ✅ State management setup
- ✅ File generation system
- ✅ Integration với task lifecycle
- ✅ Testing

### Sprint 2 (Week 3-4): Token Saving
- ✅ Context compression
- ✅ Token counting
- ✅ Smart context selection
- ✅ Integration với API providers

### Sprint 3 (Week 5-6): Smart File Reading
- ✅ AST parser integration
- ✅ Type inference
- ✅ Dependency graph
- ✅ Smart file reader

### Sprint 4 (Week 7-8): Core Enhancements (Part 1)
- ✅ Advanced code understanding
- ✅ Intelligent error recovery

### Sprint 5 (Week 9-10): Core Enhancements (Part 2)
- ✅ Context-aware suggestions
- ✅ Collaborative coding mode

### Sprint 6 (Week 11-12): AI Discovery Mode
- ✅ Question flow engine
- ✅ Context gatherer
- ✅ UI components

---

## 🔧 Technical Requirements

### Dependencies to Add

```json
{
  "@babel/parser": "^7.23.0",
  "@typescript-eslint/parser": "^6.0.0",
  "tree-sitter": "^0.20.0",
  "tree-sitter-typescript": "^0.20.0",
  "tiktoken": "^1.0.0",
  "zod": "^3.22.0"
}
```

### Infrastructure Changes

1. **Database cho Task Tracking**
   - SQLite hoặc JSON file-based storage
   - Schema cho tasks, events, progress

2. **Caching Layer**
   - Cache AST parsing results
   - Cache type inference
   - Cache dependency graphs

3. **Background Workers**
   - File analysis worker
   - Token counting worker
   - Context compression worker

---

## 🧪 Testing Strategy

### Unit Tests
- Mỗi module phải có >80% coverage
- Mock external dependencies
- Test edge cases

### Integration Tests
- Test interaction giữa các modules
- Test với real codebase
- Test performance

### E2E Tests
- Test full user workflows
- Test với different project types
- Test error scenarios

---

## 📈 Success Metrics

### Task Documentation
- ✅ 100% tasks có documentation
- ✅ <100ms overhead per task action
- ✅ Files readable và useful

### Token Saving
- ✅ 30-50% reduction trong token usage
- ✅ No degradation trong quality
- ✅ <200ms compression overhead

### Smart File Reading
- ✅ 90% accuracy trong type inference
- ✅ <500ms analysis time per file
- ✅ Useful insights generated

### Core Enhancements
- ✅ 80% error recovery success rate
- ✅ 70% suggestion acceptance rate
- ✅ Better code understanding metrics

### AI Discovery Mode
- ✅ 80% user completion rate
- ✅ Useful suggestions generated
- ✅ Positive user feedback

---

## 🚀 Deployment Plan

### Phase 1: Internal Testing (Week 1-2)
- Deploy to dev environment
- Internal team testing
- Bug fixes

### Phase 2: Beta Release (Week 3-4)
- Release to beta testers
- Gather feedback
- Performance tuning

### Phase 3: Gradual Rollout (Week 5-6)
- 10% users
- 50% users
- 100% users

### Phase 4: Monitoring (Ongoing)
- Monitor metrics
- Gather user feedback
- Continuous improvements

---

## 💡 Notes

- Tất cả features đều có feature flags để enable/disable
- Backward compatibility phải được maintain
- Performance là priority - không được làm chậm extension
- User experience phải smooth - no blocking operations
- Documentation phải được update đồng thời

---

## 🎯 Next Steps

1. **Review plan này với team**
2. **Prioritize features dựa trên user feedback**
3. **Setup development environment**
4. **Start với Phase 1: Task Documentation**
5. **Iterate và improve based on learnings**

---

*Document này sẽ được update thường xuyên khi implementation progress.*
