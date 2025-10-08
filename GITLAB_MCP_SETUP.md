# GitLab Docusaurus MCP Server

A Model Context Protocol (MCP) server that enables AI assistants to access Docusaurus documentation stored in GitLab repositories.

## 🎯 Overview

Since Docusaurus doesn't provide an official MCP server, this tool allows you to use GitLab as the data source for your Docusaurus documentation and blog posts. It provides seamless integration with MCP-compatible AI assistants like Claude Desktop.

## ✨ Features

- 📖 **List Documentation Files**: Browse all documentation files in your `docs/` directory
- 📝 **List Blog Posts**: Browse all blog posts in your `blog/` directory  
- 📄 **Read Documentation**: Fetch and read specific documentation files
- 📰 **Read Blog Posts**: Fetch and read specific blog posts
- 🔍 **Search Content**: Search across documentation and blog content
- 🔐 **Secure Access**: Uses GitLab API with personal access tokens
- 🚀 **Easy Integration**: Works with any MCP-compatible client

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- A GitLab account with access to your Docusaurus repository
- GitLab Personal Access Token with `read_api` and `read_repository` scopes

## 🚀 Quick Start

### 1. Installation

Clone this repository or copy the files to your desired location:

```bash
git clone https://github.com/rezacloner1372/rezacloner1372.git
cd rezacloner1372
npm install
```

### 2. Configuration

Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

Edit `.env` and fill in your GitLab details:

```env
GITLAB_URL=https://gitlab.com
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_PROJECT_ID=12345678
GITLAB_BRANCH=main
```

#### How to Get Your GitLab Configuration:

**GitLab Personal Access Token:**
1. Go to GitLab: https://gitlab.com/-/profile/personal_access_tokens
2. Click "Add new token"
3. Give it a name (e.g., "MCP Server")
4. Select scopes: `read_api` and `read_repository`
5. Click "Create personal access token"
6. Copy the token (you won't see it again!)

**GitLab Project ID:**
1. Go to your GitLab project
2. Navigate to Settings > General
3. Look for "Project ID" (it's a number like 12345678)

### 3. MCP Client Configuration

#### For Claude Desktop:

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the MCP server configuration:

```json
{
  "mcpServers": {
    "gitlab-docusaurus": {
      "command": "node",
      "args": ["/absolute/path/to/rezacloner1372/index.js"],
      "env": {
        "GITLAB_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "your_gitlab_token_here",
        "GITLAB_PROJECT_ID": "your_project_id_here",
        "GITLAB_BRANCH": "main"
      }
    }
  }
}
```

Replace `/absolute/path/to/rezacloner1372/index.js` with the actual path to the `index.js` file.

### 4. Restart Claude Desktop

After saving the configuration, restart Claude Desktop to load the MCP server.

## 🛠️ Available Tools

The MCP server provides the following tools:

### 1. `list_docs`
Lists all documentation files in the `docs/` directory.

**Parameters:**
- `path` (optional): Subdirectory path within docs

**Example usage:**
```
List all documentation files
```

### 2. `list_blog_posts`
Lists all blog posts in the `blog/` directory.

**Parameters:**
- `path` (optional): Subdirectory path within blog

**Example usage:**
```
Show me all blog posts
```

### 3. `read_doc`
Reads a specific documentation file.

**Parameters:**
- `path` (required): Path to the documentation file

**Example usage:**
```
Read the docs/intro.md file
```

### 4. `read_blog_post`
Reads a specific blog post.

**Parameters:**
- `path` (required): Path to the blog post file

**Example usage:**
```
Show me the content of blog/2024-01-01-welcome.md
```

### 5. `search_docs`
Searches for content across documentation and blog posts.

**Parameters:**
- `query` (required): Search query string
- `scope` (optional): Search scope - `docs`, `blog`, or `all` (default: `all`)

**Example usage:**
```
Search for "kubernetes" in the documentation
```

## 📖 Usage Examples

Once configured in Claude Desktop, you can ask questions like:

- "List all documentation files in the docs directory"
- "Show me the intro.md documentation"
- "What blog posts are available?"
- "Read the latest blog post"
- "Search for 'kubernetes' in the documentation"
- "Find all mentions of 'docker' in blog posts"

## 🔧 Troubleshooting

### Server not appearing in Claude Desktop

1. Check that the path to `index.js` is absolute and correct
2. Verify your GitLab token and project ID are correct
3. Check Claude Desktop logs for errors
4. Restart Claude Desktop after configuration changes

### GitLab API Errors

1. Verify your GitLab token has the correct scopes (`read_api`, `read_repository`)
2. Check that the project ID is correct
3. Ensure the branch name exists in your repository
4. Verify your GitLab token hasn't expired

### Search Not Working

The search functionality requires GitLab Premium or higher. If you're using GitLab Free, search results may be limited or unavailable.

## 🏗️ Project Structure

```
.
├── index.js           # Main MCP server implementation
├── package.json       # Node.js dependencies and metadata
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
├── GITLAB_MCP_SETUP.md # This documentation
└── README.md          # GitHub profile README
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this in your own projects!

## 👨‍💻 Author

**M. Reza Saberi**
- Email: m.rezasaberi01@gmail.com
- LinkedIn: [M. Reza Saberi](https://www.linkedin.com/in/mrsaberi/)
- GitHub: [rezacloner1372](https://github.com/rezacloner1372)

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Inspired by the need to access Docusaurus documentation via GitLab

## 📚 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [GitLab API Documentation](https://docs.gitlab.com/ee/api/)
- [Docusaurus Documentation](https://docusaurus.io/)
- [Claude Desktop MCP Guide](https://modelcontextprotocol.io/quickstart/user)

---

Made with ❤️ for the MCP and Docusaurus communities
