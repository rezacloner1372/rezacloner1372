# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User / Developer                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Natural Language Queries
                             │ (e.g., "Show me the docs")
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Claude Desktop                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              MCP Client Integration                      │   │
│  │  - Parses user queries                                   │   │
│  │  - Calls appropriate MCP tools                          │   │
│  │  - Formats responses                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ MCP Protocol (JSON-RPC over stdio)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitLab Docusaurus MCP Server                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   MCP Tools Handler                      │   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ list_docs   │  │ read_doc     │  │ search_docs  │   │   │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────┐  ┌──────────────────┐            │   │
│  │  │ list_blog_posts  │  │ read_blog_post   │            │   │
│  │  └──────────────────┘  └──────────────────┘            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              GitLab API Client                           │   │
│  │  - Authentication (Personal Access Token)                │   │
│  │  - REST API v4 calls                                     │   │
│  │  - Response parsing                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS Requests
                             │ (GitLab API v4)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GitLab Repository                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Docusaurus Project                       │   │
│  │                                                           │   │
│  │  ├── docs/                                               │   │
│  │  │   ├── intro.md                                        │   │
│  │  │   ├── tutorial/                                       │   │
│  │  │   └── api/                                            │   │
│  │  │                                                        │   │
│  │  ├── blog/                                               │   │
│  │  │   ├── 2024-01-01-welcome.md                          │   │
│  │  │   └── 2024-02-15-updates.md                          │   │
│  │  │                                                        │   │
│  │  ├── docusaurus.config.ts                               │   │
│  │  └── package.json                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. List Documentation Files

```
User Request: "List all documentation files"
     │
     ▼
Claude Desktop → MCP Tool: list_docs
     │
     ▼
MCP Server → GitLab API: GET /repository/tree?path=docs
     │
     ▼
GitLab Returns: [{ name: "intro.md", path: "docs/intro.md" }, ...]
     │
     ▼
MCP Server → Format Response
     │
     ▼
Claude Desktop → Display to User
```

### 2. Read Documentation File

```
User Request: "Show me the intro.md file"
     │
     ▼
Claude Desktop → MCP Tool: read_doc(path="intro.md")
     │
     ▼
MCP Server → GitLab API: GET /repository/files/docs%2Fintro.md
     │
     ▼
GitLab Returns: { content: "base64_encoded_content" }
     │
     ▼
MCP Server → Decode base64 → Format Response
     │
     ▼
Claude Desktop → Display to User
```

### 3. Search Documentation

```
User Request: "Search for 'kubernetes' in the docs"
     │
     ▼
Claude Desktop → MCP Tool: search_docs(query="kubernetes", scope="docs")
     │
     ▼
MCP Server → GitLab API: GET /search?scope=blobs&search=kubernetes
     │
     ▼
GitLab Returns: [{ path: "...", data: "...", startline: 10 }, ...]
     │
     ▼
MCP Server → Filter by docs/ → Format Response
     │
     ▼
Claude Desktop → Display to User
```

## Configuration Flow

```
1. User creates GitLab Personal Access Token
         │
         ▼
2. User finds GitLab Project ID
         │
         ▼
3. User edits Claude Desktop config (claude_desktop_config.json)
   - Sets GITLAB_TOKEN
   - Sets GITLAB_PROJECT_ID
   - Sets path to index.js
         │
         ▼
4. User restarts Claude Desktop
         │
         ▼
5. Claude Desktop starts MCP Server as subprocess
         │
         ▼
6. MCP Server validates configuration
   - Checks GITLAB_TOKEN exists
   - Checks GITLAB_PROJECT_ID exists
   - Establishes stdio connection
         │
         ▼
7. MCP Server ready to handle requests
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Transport Security                                       │
│     └─ HTTPS for all GitLab API calls                       │
│                                                              │
│  2. Authentication                                           │
│     └─ GitLab Personal Access Token                         │
│        - Stored in environment variables                    │
│        - Never logged or exposed                            │
│        - Token scopes: read_api, read_repository           │
│                                                              │
│  3. Authorization                                            │
│     └─ GitLab project-level permissions                     │
│        - Only accessible if user has read access           │
│                                                              │
│  4. Process Isolation                                        │
│     └─ MCP Server runs as separate process                  │
│        - Managed by Claude Desktop                          │
│        - No direct file system access                       │
│                                                              │
│  5. API Rate Limiting                                        │
│     └─ GitLab enforces rate limits                          │
│        - Prevents abuse                                     │
│        - Per-token limits                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│              │     │              │     │              │
│   Claude     │────▶│  MCP Server  │────▶│   GitLab     │
│   Desktop    │     │              │     │     API      │
│              │◀────│  (Node.js)   │◀────│              │
│              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
      │                    │                     │
      │                    │                     │
   stdio              HTTP/HTTPS           Repository
  JSON-RPC            REST API v4           Storage
```

## Error Handling Flow

```
Error Occurs (e.g., API failure, missing file)
     │
     ▼
MCP Server catches exception
     │
     ▼
Logs error to stderr (for debugging)
     │
     ▼
Returns formatted error response to client
     │
     ├─── isError: true
     └─── content: [{ type: "text", text: "Error: ..." }]
     │
     ▼
Claude Desktop receives error
     │
     ▼
Displays user-friendly error message
```

## Scalability Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Factors                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. API Call Latency                                         │
│     - Typical: 100-500ms per request                         │
│     - Depends on: Network, GitLab load, file size           │
│                                                              │
│  2. Rate Limits                                              │
│     - GitLab Free: ~600 requests/minute                      │
│     - GitLab Premium: Higher limits                          │
│                                                              │
│  3. Concurrent Requests                                      │
│     - Each tool call is sequential                           │
│     - No concurrent requests from single client             │
│                                                              │
│  4. File Size Limits                                         │
│     - GitLab API: Files up to 1MB without issues            │
│     - Larger files: May take longer to encode/decode        │
│                                                              │
│  5. Cache Strategy (Future)                                  │
│     - Currently: No caching                                  │
│     - Future: Add Redis/memory cache                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides a clean separation of concerns:
- **Claude Desktop**: User interface and query interpretation
- **MCP Server**: Protocol handling and GitLab integration
- **GitLab API**: Data storage and retrieval

The design is extensible and can be enhanced with additional features like caching, multi-project support, and advanced search capabilities.
