## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📝 Documentation update
- [ ] 🌍 Translation/Localization
- [ ] 🎨 UI/UX improvement
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix

## Related Issues

<!-- Link related issues using #issue_number -->

Closes #
Related to #

## Changes Made

<!-- Describe the changes in detail -->

- 
- 
- 

## Testing

### How Has This Been Tested?

<!-- Describe the tests you ran -->

- [ ] Manual testing on desktop
- [ ] Manual testing on mobile
- [ ] Tested on multiple browsers (list them):
- [ ] Tested with multiple languages (list them):
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated

### Test Coverage

<!-- Describe which areas of the app were tested -->

**Pages/Routes tested:**
- 

**User flows tested:**
- 

**Languages tested:**
- 

## Screenshots/Videos

<!-- If applicable, add screenshots or videos to demonstrate the changes -->

### Before
<!-- Add before screenshots/videos if applicable -->

### After
<!-- Add after screenshots/videos -->

## Localization Checklist

<!-- If your changes affect user-facing content -->

- [ ] All user-facing text uses translation keys (no hardcoded strings)
- [ ] Translation keys added to `messages/en.json`
- [ ] Translations added for all supported languages OR marked as TODO
- [ ] Tested with RTL languages (Arabic) if layout changes were made
- [ ] Cultural themes respected (colors, patterns from `lib/languages.ts`)

## Mobile Responsiveness

<!-- If your changes affect the UI -->

- [ ] Tested on mobile devices (phone)
- [ ] Tested on tablets
- [ ] Uses mobile-first responsive design patterns
- [ ] Touch-friendly interface (buttons, links are adequate size)
- [ ] No horizontal scrolling on mobile

## Code Quality Checklist

- [ ] My code follows the project's coding conventions
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings or errors
- [ ] TypeScript types are properly defined (no `any` types)
- [ ] No console.log statements left in production code

## Database Changes

<!-- If applicable -->

- [ ] Database schema changes are backward compatible
- [ ] Migration script provided (if needed)
- [ ] `dbConnect()` called before all database operations
- [ ] Proper error handling for database operations

## Security Considerations

- [ ] No sensitive data exposed in logs or error messages
- [ ] User input is properly validated and sanitized
- [ ] Authentication/authorization properly implemented (if applicable)
- [ ] Environment variables used for secrets (not hardcoded)
- [ ] CORS settings reviewed (if API changes)

## Performance Impact

- [ ] No significant performance degradation
- [ ] Images optimized (if applicable)
- [ ] Lazy loading implemented where appropriate
- [ ] Database queries optimized (no N+1 queries)

## Deployment Notes

<!-- Any special instructions for deployment? -->

- [ ] Environment variables need to be updated
- [ ] Database migration required
- [ ] External service configuration needed
- [ ] Cache needs to be cleared

**Special deployment instructions:**


## Documentation Updates

- [ ] README.md updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Comments/inline documentation added
- [ ] DEPLOYMENT.md updated (if needed)

## Additional Notes

<!-- Any additional information that reviewers should know -->


---

## Reviewer Checklist

<!-- For reviewers -->

- [ ] Code follows project conventions and style
- [ ] Changes are well-tested
- [ ] No security vulnerabilities introduced
- [ ] Mobile responsiveness verified
- [ ] Translations are appropriate and accurate
- [ ] No breaking changes without proper documentation
- [ ] Performance impact is acceptable
