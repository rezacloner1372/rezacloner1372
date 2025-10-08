# Testing Guide

This guide explains how to test the GitLab Docusaurus MCP server.

## Prerequisites

Before testing, ensure you have:
- Node.js 18.0.0 or higher installed
- A GitLab account with access to a repository
- A GitLab Personal Access Token with `read_api` and `read_repository` scopes
- The GitLab project ID of your repository

## 1. Configuration Validation

The easiest way to test your configuration is using the validation script:

```bash
# Install dependencies first
npm install

# Set environment variables
export GITLAB_URL=https://gitlab.com
export GITLAB_TOKEN=your_gitlab_token_here
export GITLAB_PROJECT_ID=12345678
export GITLAB_BRANCH=main

# Run validation
npm run validate
```

Expected output if successful:
```
=== GitLab MCP Server Configuration Validator ===

✓ Node.js version: v18.x.x (✓ >= 18.0.0)

Checking environment variables...
✓ GITLAB_URL: https://gitlab.com
✓ GITLAB_TOKEN: Set (glpat-xxxx...)
✓ GITLAB_PROJECT_ID: 12345678
✓ GITLAB_BRANCH: main

Testing GitLab API connectivity...
✓ Successfully connected to GitLab
✓ Project: my-docs (mygroup/my-docs)
✓ Default branch: main

Checking for documentation directories...
✓ Found docs/ directory with 15 items
✓ Found blog/ directory with 8 items

=== Validation Summary ===

✓ All checks passed! Your configuration is valid.
```

## 2. Manual MCP Protocol Testing

You can manually test the MCP server by sending JSON-RPC messages:

### Start the server:

```bash
GITLAB_URL=https://gitlab.com \
GITLAB_TOKEN=your_token \
GITLAB_PROJECT_ID=12345 \
GITLAB_BRANCH=main \
node index.js
```

The server will wait for input on stdin. You can send MCP protocol messages.

### Test 1: List Tools

Send this JSON-RPC request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Expected response: A list of 5 tools (list_docs, list_blog_posts, read_doc, read_blog_post, search_docs)

### Test 2: Call a Tool

Send this JSON-RPC request to list documentation:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "list_docs",
    "arguments": {}
  }
}
```

Expected response: A list of files in the docs directory

## 3. Testing with Claude Desktop

### Step 1: Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add:
```json
{
  "mcpServers": {
    "gitlab-docusaurus": {
      "command": "node",
      "args": ["/absolute/path/to/index.js"],
      "env": {
        "GITLAB_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "your_token",
        "GITLAB_PROJECT_ID": "12345",
        "GITLAB_BRANCH": "main"
      }
    }
  }
}
```

### Step 2: Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.

### Step 3: Test Basic Functionality

Try these test queries in Claude Desktop:

#### Test 1: List Tools
Ask Claude:
```
What MCP tools are available?
```

Expected: Claude should show the gitlab-docusaurus tools

#### Test 2: List Documentation
Ask Claude:
```
List all documentation files in the docs directory
```

Expected: A list of files from your docs/ directory

#### Test 3: Read a File
Ask Claude:
```
Read the docs/intro.md file
```

Expected: The content of the intro.md file

#### Test 4: List Blog Posts
Ask Claude:
```
What blog posts are available?
```

Expected: A list of files from your blog/ directory

#### Test 5: Search
Ask Claude:
```
Search for "kubernetes" in the documentation
```

Expected: Search results showing matches (if available)

## 4. Troubleshooting Tests

### Test Case 1: Missing Configuration

**Action**: Start server without GITLAB_TOKEN
```bash
node index.js
```

**Expected**: Error message "GITLAB_TOKEN environment variable is required"

### Test Case 2: Invalid Token

**Action**: Start server with invalid token
```bash
GITLAB_TOKEN=invalid GITLAB_PROJECT_ID=12345 node index.js
```

Then try to list docs via Claude.

**Expected**: Error message about authentication failure

### Test Case 3: Invalid Project ID

**Action**: Configure with non-existent project ID
```bash
GITLAB_TOKEN=valid_token GITLAB_PROJECT_ID=99999999 node index.js
```

**Expected**: Error message about project not found

### Test Case 4: Non-existent File

Ask Claude to read a file that doesn't exist:
```
Read the docs/nonexistent.md file
```

**Expected**: Error message about file not found

### Test Case 5: Non-existent Directory

Ask Claude to list a directory that doesn't exist:
```
List files in docs/nonexistent/
```

**Expected**: Error message about directory not found

## 5. Performance Testing

### Test Latency

Measure the time it takes to list and read files:

1. List a directory with many files
2. Read a large file (>100KB)
3. Perform a search query

Typical response times:
- List directory: 200-500ms
- Read small file (<10KB): 200-400ms
- Read large file (>100KB): 500-1000ms
- Search query: 500-1500ms

### Test Rate Limits

Make multiple rapid requests to see if you hit GitLab rate limits:

1. List docs multiple times in quick succession
2. Read multiple files rapidly

GitLab Free tier allows ~600 requests per minute.

## 6. Integration Testing

### Test with Real Docusaurus Project

If you have a real Docusaurus project in GitLab:

1. **Test directory structure**
   - Verify docs/ directory is accessible
   - Verify blog/ directory is accessible
   - Check for nested directories

2. **Test file types**
   - Read .md files
   - Read .mdx files
   - Read configuration files

3. **Test content**
   - Verify markdown formatting is preserved
   - Check for special characters
   - Test with non-English content

4. **Test edge cases**
   - Very large files (>1MB)
   - Files with special characters in names
   - Empty directories
   - Deeply nested directories

## 7. Security Testing

### Test Token Security

1. **Verify token is not logged**
   - Check server output
   - Check Claude Desktop logs
   - Ensure token doesn't appear in error messages

2. **Test token scopes**
   - Verify read-only access
   - Try operations that require write access (should fail)

3. **Test invalid tokens**
   - Expired tokens
   - Tokens with wrong scopes
   - Malformed tokens

## 8. Automated Testing

### Create a Test Script

You can create automated tests:

```bash
#!/bin/bash

