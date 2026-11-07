export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  auth0Domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  auth0ClientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  auth0Audience: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  apkUrl:
    import.meta.env.VITE_ANDROID_APK_URL ||
    'https://github.com/javieroc/workahomie-android-app/releases/latest/download/app-release.apk',
  mapStyleUrl:
    import.meta.env.VITE_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/positron',
} as const;
