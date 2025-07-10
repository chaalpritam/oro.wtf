# OAuth Setup Guide for Supabase Authentication

This guide will help you set up GitHub and Google OAuth providers for your Supabase project.

## Prerequisites

- A Supabase project (already configured)
- GitHub account (for GitHub OAuth)
- Google Cloud Console account (for Google OAuth)

## 1. GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: `Oro Design System` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Application description**: `Design system builder application`
   - **Authorization callback URL**: `https://qmeakvsvlsxcvacbfzhr.supabase.co/auth/v1/callback`

### Step 2: Get GitHub Credentials

After creating the OAuth app, you'll get:
- **Client ID**: Copy this value
- **Client Secret**: Click "Generate a new client secret" and copy the value

### Step 3: Configure GitHub in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/qmeakvsvlsxcvacbfzhr)
2. Navigate to **Authentication → Providers**
3. Find **GitHub** in the list and click **"Enable"**
4. Enter your GitHub credentials:
   - **Client ID**: Your GitHub OAuth app client ID
   - **Client Secret**: Your GitHub OAuth app client secret
5. Click **"Save"**

### Step 4: Update Environment Variables

Add your GitHub credentials to your `.env` file:

```env
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
```

## 2. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)

### Step 2: Create OAuth 2.0 Credentials

1. In your Google Cloud project, go to **APIs & Services → Credentials**
2. Click **"Create Credentials" → "OAuth 2.0 Client IDs"**
3. Choose **"Web application"** as the application type
4. Fill in the details:
   - **Name**: `Oro Design System` (or your preferred name)
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `http://localhost:3001` (if using different port)
   - **Authorized redirect URIs**:
     - `https://qmeakvsvlsxcvacbfzhr.supabase.co/auth/v1/callback`

### Step 3: Get Google Credentials

After creating the OAuth client, you'll get:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

### Step 4: Configure Google in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/qmeakvsvlsxcvacbfzhr)
2. Navigate to **Authentication → Providers**
3. Find **Google** in the list and click **"Enable"**
4. Enter your Google credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
5. Click **"Save"**

### Step 5: Update Environment Variables

Add your Google credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

## 3. Testing OAuth Authentication

### Step 1: Start the Development Server

```bash
npm run dev
```

### Step 2: Test the Authentication

1. Go to `http://localhost:3000/auth/signin`
2. Click the **GitHub** or **Google** button
3. You should be redirected to the respective OAuth provider
4. After authorization, you'll be redirected back to your app

### Step 3: Verify User Creation

1. After successful OAuth login, check your Supabase dashboard
2. Go to **Authentication → Users**
3. You should see a new user created with the OAuth provider information

## 4. Production Configuration

### Update Redirect URLs for Production

When deploying to production, update the redirect URLs:

**GitHub OAuth App:**
- **Authorization callback URL**: `https://your-domain.com/auth/callback`

**Google OAuth Client:**
- **Authorized JavaScript origins**: `https://your-domain.com`
- **Authorized redirect URIs**: `https://your-domain.com/auth/callback`

### Update Supabase Site URL

1. Go to your Supabase dashboard
2. Navigate to **Authentication → Settings**
3. Update **Site URL** to your production domain
4. Add your production domain to **Additional redirect URLs**

## 5. Troubleshooting

### Common Issues

**1. "Invalid redirect URI" error**
- Make sure the redirect URI in your OAuth app matches exactly
- Check that the protocol (http/https) is correct
- Verify the domain and path are correct

**2. "Client ID not found" error**
- Double-check your Client ID and Client Secret
- Ensure the OAuth app is properly configured
- Verify the credentials are correctly entered in Supabase

**3. "Unauthorized" error after login**
- Check that the user is being created in your database
- Verify Row Level Security (RLS) policies are configured correctly
- Ensure the user has proper permissions

**4. OAuth button not working**
- Check browser console for JavaScript errors
- Verify the auth helpers are properly imported
- Ensure the OAuth provider is enabled in Supabase

### Debug Steps

1. **Check Browser Console**: Look for any JavaScript errors
2. **Check Network Tab**: Verify OAuth requests are being made
3. **Check Supabase Logs**: Go to **Logs** in your Supabase dashboard
4. **Test with curl**: Use curl to test the OAuth flow manually

## 6. Security Best Practices

### Environment Variables
- Never commit OAuth secrets to version control
- Use environment variables for all sensitive data
- Rotate secrets regularly

### Redirect URIs
- Use HTTPS in production
- Limit redirect URIs to your domains only
- Avoid wildcard redirect URIs

### User Data
- Only request necessary scopes from OAuth providers
- Validate user data before storing
- Implement proper error handling

## 7. Additional Configuration

### Custom Scopes (Optional)

You can request additional scopes from OAuth providers:

**GitHub:**
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'read:user user:email',
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

**Google:**
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'openid email profile',
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### User Profile Data

After OAuth login, user data is available in the session:

```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
console.log('Email:', user.email);
console.log('Name:', user.user_metadata?.name);
console.log('Avatar:', user.user_metadata?.avatar_url);
```

## 8. Support

If you encounter issues:

1. Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review the [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
3. Check the [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
4. Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)

---

**Note**: Keep your OAuth credentials secure and never share them publicly. If you accidentally expose them, regenerate them immediately. 