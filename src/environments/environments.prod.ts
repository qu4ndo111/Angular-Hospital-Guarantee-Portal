/**
 * Production Environment Configuration
 * Update baseUrl và sensitive data trước khi deploy
 */

export const environment = {
    production: true,

    api: {
        baseUrl: 'https://api.production.com/api', // ⚠️ UPDATE THIS
        timeout: 30000,

        endpoints: {
            auth: {
                login: '/auth/login',
                register: '/auth/register',
                logout: '/auth/logout',
                refreshToken: '/auth/refresh',
                forgotPassword: '/auth/forgot-password',
                resetPassword: '/auth/reset-password',
            },
            user: {
                profile: '/user/profile',
                updateProfile: '/user/profile',
            },
        }
    },

    auth: {
        tokenKey: 'accessToken',
        refreshTokenKey: 'refreshToken',
        userKey: 'currentUser',
        tokenExpiryTime: 60,
        refreshTokenExpiryTime: 10080,
        refreshBeforeExpiry: 5,
    },

    features: {
        enableRegistration: true,
        enableSocialLogin: false,
        enableDarkMode: true,
        enableMultiLanguage: true,
        enableNotifications: true,
        enableFileUpload: true,
    },

    app: {
        name: 'Business Base',
        version: '1.0.0',
        defaultLanguage: 'vi',
        supportedLanguages: ['vi', 'en'],
        pagination: {
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
        },
        dateFormat: 'dd/MM/yyyy',
        dateTimeFormat: 'dd/MM/yyyy HH:mm',
        timeFormat: 'HH:mm',
    },

    services: {
        // Add production API keys here
    },

    debug: {
        enableConsoleLog: false,  // Disable logs in production
        enableApiLogging: false,
    }
};
