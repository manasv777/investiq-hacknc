# Contributing to InvestIQ Voice

Thank you for your interest in contributing to InvestIQ Voice! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/investiq-voice.git
   cd investiq-voice
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys (optional - works with mocks)
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm run build  # Check for TypeScript errors
   npm run test   # Run E2E tests
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for test additions/changes
   - `chore:` for maintenance tasks

5. **Push and create a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Use functional components with hooks
- **Formatting**: Follow existing Tailwind CSS patterns
- **Accessibility**: Always include ARIA labels and semantic HTML
- **Comments**: Explain "why", not "what"

## Accessibility Guidelines

All contributions must maintain WCAG AA compliance:

- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Keyboard navigation for all interactive elements
- ✅ ARIA labels for icons and buttons
- ✅ Focus visible states
- ✅ Semantic HTML (headings, landmarks, etc.)
- ✅ Alt text for images
- ✅ Skip links for navigation

## Testing

- **E2E Tests**: Use Playwright for user flow testing
- **Manual Testing**: Test with keyboard-only navigation
- **Screen Reader Testing**: Test with VoiceOver (Mac) or NVDA (Windows)
- **Mobile Testing**: Test responsive design on mobile devices

## What to Contribute

### High Priority
- Real Snowflake Cortex integration
- Real ElevenLabs streaming TTS
- Production-ready ID verification (Stripe Identity, etc.)
- Multi-language support
- Additional investment terms in glossary

### Medium Priority
- Risk assessment questionnaire integration
- Email notifications
- PDF export for presentation deck
- Additional onboarding step validations
- Performance optimizations

### Low Priority
- Dark mode support
- Additional auth providers
- Advanced analytics features
- Custom themes

## Bug Reports

When reporting bugs, include:
1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots/videos if applicable
6. Browser and OS version
7. Console errors

## Feature Requests

When requesting features:
1. Clear description of the feature
2. Use case and benefits
3. Proposed implementation (optional)
4. Design mockups (optional)

## Questions?

- Open a GitHub issue for questions
- Review existing issues and discussions
- Check the README for documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers learn
- Focus on what's best for the community

Thank you for contributing to InvestIQ Voice! 🚀


