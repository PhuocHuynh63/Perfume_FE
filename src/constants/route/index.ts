const AUTH = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    UNAUTHORIZED: '/unauthorized',
    LOGOUT: '/logout',
};

const PUBLIC = {
    NOT_FOUND: '*',
    HOME: '/',
    DETAILPRODUCT: '/detail-product/:id',
    CATEGORY: '/category',
    PROFILE: '/profile',
}

const ADMIN = {
    DASHBOARD: '/admin',
};

const ROLE = {
    ADMIN: "admin",
    INSTRUCTOR: "instructor",
    STUDENT: "student",
};

export const ROUTES = {
    AUTH,
    PUBLIC,
    ADMIN,
    ROLE,
};

