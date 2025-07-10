# OAuth Quick Reference

## 🔑 Required Environment Variables

```env
# GitHub OAuth
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 🔗 Redirect URLs

### Development
- **GitHub**: `https://qmeakvsvlsxcvacbfzhr.supabase.co/auth/v1/callback`
- **Google**: `https://qmeakvsvlsxcvacbfzhr.supabase.co/auth/v1/callback`

### Production
- **GitHub**: `https://your-domain.com/auth/callback`
- **Google**: `https://your-domain.com/auth/callback`

## 📋 Setup Checklist

### GitHub OAuth
- [ ] Create GitHub OAuth App at https://github.com/settings/developers
- [ ] Set redirect URL to Supabase callback
- [ ] Copy Client ID and Client Secret
- [ ] Enable GitHub provider in Supabase dashboard
- [ ] Add credentials to `.env` file

### Google OAuth
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Set redirect URL to Supabase callback
- [ ] Copy Client ID and Client Secret
- [ ] Enable Google provider in Supabase dashboard
- [ ] Add credentials to `.env` file

## 🧪 Testing

1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/auth/signin`
3. Click GitHub/Google buttons
4. Verify user creation in Supabase dashboard

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid redirect URI" | Check redirect URL matches exactly |
| "Client ID not found" | Verify credentials in Supabase dashboard |
| "Unauthorized" after login | Check RLS policies and user creation |
| OAuth button not working | Check browser console for errors |

## 📞 Support Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2) 