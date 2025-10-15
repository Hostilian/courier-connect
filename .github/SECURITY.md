# Security Policy

## Keeping Courier Connect Safe

We take security seriously because we're handling real deliveries and real people's information.

## 🔒 Reporting Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security issue:

1. **Email us privately** (or open a private security advisory on GitHub)
2. **Describe the issue** clearly
3. **Include steps to reproduce** if possible
4. **Wait for our response** before disclosing publicly

We'll respond as quickly as possible and work with you to address the issue.

## ✅ What We Protect

- User account information
- Delivery details and locations
- Payment information
- Email addresses and phone numbers

## 🛡️ Best Practices

When deploying Courier Connect:

### Required
- Use strong `JWT_SECRET` (at least 32 random characters)
- Enable HTTPS in production
- Keep dependencies updated
- Use secure MongoDB connection strings
- Don't commit API keys or secrets to Git

### Recommended
- Set up rate limiting on your hosting
- Enable MongoDB authentication
- Use environment-specific API keys
- Monitor your logs for suspicious activity
- Set up automated security scans

## 🔄 Updates

When we fix security issues:
- We'll patch the code quickly
- We'll release an update
- We'll document what was fixed (after the fix is deployed)
- We'll credit reporters (if they wish)

## 📞 Contact

For security concerns, please contact the project maintainers through GitHub's private security advisory feature or email.

---

**Thank you for helping keep Courier Connect safe for everyone!** 🙏
