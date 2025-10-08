#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// Configuration from environment variables
const GITLAB_URL = process.env.GITLAB_URL || "https://gitlab.com";
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
const GITLAB_BRANCH = process.env.GITLAB_BRANCH || "main";

if (!GITLAB_TOKEN) {
  console.error("Error: GITLAB_TOKEN environment variable is required");
  process.exit(1);
}

if (!GITLAB_PROJECT_ID) {
  console.error("Error: GITLAB_PROJECT_ID environment variable is required");
  process.exit(1);
}

class GitLabDocusaurusMCP {
  constructor() {
    this.server = new Server(
      {
        name: "gitlab-docusaurus-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_docs",
          description:
            "List all documentation files in the docs directory from GitLab",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Subdirectory path within docs (optional)",
                default: "",
              },
            },
          },
        },
        {
          name: "list_blog_posts",
          description:
            "List all blog posts in the blog directory from GitLab",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Subdirectory path within blog (optional)",
                default: "",
              },
            },
          },
        },
        {
          name: "read_doc",
          description: "Read a specific documentation file from GitLab",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the documentation file (e.g., 'intro.md' or 'guide/setup.md')",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "read_blog_post",
          description: "Read a specific blog post from GitLab",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to the blog post file (e.g., '2024-01-01-hello.md')",
              },
            },
            required: ["path"],
          },
        },
        {
          name: "search_docs",
          description: "Search for content across all documentation files",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query string",
              },
              scope: {
                type: "string",
                description: "Search scope: 'docs', 'blog', or 'all'",
                enum: ["docs", "blog", "all"],
                default: "all",
              },
            },
            required: ["query"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "list_docs":
            return await this.listFiles("docs", args.path || "");
          case "list_blog_posts":
            return await this.listFiles("blog", args.path || "");
          case "read_doc":
            return await this.readFile("docs", args.path);
          case "read_blog_post":
            return await this.readFile("blog", args.path);
          case "search_docs":
            return await this.searchContent(args.query, args.scope || "all");
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async makeGitLabRequest(endpoint) {
    const url = `${GITLAB_URL}/api/v4${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitLab API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  async listFiles(baseDir, subPath) {
    const fullPath = subPath ? `${baseDir}/${subPath}` : baseDir;
    const encodedPath = encodeURIComponent(fullPath);
    
    const files = await this.makeGitLabRequest(
      `/projects/${GITLAB_PROJECT_ID}/repository/tree?path=${encodedPath}&ref=${GITLAB_BRANCH}&recursive=false`
    );

    const fileList = files
      .filter((item) => item.type === "blob")
      .map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
      }));

    const dirList = files
      .filter((item) => item.type === "tree")
      .map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
      }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              directories: dirList,
              files: fileList,
              total: files.length,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  async readFile(baseDir, filePath) {
    // Remove leading slash if present
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const fullPath = `${baseDir}/${cleanPath}`;
    const encodedPath = encodeURIComponent(fullPath);

    const fileData = await this.makeGitLabRequest(
      `/projects/${GITLAB_PROJECT_ID}/repository/files/${encodedPath}?ref=${GITLAB_BRANCH}`
    );

    // Decode base64 content
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");

    return {
      content: [
        {
          type: "text",
          text: `# File: ${fullPath}\n\n${content}`,
        },
      ],
    };
  }

  async searchContent(query, scope) {
    const searchScope = scope === "all" ? "blobs" : scope;
    const encodedQuery = encodeURIComponent(query);
    
    let searchPath = "";
    if (scope === "docs") {
      searchPath = "&scope=blobs&search=" + encodedQuery + " path:docs/*";
    } else if (scope === "blog") {
      searchPath = "&scope=blobs&search=" + encodedQuery + " path:blog/*";
    } else {
      searchPath = `&scope=blobs&search=${encodedQuery}`;
    }

    try {
      const results = await this.makeGitLabRequest(
        `/projects/${GITLAB_PROJECT_ID}/search?scope=blobs&search=${encodedQuery}`
      );

      // Filter results by path if needed
      let filteredResults = results;
      if (scope === "docs") {
        filteredResults = results.filter((r) => r.path?.startsWith("docs/"));
      } else if (scope === "blog") {
        filteredResults = results.filter((r) => r.path?.startsWith("blog/"));
      }

      const searchResults = filteredResults.slice(0, 10).map((result) => ({
        path: result.path,
        filename: result.filename,
        ref: result.ref,
        startline: result.startline,
        data: result.data,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                query: query,
                scope: scope,
                results: searchResults,
                total: filteredResults.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Search error: ${error.message}. Note: Search may require GitLab Premium.`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("GitLab Docusaurus MCP Server running on stdio");
  }
}

const server = new GitLabDocusaurusMCP();
server.run().catch(console.error);
