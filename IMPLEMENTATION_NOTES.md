# Implementation Notes: GitLab Docusaurus MCP Server

## Overview

This document provides technical details about the implementation of the GitLab Docusaurus MCP server.

## Problem Statement

The user needed a way to access Docusaurus documentation stored in GitLab via the Model Context Protocol (MCP), as Docusaurus doesn't provide an official MCP server. The documentation is organized in `docs/` and `blog/` directories in a GitLab repository.

## Solution

We created a standalone MCP server that:
1. Connects to GitLab API using personal access tokens
2. Provides tools to browse and read documentation files
3. Enables search functionality across documentation
4. Integrates seamlessly with MCP-compatible clients like Claude Desktop

## Architecture

### Core Components

#### 1. MCP Server (`index.js`)
- Built using `@modelcontextprotocol/sdk`
- Implements stdio transport for communication
- Provides 5 main tools:
  - `list_docs` - Browse documentation files
  - `list_blog_posts` - Browse blog posts
  - `read_doc` - Read specific documentation
  - `read_blog_post` - Read specific blog post
  - `search_docs` - Search across content

#### 2. GitLab API Integration
- Uses GitLab REST API v4
- Authenticated via personal access tokens
- Key endpoints used:
  - `/api/v4/projects/{id}/repository/tree` - List files
  - `/api/v4/projects/{id}/repository/files/{path}` - Get file content
  - `/api/v4/projects/{id}/search` - Search content

### Technical Decisions

#### Why Node.js?
- MCP SDK has excellent Node.js support
- Native async/await for API calls
- Easy integration with existing JavaScript ecosystems

#### Why Stdio Transport?
- Standard communication method for MCP servers
- Works seamlessly with Claude Desktop
- Simple to test and debug

#### Why GitLab API v4?
- Well-documented and stable
- Comprehensive file access capabilities
- Good authentication options

### Configuration

The server uses environment variables for configuration:
- `GITLAB_URL` - GitLab instance URL (default: https://gitlab.com)
- `GITLAB_TOKEN` - Personal access token (required)
- `GITLAB_PROJECT_ID` - Numeric project ID (required)
- `GITLAB_BRANCH` - Git branch name (default: main)

### Security Considerations

1. **Token Storage**: Tokens are passed via environment variables, not stored in code
2. **API Scopes**: Only requires read-only access (`read_api`, `read_repository`)
3. **No Token Logging**: Tokens are never logged or exposed
4. **HTTPS Only**: All API calls use HTTPS

### Error Handling

The implementation includes error handling for:
- Missing configuration
- Invalid GitLab credentials
- Non-existent files or paths
- Network errors
- API rate limits

### File Structure

```
.
├── index.js                          # Main MCP server implementation
├── package.json                      # Dependencies and metadata
├── .env.example                      # Configuration template
├── .gitignore                        # Git ignore rules
├── LICENSE                           # MIT license
├── README.md                         # Updated profile with project info
├── GITLAB_MCP_SETUP.md              # Comprehensive setup guide
├── QUICKSTART.md                     # Quick start guide
├── claude_desktop_config.example.json # Example client config
└── IMPLEMENTATION_NOTES.md          # This file
```

## API Usage Examples

### List Files
```
GET /api/v4/projects/{id}/repository/tree?path=docs&ref=main
```

Response contains file metadata including name, path, and type.

### Read File
```
GET /api/v4/projects/{id}/repository/files/docs%2Fintro.md?ref=main
```

Response contains base64-encoded file content.

### Search
```
GET /api/v4/projects/{id}/search?scope=blobs&search=kubernetes
```

Response contains matching file paths and snippets.

## Integration Flow

```
User Query → Claude Desktop → MCP Server → GitLab API → Response
                                ↓
                         Parse & Format
                                ↓
                         Return to User
```

## Limitations

1. **Search Requires Premium**: GitLab search API may require Premium subscription
2. **Rate Limits**: Subject to GitLab API rate limits
3. **File Size**: Very large files may take longer to load
4. **Binary Files**: Only supports text-based documentation

## Future Enhancements

Potential improvements for future versions:

1. **Caching**: Add local caching to reduce API calls
2. **Pagination**: Implement pagination for large directories
3. **File Watching**: Monitor for changes and invalidate cache
4. **Multi-Project**: Support multiple GitLab projects
5. **Advanced Search**: Implement client-side search with regex
6. **Markdown Rendering**: Parse and format markdown output
7. **Version Support**: Access different versions/tags of docs
8. **Diff View**: Show changes between versions

## Testing

### Manual Testing

Test the server without MCP client:

```bash
# Set environment variables
export GITLAB_URL=https://gitlab.com
export GITLAB_TOKEN=your_token
export GITLAB_PROJECT_ID=12345
export GITLAB_BRANCH=main

# Run the server
node index.js
```

The server will wait for JSON-RPC messages on stdin.

### Test with MCP Client

1. Configure Claude Desktop with the server
2. Ask Claude to list documentation
3. Ask Claude to read specific files
4. Try search functionality

### Validation Checklist

- [ ] Server starts without errors
- [ ] Configuration validation works
- [ ] List tools returns all 5 tools
- [ ] File listing works for docs/
- [ ] File listing works for blog/
- [ ] Reading files works
- [ ] Search returns results (if available)
- [ ] Error messages are clear and helpful

## Dependencies

### Runtime Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",
  "node-fetch": "^3.3.2"
}
```

- **@modelcontextprotocol/sdk**: Official MCP SDK for building servers
- **node-fetch**: HTTP client for making GitLab API requests

### Required Node.js Version

- Node.js 18.0.0 or higher (for native fetch support and ES modules)

## Deployment Options

### Option 1: Local Installation
Install dependencies and run locally on user's machine.

### Option 2: Docker Container
Could be containerized for easier deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY index.js ./
CMD ["node", "index.js"]
```

### Option 3: System Service
Could be installed as a system service for always-on availability.

## Troubleshooting Guide

### Issue: "GITLAB_TOKEN environment variable is required"
**Solution**: Set the GITLAB_TOKEN in your MCP client configuration

### Issue: "GitLab API error: 401"
**Cause**: Invalid or expired token
**Solution**: Generate new token with correct scopes

### Issue: "GitLab API error: 404"
**Cause**: Invalid project ID or file path
**Solution**: Verify project ID and file paths in GitLab

### Issue: Server not showing in Claude Desktop
**Cause**: Configuration or path issues
**Solution**: 
1. Use absolute path to index.js
2. Check Claude Desktop logs
3. Restart Claude Desktop

## Performance Considerations

1. **API Calls**: Each tool invocation makes 1-2 API calls
2. **Response Time**: Depends on GitLab API response time (typically <1s)
3. **File Size**: Large files (>1MB) may take longer to load
4. **Rate Limits**: GitLab has rate limits per user/token

## Standards Compliance

- **MCP Protocol**: Fully compliant with MCP specification
- **GitLab API**: Uses GitLab REST API v4
- **JSON-RPC**: Uses JSON-RPC 2.0 for communication
- **ES Modules**: Uses modern JavaScript ES modules

## License

MIT License - See LICENSE file for details

## Author

**M. Reza Saberi**
- GitHub: [@rezacloner1372](https://github.com/rezacloner1372)
- Email: m.rezasaberi01@gmail.com
- LinkedIn: [M. Reza Saberi](https://www.linkedin.com/in/mrsaberi/)

## Acknowledgments

- Model Context Protocol team for the excellent SDK
- GitLab for comprehensive API documentation
- Docusaurus community for inspiration

---

Last Updated: 2024
Version: 1.0.0
