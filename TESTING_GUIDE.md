# Testing Guide - Feature Implementation

## 🧪 How to Test Implemented Features

### Prerequisites:
1. Extension built successfully (run `npm run compile` or `node esbuild.mjs`)
2. VS Code with extension loaded
3. A test workspace/project

---

## ✅ Test 1: Task Documentation & Tracking

### Status: **READY TO TEST** (80% integrated)

### Steps to Test:

1. **Reload Extension**
   ```
   Press F5 in VS Code (or Ctrl+R in extension development host)
   ```

2. **Enable Feature**
   - Open VS Code Settings (Ctrl/Cmd + ,)
   - Search for "Cline"
   - Find "Task Documentation & Tracking"
   - Enable the toggle
   - Enable "Progress Tracking" (optional)

3. **Start a New Task**
   - Open Cline chat
   - Give it a task, for example:
     ```
     Create a simple React component called Button.tsx
     ```

4. **Check Documentation Files**
   - Navigate to `.cline/tasks/` folder in your workspace
   - You should see a folder with task ID
   - Inside should be:
     - `.task-history.md` - Timeline of actions
     - `.task-plan.md` - Task plan
     - `.task-debug.md` - Debug info
     - `.task-progress.json` - Progress data

5. **Verify Content**
   - Open `.task-history.md` - should show task start event
   - Open `.task-plan.md` - should show base task
   - Open `.task-progress.json` - should show progress percentage

### Expected Results:
- ✅ Files created in `.cline/tasks/{task-id}/`
- ✅ History file contains timeline
- ✅ Plan file contains task description
- ✅ Debug file exists (may be empty if no errors)
- ✅ Progress file shows 0-100%

### Known Issues:
- Files may not update in real-time (need to refresh)
- Progress tracking needs more integration

---

## ⚠️ Test 2: Token Saving

### Status: **NOT READY** (Infrastructure only, needs integration)

### What's Missing:
- Integration into API providers
- Settings UI
- State management

### To Make It Work:
1. Add settings toggle in UI
2. Integrate `TokenSavingIntegration` into `src/api/providers/anthropic.ts`
3. Add state management for enable/disable

### Estimated Time: 2-3 hours

---

## ⚠️ Test 3: Smart File Reading

### Status: **NOT READY** (Standalone code, needs integration)

### What's Missing:
- Integration into file reading operations
- Replace existing file readers

### To Make It Work:
1. Import `SmartFileReader` in `src/core/mentions/index.ts`
2. Replace `fs.readFile` calls with `smartReader.readFileWithAnalysis()`
3. Use extracted metadata

### Estimated Time: 1-2 hours

---

## ❌ Test 4: AI Discovery Mode

### Status: **NOT READY** (Concept only)

### What's Missing:
- UI components
- Integration into chat flow
- State management

### To Make It Work:
1. Create UI components in `webview-ui/src/components/discovery/`
2. Add entry point in chat
3. Wire up question flow

### Estimated Time: 4-5 hours

---

## ❌ Test 5: Core Enhancements

### Status: **NOT READY** (Concept only)

### What's Missing:
- Integration into error handling
- Integration into code analysis
- UI to display insights

### To Make It Work:
1. Integrate `ErrorRecoverySystem` into error handlers
2. Integrate `CodeUnderstandingEngine` into file analysis
3. Add UI displays

### Estimated Time: 5-6 hours

---

## 🐛 Troubleshooting

### Issue: Extension won't load
**Solution:** 
- Check console for errors
- Run `npm run compile` to see TypeScript errors
- Run `node esbuild.mjs` to build

### Issue: Settings not showing
**Solution:**
- Reload extension (Ctrl+R)
- Check if proto files were generated
- Verify `state.proto` has new fields

### Issue: Files not being created
**Solution:**
- Check if feature is enabled in settings
- Check console for errors
- Verify `.cline/tasks/` folder exists
- Check file permissions

### Issue: Build errors
**Solution:**
- Run `npm run protos` to regenerate proto files
- Check for TypeScript errors
- Verify all imports are correct

---

## 📊 Test Results Template

### Task Documentation Test:

**Date:** ___________
**Tester:** ___________

- [ ] Extension loaded successfully
- [ ] Settings toggle visible
- [ ] Feature can be enabled
- [ ] Task started successfully
- [ ] `.cline/tasks/` folder created
- [ ] `.task-history.md` created
- [ ] `.task-plan.md` created
- [ ] `.task-debug.md` created
- [ ] `.task-progress.json` created
- [ ] Files contain correct content
- [ ] No errors in console

**Issues Found:**
1. ___________
2. ___________

**Notes:**
___________

---

## 🚀 Next Steps After Testing

### If Task Documentation Works:
1. ✅ Mark as production ready
2. Document any issues found
3. Create bug fixes if needed
4. Move to next feature

### If Issues Found:
1. Document the issue
2. Check console for errors
3. Review integration code
4. Fix and retest

### Priority Order:
1. **Task Documentation** - Test first (ready)
2. **Token Saving** - Integrate next (high value)
3. **Smart File Reading** - Quick win (easy integration)
4. **AI Discovery** - Later (needs UI work)
5. **Core Enhancements** - Last (complex integration)

---

## 💡 Tips for Testing

1. **Use a Test Workspace**
   - Don't test on important projects
   - Create a simple test folder

2. **Check Console**
   - Open Developer Tools (Help → Toggle Developer Tools)
   - Watch for errors or warnings

3. **Test Incrementally**
   - Test one feature at a time
   - Verify each step works

4. **Document Everything**
   - Take screenshots
   - Note any unexpected behavior
   - Record error messages

5. **Be Patient**
   - Some features may take time to initialize
   - Files may not appear immediately
   - Refresh file explorer if needed

---

**Last Updated:** 2025-11-22
**Status:** Task Documentation ready for testing
**Next:** Complete integration of remaining features