echo "Testing GitLab MCP Server..."

# Test 1: Validation
echo "Test 1: Running validation..."
npm run validate || exit 1

# Test 2: Server starts
echo "Test 2: Server starts without errors..."
timeout 5s node index.js < /dev/null 2>&1 | grep -q "running" && echo "✓ Pass" || echo "✗ Fail"

echo "All tests completed!"
```

## 9. Test Checklist

Use this checklist to ensure comprehensive testing:

- [ ] Configuration validation passes
- [ ] Server starts without errors
- [ ] All 5 tools are listed
- [ ] list_docs works
- [ ] list_blog_posts works
- [ ] read_doc works
- [ ] read_blog_post works
- [ ] search_docs works (if available)
- [ ] Error handling works for missing files
- [ ] Error handling works for invalid tokens
- [ ] Server works in Claude Desktop
- [ ] Token is not exposed in logs
- [ ] Performance is acceptable
- [ ] Works with real Docusaurus project

## 10. Common Issues and Solutions

### Issue: "Cannot find module '@modelcontextprotocol/sdk'"

**Solution**: Run `npm install` to install dependencies

### Issue: "SyntaxError: Cannot use import statement"

**Solution**: Ensure Node.js version is 18.0.0 or higher

### Issue: Server doesn't respond in Claude Desktop

**Solution**: 
1. Check Claude Desktop logs
2. Verify absolute path to index.js
3. Restart Claude Desktop

### Issue: "ECONNREFUSED" error

**Solution**: Check your internet connection and GitLab URL

## 11. Debugging

### Enable Debug Output

To see detailed debug information:

```bash
NODE_DEBUG=* node index.js
```

### Check Claude Desktop Logs

**macOS**: `~/Library/Logs/Claude/`
**Windows**: `%APPDATA%\Claude\logs\`

### Test GitLab API Directly

Use curl to test GitLab API:

```bash
curl -H "PRIVATE-TOKEN: your_token" \
  "https://gitlab.com/api/v4/projects/12345"
```

## 12. Next Steps

After successful testing:

1. Read the [Setup Guide](GITLAB_MCP_SETUP.md)
2. Check the [FAQ](FAQ.md) for common questions
3. Review [Implementation Notes](IMPLEMENTATION_NOTES.md) for technical details
4. Explore the [Architecture](ARCHITECTURE.md) to understand the system

---

**Need Help?**

If tests fail or you encounter issues:
1. Check the [FAQ](FAQ.md)
2. Review the [Troubleshooting section](GITLAB_MCP_SETUP.md#troubleshooting)
3. Open an issue on GitHub
4. Contact: m.rezasaberi01@gmail.com
