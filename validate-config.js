#!/usr/bin/env node

/**
 * Configuration Validation Script
 * 
 * This script validates your GitLab MCP server configuration
 * before you use it with Claude Desktop or other MCP clients.
 * 
 * Usage:
 *   node validate-config.js
 * 
 * Or with environment variables:
 *   GITLAB_TOKEN=xxx GITLAB_PROJECT_ID=123 node validate-config.js
 */

import fetch from "node-fetch";

// ANSI color codes for pretty output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, "green");
}

function error(message) {
  log(`✗ ${message}`, "red");
}

function warning(message) {
  log(`⚠ ${message}`, "yellow");
}

function info(message) {
  log(`ℹ ${message}`, "cyan");
}

async function validateConfiguration() {
  log("\n=== GitLab MCP Server Configuration Validator ===\n", "blue");

  let hasErrors = false;

  // 1. Check Node.js version
  info("Checking Node.js version...");
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
  
  if (majorVersion >= 18) {
    success(`Node.js version: ${nodeVersion} (✓ >= 18.0.0)`);
  } else {
    error(`Node.js version: ${nodeVersion} (✗ requires >= 18.0.0)`);
    hasErrors = true;
  }

  // 2. Check environment variables
  info("\nChecking environment variables...");
  
  const GITLAB_URL = process.env.GITLAB_URL || "https://gitlab.com";
  const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
  const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
  const GITLAB_BRANCH = process.env.GITLAB_BRANCH || "main";

  success(`GITLAB_URL: ${GITLAB_URL}`);

  if (GITLAB_TOKEN) {
    success(`GITLAB_TOKEN: Set (${GITLAB_TOKEN.substring(0, 10)}...)`);
  } else {
    error("GITLAB_TOKEN: Not set (required)");
    hasErrors = true;
  }

  if (GITLAB_PROJECT_ID) {
    success(`GITLAB_PROJECT_ID: ${GITLAB_PROJECT_ID}`);
  } else {
    error("GITLAB_PROJECT_ID: Not set (required)");
    hasErrors = true;
  }

  success(`GITLAB_BRANCH: ${GITLAB_BRANCH}`);

  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    error("\n✗ Configuration incomplete. Please set required environment variables.");
    log("\nExample:", "yellow");
    log("  export GITLAB_TOKEN=your_token_here", "yellow");
    log("  export GITLAB_PROJECT_ID=12345678", "yellow");
    log("  node validate-config.js\n", "yellow");
    process.exit(1);
  }

  // 3. Test GitLab API connectivity
  info("\nTesting GitLab API connectivity...");

  try {
    const response = await fetch(`${GITLAB_URL}/api/v4/projects/${GITLAB_PROJECT_ID}`, {
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
      },
    });

    if (response.ok) {
      const project = await response.json();
      success(`Successfully connected to GitLab`);
      success(`Project: ${project.name} (${project.path_with_namespace})`);
      success(`Default branch: ${project.default_branch}`);
      
      if (project.visibility !== "private") {
        info(`Project visibility: ${project.visibility}`);
      }
    } else {
      error(`GitLab API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        error("Authentication failed. Check your GITLAB_TOKEN.");
      } else if (response.status === 404) {
        error("Project not found. Check your GITLAB_PROJECT_ID.");
      }
      
      hasErrors = true;
    }
  } catch (err) {
    error(`Connection failed: ${err.message}`);
    hasErrors = true;
  }

  // 4. Check for docs directory
  if (!hasErrors) {
    info("\nChecking for documentation directories...");

    try {
      const docsResponse = await fetch(
        `${GITLAB_URL}/api/v4/projects/${GITLAB_PROJECT_ID}/repository/tree?path=docs&ref=${GITLAB_BRANCH}`,
        {
          headers: {
            "PRIVATE-TOKEN": GITLAB_TOKEN,
          },
        }
      );

      if (docsResponse.ok) {
        const docs = await docsResponse.json();
        if (docs.length > 0) {
          success(`Found docs/ directory with ${docs.length} items`);
        } else {
          warning("docs/ directory is empty");
        }
      } else if (docsResponse.status === 404) {
        warning("docs/ directory not found (optional)");
      }
    } catch (err) {
      warning(`Could not check docs/ directory: ${err.message}`);
    }

    try {
      const blogResponse = await fetch(
        `${GITLAB_URL}/api/v4/projects/${GITLAB_PROJECT_ID}/repository/tree?path=blog&ref=${GITLAB_BRANCH}`,
        {
          headers: {
            "PRIVATE-TOKEN": GITLAB_TOKEN,
          },
        }
      );

      if (blogResponse.ok) {
        const blog = await blogResponse.json();
        if (blog.length > 0) {
          success(`Found blog/ directory with ${blog.length} items`);
        } else {
          warning("blog/ directory is empty");
        }
      } else if (blogResponse.status === 404) {
        warning("blog/ directory not found (optional)");
      }
    } catch (err) {
      warning(`Could not check blog/ directory: ${err.message}`);
    }
  }

  // 5. Summary
  log("\n=== Validation Summary ===\n", "blue");

  if (hasErrors) {
    error("Configuration validation failed. Please fix the errors above.");
    log("\nFor help, see:", "yellow");
    log("  - QUICKSTART.md", "yellow");
    log("  - GITLAB_MCP_SETUP.md", "yellow");
    log("  - FAQ.md\n", "yellow");
    process.exit(1);
  } else {
    success("All checks passed! Your configuration is valid.");
    log("\nNext steps:", "cyan");
    log("  1. Configure your MCP client (e.g., Claude Desktop)", "cyan");
    log("  2. Copy claude_desktop_config.example.json and customize it", "cyan");
    log("  3. Restart your MCP client", "cyan");
    log("  4. Start using the GitLab Docusaurus MCP server!\n", "cyan");
    
    log("Example Claude Desktop config:", "yellow");
    log(JSON.stringify({
      mcpServers: {
        "gitlab-docusaurus": {
          command: "node",
          args: ["/absolute/path/to/index.js"],
          env: {
            GITLAB_URL,
            GITLAB_TOKEN: "your_token_here",
            GITLAB_PROJECT_ID,
            GITLAB_BRANCH,
          },
        },
      },
    }, null, 2), "yellow");
    log("");
  }
}

// Run validation
validateConfiguration().catch((err) => {
  error(`\nUnexpected error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
