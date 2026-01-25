/**
 * TEMPLATE FILE - Copy this to environment.ts and environment.prod.ts
 * Update values based on client requirements
 */

export const environment = {
    production: false,

    // ============================================
    // API Configuration
    // ============================================
    // Update này khi client cung cấp backend URL
    api: {
        baseUrl: 'http://localhost:3000/api', // Client's API endpoint
        timeout: 30000, // Request timeout in ms

        // Endpoints - Customize theo API của client
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
            // Thêm endpoints theo requirements
        }
    },

    // ============================================
    // Authentication Configuration
    // ============================================
    auth: {
        // Storage keys
        tokenKey: 'accessToken',
        refreshTokenKey: 'refreshToken',
        userKey: 'currentUser',

        // Token expiry (minutes)
        tokenExpiryTime: 60,
        refreshTokenExpiryTime: 10080, // 7 days

        // Auto refresh token trước khi hết hạn (minutes)
        refreshBeforeExpiry: 5,
    },

    // ============================================
    // Feature Flags
    // ============================================
    // Enable/disable features dựa trên requirements
    features: {
        enableRegistration: true,
        enableSocialLogin: false,
        enableDarkMode: true,
        enableMultiLanguage: true,
        enableNotifications: true,
        enableFileUpload: true,
    },

    // ============================================
    // Application Settings
    // ============================================
    app: {
        name: 'Business Application', // Client's app name
        version: '1.0.0',
        defaultLanguage: 'vi',
        supportedLanguages: ['vi', 'en'],

        // Pagination defaults
        pagination: {
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
        },

        // Date/Time formats
        dateFormat: 'dd/MM/yyyy',
        dateTimeFormat: 'dd/MM/yyyy HH:mm',
        timeFormat: 'HH:mm',
    },

    // ============================================
    // Third-party Services (Optional)
    // ============================================
    // Chỉ thêm khi client yêu cầu
    services: {
        googleMapsApiKey: '',
        firebaseConfig: {
            apiKey: '',
            authDomain: '',
            projectId: '',
            // ...
        },
        // Thêm services khác nếu cần
    },

    // ============================================
    // Debug & Development
    // ============================================
    debug: {
        enableConsoleLog: true,
        enableApiLogging: true,
    }
};
