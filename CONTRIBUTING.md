# Contributing to GitLab Docusaurus MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear title**: Describe the issue briefly
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: How to reproduce the issue
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: OS, Node.js version, GitLab version
7. **Logs**: Any relevant error messages or logs

**Example:**
```
Title: Error reading files with special characters

Description: Files with spaces in names cannot be read

Steps to reproduce:
1. Create file "my doc.md" in GitLab
2. Try to read with read_doc tool
3. Error occurs

Expected: File content is returned
Actual: Error: File not found

Environment:
- OS: macOS 13.0
- Node.js: v18.15.0
- GitLab: gitlab.com
```

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:

1. **Use case**: Why is this feature needed?
2. **Description**: What should the feature do?
3. **Examples**: How would it be used?
4. **Alternatives**: Other ways to achieve the same goal

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Test your changes**: Ensure everything works
5. **Commit with clear messages**: Describe what and why
6. **Push to your fork**: `git push origin feature/my-feature`
7. **Open a pull request**: Explain your changes

## 📝 Coding Guidelines

### JavaScript Style

- Use ES6+ features (const/let, arrow functions, async/await)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors appropriately

**Example:**
```javascript
// Good
async function readFileFromGitLab(projectId, filePath) {
  try {
    const response = await makeGitLabRequest(`/projects/${projectId}/repository/files/${filePath}`);
    return response.content;
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

// Avoid
async function rf(p, f) {
  return await fetch(url).then(r => r.json());
}
```

### Error Handling

- Always catch and handle errors
- Provide clear error messages
- Use appropriate error types
- Don't expose sensitive information in errors

```javascript
// Good
throw new Error("File not found: docs/intro.md");

// Avoid
throw new Error("Error");
```

### Documentation

- Add JSDoc comments for functions
- Update README.md if adding features
- Update relevant documentation files
- Include examples in documentation

```javascript
/**
 * Fetches a file from GitLab repository
 * @param {string} projectId - GitLab project ID
 * @param {string} filePath - Path to file in repository
 * @returns {Promise<string>} File content
 * @throws {Error} If file not found or API error
 */
async function fetchFile(projectId, filePath) {
  // ...
}
```

## 🧪 Testing

### Before Submitting

1. **Run validation**: `npm run validate` (with valid credentials)
2. **Test manually**: Try all affected features
3. **Check for errors**: Ensure no console errors
4. **Test edge cases**: Try invalid inputs
5. **Update tests**: Add tests for new features

### Testing New Features

If you add a new feature:

1. Test with real GitLab repository
2. Test error cases
3. Test with different configurations
4. Document how to test it

## 📚 Documentation

### When to Update Documentation

Update documentation if you:
- Add new features
- Change existing behavior
- Fix bugs that were documented
- Add configuration options

### Which Files to Update

- **README.md**: High-level project information
- **GITLAB_MCP_SETUP.md**: Setup and configuration
- **QUICKSTART.md**: Quick start steps
- **FAQ.md**: Common questions
- **TESTING.md**: Testing procedures
- **IMPLEMENTATION_NOTES.md**: Technical details
- **ARCHITECTURE.md**: System architecture

## 🎯 Areas for Contribution

### High Priority

- **Caching**: Implement caching to reduce API calls
- **Error messages**: Improve error message clarity
- **Performance**: Optimize API calls
- **Tests**: Add automated tests

### Medium Priority

- **Multi-project support**: Access multiple GitLab projects
- **Version support**: Access different branches/tags
- **Advanced search**: Better search functionality
- **Pagination**: Handle large directories

### Low Priority

- **Markdown rendering**: Format markdown output
- **Diff view**: Show changes between versions
- **Statistics**: Usage statistics and monitoring
- **UI**: Web interface for configuration

## 🔧 Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rezacloner1372/rezacloner1372.git
cd rezacloner1372
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your GitLab credentials
```

### 4. Test Your Setup

```bash
npm run validate
```

### 5. Make Changes

Edit the relevant files and test your changes.

### 6. Commit Changes

```bash
git add .
git commit -m "Description of changes"
```

## 🚀 Release Process

(For maintainers)

1. Update version in package.json
2. Update CHANGELOG.md
3. Test thoroughly
4. Create git tag: `git tag v1.x.x`
5. Push tag: `git push --tags`
6. Create GitHub release

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console.log statements left
- [ ] No sensitive data in code
- [ ] Changes are minimal and focused

## 💡 Ideas for Contribution

Not sure what to work on? Here are some ideas:

### Beginner-Friendly

- Fix typos in documentation
- Improve error messages
- Add more examples to docs
- Improve validation script output

### Intermediate

- Add caching layer
- Improve search functionality
- Add pagination support
- Enhance error handling

### Advanced

- Multi-project support
- Performance optimizations
- Advanced search with regex
- Real-time file watching

## 🤔 Questions?

If you have questions about contributing:

1. Check the [FAQ](FAQ.md)
2. Review existing issues
3. Open a new issue with your question
4. Contact: m.rezasaberi01@gmail.com

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (if we create it)
- Mentioned in release notes
- Thanked in the community

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Spam or off-topic discussions
- Publishing others' private information

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🎉 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make this project better!

---

**Happy Contributing!** 🚀
