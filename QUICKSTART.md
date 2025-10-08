# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your GitLab credentials:

```env
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=your_token_here
GITLAB_PROJECT_ID=your_project_id
GITLAB_BRANCH=main
```

## Step 3: Test the Server

You can test the server manually with environment variables:

```bash
GITLAB_URL=https://gitlab.com \
GITLAB_TOKEN=your_token \
GITLAB_PROJECT_ID=12345 \
GITLAB_BRANCH=main \
node index.js
```

The server will start and wait for MCP protocol messages on stdin/stdout.

## Step 4: Configure Your MCP Client

### Claude Desktop Configuration

Edit your Claude Desktop config file and add:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gitlab-docusaurus": {
      "command": "node",
      "args": ["/full/path/to/index.js"],
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

## Step 5: Use the Server

After restarting Claude Desktop, you can ask:

- "List all documentation files"
- "Show me the content of docs/intro.md"
- "Search for 'kubernetes' in the docs"
- "What blog posts are available?"

## Example Questions for Claude

Here are some example questions you can ask Claude once the MCP server is configured:

1. **Browsing Documentation**
   - "What documentation files are in the docs folder?"
   - "List all the subdirectories in docs/"
   - "Show me what's in the docs/guides folder"

2. **Reading Content**
   - "Read the docs/introduction.md file"
   - "Show me the content of docs/getting-started/installation.md"
   - "What's in the blog/2024-01-01-hello.md post?"

3. **Searching**
   - "Search for 'kubernetes' in all documentation"
   - "Find mentions of 'docker' in the blog posts"
   - "Search for 'API' in the docs folder only"

4. **Exploring Blog**
   - "List all blog posts"
   - "Show me the latest blog posts"
   - "Read the blog post from January 2024"

## Troubleshooting

### "GITLAB_TOKEN environment variable is required"

Make sure you've set the environment variable or configured it in your MCP client.

### "GitLab API error: 401"

Your token is invalid or expired. Generate a new token with `read_api` and `read_repository` scopes.

### "GitLab API error: 404"

- Check your project ID is correct
- Verify the file path exists in your repository
- Ensure the branch name is correct

### Server not showing in Claude Desktop

1. Verify the path to index.js is absolute
2. Check Claude Desktop logs
3. Restart Claude Desktop after configuration changes

## Next Steps

- Read the full [Setup Guide](GITLAB_MCP_SETUP.md) for detailed information
- Explore the [GitLab API documentation](https://docs.gitlab.com/ee/api/)
- Learn more about [MCP protocol](https://modelcontextprotocol.io/)
