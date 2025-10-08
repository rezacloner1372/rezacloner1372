# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-08

### Added

#### Core Features
- Initial release of GitLab Docusaurus MCP Server
- MCP server implementation using @modelcontextprotocol/sdk
- GitLab API integration for reading repository files
- Support for stdio transport communication

#### Tools
- `list_docs` - List documentation files in docs/ directory
- `list_blog_posts` - List blog posts in blog/ directory
- `read_doc` - Read specific documentation file
- `read_blog_post` - Read specific blog post
- `search_docs` - Search across documentation and blog content

#### Configuration
- Environment variable configuration support
- Support for custom GitLab instances (self-hosted)
- Configurable branch selection
- `.env.example` template file
- Example Claude Desktop configuration

#### Documentation
- Comprehensive setup guide (GITLAB_MCP_SETUP.md)
- Quick start guide (QUICKSTART.md)
- Frequently asked questions (FAQ.md)
- Architecture documentation (ARCHITECTURE.md)
- Implementation notes (IMPLEMENTATION_NOTES.md)
- Testing guide (TESTING.md)
- Contributing guidelines (CONTRIBUTING.md)
- MIT License

#### Tools & Utilities
- Configuration validation script (validate-config.js)
- npm scripts for running and validating

#### Security
- Token-based authentication with GitLab
- Environment variable storage for credentials
- Read-only API access
- HTTPS-only communication

### Technical Details
- Node.js 18.0.0+ support
- ES modules (ESM) support
- Async/await API design
- Comprehensive error handling
- Base64 decoding for file content

### Known Limitations
- Search functionality requires GitLab Premium (API limitation)
- No caching implemented (all requests go to GitLab API)
- Single project support (one server per project)
- No pagination for large directories
- Text files only (no binary file support)

---

## [Unreleased]

### Planned Features
- Caching layer to reduce API calls
- Multi-project support
- Pagination for large directories
- Support for accessing different versions/tags
- Enhanced search functionality
- Performance optimizations
- Markdown rendering
- Automated tests

---

## Version History

- **1.0.0** (2024-10-08) - Initial release

---

## How to Use This Changelog

### For Users
- Check this file to see what's new in each version
- Review breaking changes before upgrading
- See what features are planned

### For Contributors
- Add entries for your changes under [Unreleased]
- Follow the format: `- Added/Changed/Fixed/Removed: Description`
- Include issue/PR numbers when applicable

### Categories
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

[1.0.0]: https://github.com/rezacloner1372/rezacloner1372/releases/tag/v1.0.0
[Unreleased]: https://github.com/rezacloner1372/rezacloner1372/compare/v1.0.0...HEAD
