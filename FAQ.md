# Frequently Asked Questions (FAQ)

## General Questions

### Q: What is this project?
**A:** This is a Model Context Protocol (MCP) server that enables AI assistants like Claude Desktop to access Docusaurus documentation stored in GitLab repositories. Since Docusaurus doesn't provide an official MCP server, this tool bridges that gap using GitLab's API.

### Q: Why do I need this?
**A:** If you store your Docusaurus documentation in GitLab and want to use AI assistants to help you browse, read, and search through your documentation, this MCP server makes it possible without manual copy-pasting.

### Q: Is this an official Docusaurus or GitLab project?
**A:** No, this is a community-created tool that integrates with both GitLab and the Model Context Protocol. It's not officially maintained by Docusaurus or GitLab.

## Setup Questions

### Q: What do I need to get started?
**A:** You need:
1. A GitLab account with access to your Docusaurus repository
2. A GitLab Personal Access Token with `read_api` and `read_repository` scopes
3. Node.js 18.0.0 or higher
4. An MCP-compatible client like Claude Desktop

### Q: How do I get a GitLab Personal Access Token?
**A:** 
1. Go to https://gitlab.com/-/profile/personal_access_tokens
2. Click "Add new token"
3. Give it a name (e.g., "MCP Server")
4. Select scopes: `read_api` and `read_repository`
5. Click "Create personal access token"
6. Copy and save the token (you won't see it again!)

### Q: Where do I find my GitLab Project ID?
**A:** 
1. Go to your GitLab project page
2. Navigate to Settings > General
3. Look for "Project ID" (it's a number like 12345678)
4. Alternatively, the project ID is shown at the top of your project's main page

### Q: Can I use this with GitLab self-hosted?
**A:** Yes! Set the `GITLAB_URL` environment variable to your GitLab instance URL (e.g., `https://gitlab.yourcompany.com`).

### Q: Does this work with GitHub?
**A:** No, this is specifically for GitLab. GitHub has different APIs and would require a separate implementation.

## Configuration Questions

### Q: Where do I put my configuration?
**A:** In your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Q: Can I use environment variables instead of putting tokens in the config file?
**A:** Yes! The server reads from environment variables. You can set them system-wide or in your shell profile.

### Q: What if I want to access multiple GitLab projects?
**A:** Currently, you need to run separate MCP server instances for each project. You can configure multiple servers in Claude Desktop with different names.

Example:
```json
{
  "mcpServers": {
    "gitlab-docs-project1": {
      "command": "node",
      "args": ["/path/to/index.js"],
      "env": {
        "GITLAB_PROJECT_ID": "12345"
      }
    },
    "gitlab-docs-project2": {
      "command": "node",
      "args": ["/path/to/index.js"],
      "env": {
        "GITLAB_PROJECT_ID": "67890"
      }
    }
  }
}
```

## Usage Questions

### Q: What can I ask Claude to do with this MCP server?
**A:** You can ask Claude to:
- List documentation files in the docs directory
- List blog posts in the blog directory
- Read specific documentation files
- Read specific blog posts
- Search for content across documentation
- Find information about specific topics

### Q: How do I know if the MCP server is working?
**A:** After configuring and restarting Claude Desktop, you can ask Claude: "What MCP tools are available?" If the server is working, you'll see the GitLab Docusaurus tools listed.

### Q: Can I search for content across all files?
**A:** Yes, use the `search_docs` tool. Note that GitLab's search API may require a Premium subscription for full functionality.

### Q: What file formats are supported?
**A:** The server can read any text-based files (`.md`, `.mdx`, `.txt`, `.json`, etc.). Binary files are not supported.

### Q: Can I read files outside of docs/ and blog/ directories?
**A:** The current implementation focuses on `docs/` and `blog/` directories as they're standard Docusaurus locations. You could modify the code to access other directories if needed.

## Troubleshooting Questions

### Q: I get "GITLAB_TOKEN environment variable is required"
**A:** Make sure you've set the `GITLAB_TOKEN` in your MCP client configuration's `env` section.

### Q: I get "GitLab API error: 401 Unauthorized"
**A:** This means your token is invalid or expired. Check:
1. The token is correct (copy-paste carefully)
2. The token hasn't expired
3. The token has the right scopes (`read_api`, `read_repository`)

### Q: I get "GitLab API error: 404 Not Found"
**A:** This could mean:
1. The project ID is incorrect
2. The file path doesn't exist
3. The branch name is wrong
4. You don't have access to the project

### Q: The server doesn't show up in Claude Desktop
**A:** Try these steps:
1. Verify the path to `index.js` is absolute and correct
2. Check that Node.js is installed (`node --version`)
3. Look at Claude Desktop logs for errors
4. Restart Claude Desktop after changing configuration
5. Make sure the JSON configuration is valid

### Q: Search doesn't work
**A:** GitLab's search API requires Premium or higher subscription. If you're on GitLab Free, search may not be available or may have limited functionality.

### Q: The server is slow
**A:** Performance depends on:
1. Your network connection to GitLab
2. GitLab API response times
3. File sizes
4. GitLab's current load

Large files (>1MB) may take longer to load. Consider breaking them into smaller files.

### Q: I get rate limited
**A:** GitLab has API rate limits:
- **Free tier**: ~600 requests per minute
- **Premium tier**: Higher limits

If you hit rate limits, wait a few minutes before trying again.

## Technical Questions

### Q: What Node.js version do I need?
**A:** Node.js 18.0.0 or higher. Check your version with `node --version`.

### Q: What dependencies does this use?
**A:** 
- `@modelcontextprotocol/sdk` - Official MCP SDK
- `node-fetch` - HTTP client for API requests

### Q: Is my data secure?
**A:** 
- All communication with GitLab uses HTTPS
- Your token is stored in environment variables, not in code
- The token is never logged or exposed
- The server only has read access to your repository

### Q: Can I modify the code?
**A:** Yes! The project is MIT licensed. You can modify it for your needs. Some ideas:
- Add support for other directories
- Implement caching
- Add support for multiple branches
- Enhance search functionality

### Q: How do I update the MCP server?
**A:** 
1. Pull the latest code: `git pull`
2. Install dependencies: `npm install`
3. Restart Claude Desktop

### Q: Can I run this as a service?
**A:** The MCP server is designed to be started by the MCP client (Claude Desktop), but you could run it as a system service if needed. You'd need to handle the stdio communication appropriately.

### Q: Does this work with other MCP clients?
**A:** Yes! Any MCP-compatible client should work. The server implements the standard MCP protocol.

## Docusaurus-Specific Questions

### Q: Do I need to have Docusaurus installed locally?
**A:** No! The MCP server accesses files directly from GitLab. You don't need a local Docusaurus installation.

### Q: Will this work with versioned Docusaurus docs?
**A:** Currently, it reads from a single branch. To access different versions, you could:
1. Configure multiple MCP server instances for different branches
2. Or modify the code to support version switching

### Q: Can I access Docusaurus configuration files?
**A:** You can read any file in the repository, including `docusaurus.config.ts` and `sidebars.ts`. Just ask Claude to read those files.

### Q: Does this work with Docusaurus plugins?
**A:** This tool reads the source markdown/MDX files. It doesn't process Docusaurus plugins or build the site. It's meant for accessing the raw documentation content.

## Cost Questions

### Q: Is this free to use?
**A:** Yes, the MCP server itself is free and open source (MIT license). However:
- GitLab Free tier has API rate limits
- GitLab Premium may be needed for full search functionality
- You need an MCP client like Claude Desktop (check Claude's pricing)

### Q: Do I need GitLab Premium?
**A:** No, the basic features work with GitLab Free. Only the advanced search functionality may require GitLab Premium.

## Contributing Questions

### Q: Can I contribute to this project?
**A:** Yes! This is an open source project. Feel free to:
- Report issues
- Submit pull requests
- Suggest features
- Improve documentation

### Q: How do I report a bug?
**A:** Open an issue on the GitHub repository with:
1. Description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Your environment (OS, Node.js version, etc.)

### Q: What features are planned?
**A:** Potential future features:
- Caching for better performance
- Support for multiple projects
- Versioned documentation access
- Enhanced search capabilities
- Markdown rendering
- Support for other documentation platforms

## Additional Resources

### Q: Where can I learn more about MCP?
**A:** 
- Official documentation: https://modelcontextprotocol.io/
- MCP SDK: https://github.com/modelcontextprotocol/sdk
- Claude Desktop MCP Guide: https://modelcontextprotocol.io/quickstart/user

### Q: Where can I learn about GitLab API?
**A:** 
- GitLab API docs: https://docs.gitlab.com/ee/api/
- Repository files API: https://docs.gitlab.com/ee/api/repository_files.html
- Search API: https://docs.gitlab.com/ee/api/search.html

### Q: Where can I get help?
**A:** 
1. Check this FAQ
2. Read the QUICKSTART.md guide
3. Read the GITLAB_MCP_SETUP.md documentation
4. Open an issue on GitHub
5. Contact the author: m.rezasaberi01@gmail.com

---

**Still have questions?** Feel free to open an issue on GitHub or reach out to the author!
