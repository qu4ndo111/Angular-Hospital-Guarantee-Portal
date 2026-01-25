/**
 * Development Environment Configuration
 * Copy from environment.template.ts và customize
 */

export const environment = {
    production: false,

    api: {
        baseUrl: 'http://localhost:3000/api',
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

    services: {},

    debug: {
        enableConsoleLog: true,
        enableApiLogging: true,
    }
};
