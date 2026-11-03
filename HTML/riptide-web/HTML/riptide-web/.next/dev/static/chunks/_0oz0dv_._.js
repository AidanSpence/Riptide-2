(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/accounts-popup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function AccountPopup({ isActive, onClose }) {
    _s();
    const { accessToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccountPopup.useEffect": ()=>{
            if (!accessToken) return;
            async function loadUsername() {
                try {
                    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUser"])(accessToken);
                    setUsername(user.username);
                } catch (error) {
                    console.error("Failed to retrieve username:", error);
                }
            }
            loadUsername();
        }
    }["AccountPopup.useEffect"], [
        accessToken
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "account-dialog",
        className: `account_main${isActive ? ' is_active' : ''}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Account",
        "aria-hidden": !isActive,
        inert: !isActive,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "title_bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "riptide-logo.svg",
                        alt: "alt",
                        width: 48,
                        height: 48
                    }, void 0, false, {
                        fileName: "[project]/components/accounts-popup.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "account_close_button",
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close account popup",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/components/accounts-popup.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/accounts-popup.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "account_info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "username",
                        children: [
                            "Username: ",
                            accessToken ? username : "Not Logged in"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/accounts-popup.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "spotify_signin",
                                children: "Sign in with Spotify"
                            }, void 0, false, {
                                fileName: "[project]/components/accounts-popup.tsx",
                                lineNumber: 58,
                                columnNumber: 19
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/accounts-popup.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "spotify_signout",
                                children: "Sign out of Spotify"
                            }, void 0, false, {
                                fileName: "[project]/components/accounts-popup.tsx",
                                lineNumber: 59,
                                columnNumber: 19
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/accounts-popup.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/accounts-popup.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/accounts-popup.tsx",
        lineNumber: 36,
        columnNumber: 9
    }, this);
}
_s(AccountPopup, "C6eKinC0SGvth1BPkAKU8kc2vYA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = AccountPopup;
var _c;
__turbopack_context__.k.register(_c, "AccountPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [tokens, setTokens] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // clears the login keys when the user logs out
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>setTokens(null)
    }["AuthProvider.useCallback[logout]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            accessToken: tokens?.access ?? null,
            setTokens,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/auth-provider.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "DnBYVcbOe2dhKq4ny9/C3to0I/A=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/login-popup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Login_popup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Login_popup({ isActive, onClose }) {
    _s();
    const [isRegister, setIsRegister] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [authMessage, setAuthMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // access the login keys shared with the main page
    const { accessToken, setTokens, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    function showRegister() {
        setAuthError("");
        setAuthMessage("");
        setIsRegister(true);
    }
    function showLogin() {
        setAuthError("");
        setAuthMessage("");
        setIsRegister(false);
    }
    async function sendRegister(event) {
        // stop the default form reload, even if the passwords don't match
        event.preventDefault();
        if (isSubmitting) return;
        setAuthError("");
        setAuthMessage("");
        if (password !== confirmPassword) {
            setAuthError("Passwords do not match.");
            return;
        }
        setIsSubmitting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["register"])(username, password);
            // account created; switch to login rather than logging in automatically
            setPassword("");
            setConfirmPassword("");
            setIsRegister(false);
            setAuthMessage("Account created. You can now log in.");
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : "Registration failed.");
            console.error("Registration failed:", error);
        } finally{
            setIsSubmitting(false);
        }
    }
    async function sendLogin(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setAuthError("");
        setAuthMessage("");
        try {
            const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["login"])(username, password);
            // store the tokens in memory instead of printing them to the console
            setTokens(tokens);
            setPassword("");
            setConfirmPassword("");
            onClose();
            console.log("Login successful");
        } catch (error) {
            setAuthError("Login failed. Check your username and password.");
            console.error("Login failed:", error);
        } finally{
            setIsSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "login-dialog",
        className: `login_main${isActive ? ' is_active' : ''}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "login-title",
        "aria-hidden": !isActive,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "title_bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "logo_login",
                        src: "riptide-logo.svg",
                        alt: "alt",
                        width: 30,
                        height: 30,
                        loading: "eager"
                    }, void 0, false, {
                        fileName: "[project]/components/login-popup.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close_login_button",
                        type: "button",
                        "aria-label": "Close sign-in dialog",
                        onClick: onClose,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "close_login",
                            src: "close.svg",
                            alt: "",
                            width: 30,
                            height: 30,
                            loading: "eager"
                        }, void 0, false, {
                            fileName: "[project]/components/login-popup.tsx",
                            lineNumber: 110,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/login-popup.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/login-popup.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "left_right_container_login",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: sendLogin,
                        style: {
                            display: isRegister && !accessToken ? "none" : "block"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "left_login",
                            style: {
                                display: isRegister ? "none" : "flex"
                            },
                            children: accessToken ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "login-title",
                                        className: "login_title_left",
                                        children: "Signed in"
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 133,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "logout_button",
                                        type: "button",
                                        onClick: ()=>{
                                            logout();
                                            onClose();
                                        },
                                        children: "Log out"
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 134,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/login-popup.tsx",
                                lineNumber: 131,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "login-title",
                                        className: "login_title_left",
                                        children: "Sign into Riptide"
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "username_box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "username_text",
                                                children: "Username:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/login-popup.tsx",
                                                lineNumber: 143,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "username_input",
                                                id: "username",
                                                name: "username",
                                                type: "text",
                                                autoComplete: "username",
                                                value: username,
                                                onChange: (event)=>setUsername(event.currentTarget.value),
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/login-popup.tsx",
                                                lineNumber: 144,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "password_box",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "password_text",
                                                children: "Password:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/login-popup.tsx",
                                                lineNumber: 158,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "password_input",
                                                id: "password",
                                                name: "password",
                                                type: "password",
                                                value: password,
                                                onChange: (event)=>setPassword(event.currentTarget.value),
                                                autoComplete: "current-password",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/login-popup.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 157,
                                        columnNumber: 17
                                    }, this),
                                    authError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        role: "alert",
                                        children: authError
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 172,
                                        columnNumber: 31
                                    }, this),
                                    authMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        role: "status",
                                        children: authMessage
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 173,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "login_button",
                                        type: "submit",
                                        disabled: isSubmitting,
                                        children: "Login"
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "register_button_box",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "register_button",
                                            type: "button",
                                            onClick: showRegister,
                                            children: "Register"
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 180,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/login-popup.tsx",
                                lineNumber: 139,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/login-popup.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/login-popup.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: sendRegister,
                        style: {
                            display: isRegister && !accessToken ? "block" : "none"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "left_register",
                            style: {
                                display: isRegister && !accessToken ? "flex" : "none"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "register-title",
                                    className: "register_title_left",
                                    children: "Register your account"
                                }, void 0, false, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "new_username_box",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "new_username_text",
                                            children: "Username:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 200,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "new_username_input",
                                            id: "username",
                                            name: "username",
                                            type: "text",
                                            autoComplete: "username",
                                            value: username,
                                            onChange: (event)=>setUsername(event.currentTarget.value),
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 201,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "new_password_box",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "new_password_text",
                                            children: "New Password:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 215,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "new_password_input",
                                            id: "password",
                                            name: "password",
                                            type: "password",
                                            autoComplete: "new-password",
                                            value: password,
                                            onChange: (event)=>setPassword(event.currentTarget.value),
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 216,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 214,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "confirm_new_password_box",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "confirm_password_text",
                                            children: "Confirm Password:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 230,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "confirm_password_input",
                                            id: "confirm_password",
                                            name: "confirm_password",
                                            type: "password",
                                            autoComplete: "new-password",
                                            value: confirmPassword,
                                            onChange: (event)=>setConfirmPassword(event.currentTarget.value),
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/login-popup.tsx",
                                            lineNumber: 231,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 229,
                                    columnNumber: 17
                                }, this),
                                authError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    role: "alert",
                                    children: authError
                                }, void 0, false, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 244,
                                    columnNumber: 31
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "register_submit_button",
                                    type: "submit",
                                    disabled: isSubmitting,
                                    children: "Register"
                                }, void 0, false, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 246,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "return_login_button_box",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "return_login_button",
                                        type: "button",
                                        onClick: showLogin,
                                        children: "Back To Login"
                                    }, void 0, false, {
                                        fileName: "[project]/components/login-popup.tsx",
                                        lineNumber: 252,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/login-popup.tsx",
                                    lineNumber: 251,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/login-popup.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/login-popup.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "right_login",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "title_riptide_login",
                                children: "Riptide"
                            }, void 0, false, {
                                fileName: "[project]/components/login-popup.tsx",
                                lineNumber: 267,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "accent_login",
                                src: "accent.png",
                                alt: "alt",
                                width: 30,
                                height: 30,
                                loading: "eager",
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "[project]/components/login-popup.tsx",
                                lineNumber: 268,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/login-popup.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/login-popup.tsx",
                lineNumber: 122,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/login-popup.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(Login_popup, "hKXRamSDn4k2OWAMn3bsQjlfc8U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Login_popup;
var _c;
__turbopack_context__.k.register(_c, "Login_popup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/main_page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MainPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$playlist$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/playlist-demo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function MainPage() {
    _s();
    // retrieve the login key from the shared auth provider
    const { accessToken, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // declared variables
    // setstate for left box, open = true
    const [leftOpen, setLeftOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // setstate for right box, open = true
    const [rightOpen, setRightOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // this is an array with all of the users/systems message, anything in here is displayed
    const [messageText, setMessageText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // constantly updates this variable to the contents of the message textarea
    const [tempMessageText, setTempMessageText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // this enforces the sendlimit, false is unlocked, true is locked
    const [sendLimit, setSendLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chats, setChats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentChatId, setCurrentChatId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chatError, setChatError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoadingChat, setIsLoadingChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // used to ignore old requests after someone logs out
    const activeTokenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(accessToken);
    const requestPendingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // right panel playlist state, separate from the users chat messages
    const [playlists, setPlaylists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"] ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$playlist$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["demoPlaylists"] : []);
    const [playlistError, setPlaylistError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoadingPlaylists, setIsLoadingPlaylists] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deletingPlaylistId, setDeletingPlaylistId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // negative IDs are temporary for generated playlists not saved by Django
    const nextLocalPlaylistId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(-2);
    // message limit message, sets limit internally to true, and
    // if django returns limit reached, run this and it should lockout interface
    function setLimitMessage() {
        // show an error without saving a made-up system message to postgres
        setChatError("Send limit reached, create a new chat to continue");
        setSendLimit(true);
    }
    // show the actual request error so failed endpoints aren't silent
    function describeChatError(error, action) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"]) {
            if (error.status === 404) {
                return `${action}: HTTP 404. Check that the Django chat endpoints exist.`;
            }
            return `${action}: HTTP ${error.status} - ${error.message}`;
        }
        if (error instanceof TypeError) {
            return `${action}: Cannot contact Django. Check the API URL, server and CORS settings.`;
        }
        return `${action}: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
    // playlist errors use the playlist endpoint rather than the chat endpoint
    function describePlaylistError(error, action) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 404) {
            return `${action}: HTTP 404. Check that the Django playlist endpoints exist.`;
        }
        return describeChatError(error, action);
    }
    function toClientMessage(data) {
        return {
            id: String(data.id),
            text: data.text,
            sender: data.sender
        };
    }
    // load the users saved conversations after the access token becomes available
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainPage.useEffect": ()=>{
            activeTokenRef.current = accessToken;
            // clear the previous account's chats whenever the login changes
            setChats([]);
            setCurrentChatId(null);
            setMessageText([]);
            setTempMessageText("");
            setSendLimit(false);
            setChatError("");
            setIsSending(false);
            setIsLoadingChat(false);
            if (!accessToken) return;
            let cancelled = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listChats"])(accessToken).then({
                "MainPage.useEffect": (result)=>{
                    if (!cancelled) setChats(result.chats);
                }
            }["MainPage.useEffect"]).catch({
                "MainPage.useEffect": (error)=>{
                    if (cancelled) return;
                    console.error("Failed to load chats:", error);
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 401) {
                        logout();
                    } else {
                        setChatError(describeChatError(error, "Unable to load saved conversations"));
                    }
                }
            }["MainPage.useEffect"]);
            return ({
                "MainPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["MainPage.useEffect"];
        }
    }["MainPage.useEffect"], [
        accessToken,
        logout
    ]);
    // load saved playlists after login (demo data is used until Django has an endpoint)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainPage.useEffect": ()=>{
            setPlaylists(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"] ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$playlist$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["demoPlaylists"] : []);
            setPlaylistError("");
            setDeletingPlaylistId(null);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"] || !accessToken) {
                setIsLoadingPlaylists(false);
                return;
            }
            let cancelled = false;
            setIsLoadingPlaylists(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listPlaylists"])(accessToken).then({
                "MainPage.useEffect": (result)=>{
                    if (!cancelled) {
                        // keep any unsaved playlist generated while the request was loading
                        setPlaylists({
                            "MainPage.useEffect": (previous)=>[
                                    ...previous.filter({
                                        "MainPage.useEffect": (item)=>(item.id ?? 0) < 0
                                    }["MainPage.useEffect"]),
                                    ...result
                                ]
                        }["MainPage.useEffect"]);
                    }
                }
            }["MainPage.useEffect"]).catch({
                "MainPage.useEffect": (error)=>{
                    if (cancelled) return;
                    console.error("Failed to load playlists:", error);
                    setPlaylistError(describePlaylistError(error, "Unable to load playlists"));
                }
            }["MainPage.useEffect"]).finally({
                "MainPage.useEffect": ()=>{
                    if (!cancelled) setIsLoadingPlaylists(false);
                }
            }["MainPage.useEffect"]);
            return ({
                "MainPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["MainPage.useEffect"];
        }
    }["MainPage.useEffect"], [
        accessToken
    ]);
    // display the seconds from Django as minutes and seconds
    function formatPlaylistDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainder = Math.floor(seconds % 60);
        return `${minutes}:${String(remainder).padStart(2, "0")}`;
    }
    // remove the playlist from the UI, and from Django if it was saved there
    async function removePlaylist(playlist) {
        if (deletingPlaylistId !== null) return;
        if (!window.confirm(`Delete playlist "${playlist.title}"?`)) return;
        const playlistId = playlist.id;
        if (playlistId === undefined) return;
        setPlaylistError("");
        // previews don't exist in postgres; deleting them only affects this page
        if (playlistId < 0 || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"]) {
            setPlaylists((previous)=>previous.filter((item)=>item.id !== playlistId));
            return;
        }
        if (!accessToken) {
            setPlaylistError("Log in before deleting a saved playlist.");
            return;
        }
        const token = accessToken;
        setDeletingPlaylistId(playlistId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePlaylist"])(token, playlistId);
            if (activeTokenRef.current !== token) return;
            setPlaylists((previous)=>previous.filter((item)=>item.id !== playlistId));
        } catch (error) {
            if (activeTokenRef.current !== token) return;
            console.error("Failed to delete playlist:", error);
            setPlaylistError(describePlaylistError(error, "Unable to delete playlist"));
        } finally{
            if (activeTokenRef.current === token) setDeletingPlaylistId(null);
        }
    }
    // updates the temp variables each time the input field changes
    // which can then be sent to the proper setMessageText field
    function tempChatInput(event) {
        setTempMessageText(event.currentTarget.value);
    // DEBUG
    // const inputID = event.currentTarget.id
    // const inputText = event.currentTarget.value
    // const sender = "user"
    // console.log(inputID)
    // console.log(inputText)
    // console.log(sender)
    }
    ;
    async function saveChatInput() {
        const text = tempMessageText.trim();
        if (!text) return;
        // let the user know why the message wasn't sent rather than doing nothing
        if (!accessToken) {
            setChatError("Log in using the profile button before sending a message.");
            return;
        }
        // django handles the real send limit; the state here locks the button
        if (sendLimit) {
            setLimitMessage();
            return;
        }
        if (isSending || isLoadingChat || requestPendingRef.current) return;
        // prevents duplicate submissions while react is updating its state
        requestPendingRef.current = true;
        const token = accessToken;
        setIsSending(true);
        setChatError("");
        try {
            let chatId = currentChatId;
            // first message: create the conversation automatically if none is selected
            if (chatId === null) {
                const chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChat"])(token);
                if (activeTokenRef.current !== token) return;
                chatId = chat.id;
                setChats((previous)=>[
                        chat,
                        ...previous
                    ]);
                setCurrentChatId(chat.id);
                setMessageText([]);
            }
            // send just the new message to django instead of the full array
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendChatMessage"])(token, chatId, text);
            if (activeTokenRef.current !== token) return;
            // append django's accepted message (with its database id)
            setMessageText((previous)=>[
                    ...previous,
                    toClientMessage(result.message)
                ]);
            // Django can optionally include a new playlist alongside the chat reply
            if (result.playlist) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlaylistData"])(result.playlist)) {
                    const newPlaylist = {
                        ...result.playlist,
                        id: result.playlist.id ?? nextLocalPlaylistId.current--
                    };
                    setPlaylists((previous)=>[
                            newPlaylist,
                            ...previous.filter((item)=>item.id !== newPlaylist.id)
                        ]);
                } else {
                    setPlaylistError("Django returned a playlist in an unexpected format.");
                }
            }
            setTempMessageText("");
            setSendLimit(result.remaining_messages === 0);
            if (result.remaining_messages === 0) {
                setChatError("Send limit reached, create a new chat to continue");
            }
        } catch (error) {
            if (activeTokenRef.current !== token) return;
            console.error("Failed to send message:", error);
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 429) {
                setLimitMessage();
            } else if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 401) {
                logout();
            } else {
                setChatError(describeChatError(error, "Failed to send message"));
            }
        } finally{
            requestPendingRef.current = false;
            if (activeTokenRef.current === token) setIsSending(false);
        }
    }
    async function startNewChat() {
        if (!accessToken || isSending || isLoadingChat) return;
        const token = accessToken;
        setIsLoadingChat(true);
        setChatError("");
        try {
            const chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChat"])(token);
            if (activeTokenRef.current !== token) return;
            if (chats.length >= 3) return;
            // Add the new chat to the sidebar array
            setChats((previous)=>[
                    chat,
                    ...previous
                ]);
            // Select the newly created chat
            setCurrentChatId(chat.id);
            // Clear previous chat messages and input
            setMessageText([]);
            setTempMessageText("");
            // Unlock messaging for the new chat
            setSendLimit(false);
        } catch (error) {
            if (activeTokenRef.current !== token) return;
            console.error("Failed to create chat:", error);
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 401) logout();
            else setChatError(describeChatError(error, "Unable to create conversation"));
        } finally{
            if (activeTokenRef.current === token) setIsLoadingChat(false);
        }
    }
    async function openChat(chatId) {
        if (!accessToken || isSending || isLoadingChat) return;
        const token = accessToken;
        setIsLoadingChat(true);
        setChatError("");
        try {
            const chat = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChat"])(token, chatId);
            if (activeTokenRef.current !== token) return;
            // Select this conversation
            setCurrentChatId(chat.id);
            // Load its messages into the existing array
            setMessageText(chat.messages.map(toClientMessage));
            // Apply Django's message limit
            setSendLimit(chat.remaining_messages === 0);
            setTempMessageText("");
        } catch (error) {
            if (activeTokenRef.current !== token) return;
            console.error("Failed to load chat:", error);
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatApiError"] && error.status === 401) logout();
            else setChatError(describeChatError(error, "Unable to load conversation"));
        } finally{
            if (activeTokenRef.current === token) setIsLoadingChat(false);
        }
    }
    // Page stuff
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page_layout",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `drawer_toggle left_drawer_toggle${leftOpen ? " is_open" : ""}`,
                type: "button",
                "aria-label": leftOpen ? "Close chats panel" : "Open chats panel",
                "aria-controls": "left-drawer",
                "aria-expanded": leftOpen,
                onClick: ()=>setLeftOpen((open)=>!open),
                children: leftOpen ? "<" : ">"
            }, void 0, false, {
                fileName: "[project]/components/main_page.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `left_box${leftOpen ? " is_open" : ""}`,
                id: "left-drawer",
                "aria-hidden": !leftOpen,
                inert: !leftOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "left_chats",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_chat_title",
                                children: "Chats:"
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "new_chat_button",
                                onClick: startNewChat,
                                disabled: !accessToken || isSending || isLoadingChat,
                                children: "New Chat"
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_chat_box_scrolling",
                                children: chats.map((chat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "left_box_sizing left_chat_box_1",
                                        onClick: ()=>openChat(chat.id),
                                        disabled: isSending || isLoadingChat,
                                        children: chat.name
                                    }, chat.id, false, {
                                        fileName: "[project]/components/main_page.tsx",
                                        lineNumber: 410,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "left_linked_playlists",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_playlist_title",
                                children: "Your linked service playlists:"
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_linked_playlists_scrolling",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "left_box_sizing left_playlist_box_1"
                                }, void 0, false, {
                                    fileName: "[project]/components/main_page.tsx",
                                    lineNumber: 429,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 426,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "left_profile_container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_profile_icon_bg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "left_profile_icon_text",
                                    children: "JD"
                                }, void 0, false, {
                                    fileName: "[project]/components/main_page.tsx",
                                    lineNumber: 435,
                                    columnNumber: 49
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "left_profile_info_box",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "left_profile_name",
                                        children: "John Doe"
                                    }, void 0, false, {
                                        fileName: "[project]/components/main_page.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "left_profile_service_state",
                                        children: "Service - Spotify Connectedsdfguiopoigfghj"
                                    }, void 0, false, {
                                        fileName: "[project]/components/main_page.tsx",
                                        lineNumber: 438,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 436,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/main_page.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "center_box",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "center_title_bar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "center_playlist_title",
                                children: [
                                    "Title Placeholder",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "center_playlist_attached_title",
                                        children: "No playlist Attached"
                                    }, void 0, false, {
                                        fileName: "[project]/components/main_page.tsx",
                                        lineNumber: 447,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "center_playlist_privacy_title",
                                children: "Private"
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 450,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "center_chats_container",
                        children: messageText.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: msg.sender === "user" ? "center_box_sizing_user" : "center_box_sizing_system",
                                children: msg.text
                            }, msg.id, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 459,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this),
                    (chatError || isSending || isLoadingChat || !accessToken || currentChatId === null || sendLimit) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: chatError ? "alert" : "status",
                        "aria-live": "polite",
                        style: {
                            padding: "0.25rem 1rem",
                            fontSize: "0.85rem"
                        },
                        children: chatError || (isSending ? "Sending message..." : isLoadingChat ? "Loading conversation..." : !accessToken ? "Log in using the profile button to send messages." : sendLimit ? "Send limit reached, create a new chat to continue." : "Send a message to create a conversation, or select a saved chat.")
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 474,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "center_chats_input_box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "center_chats_input_clickable",
                                id: "user_chat",
                                name: "chat",
                                type: "text",
                                autoComplete: "off",
                                // update the temp variable everytime an input happens
                                value: tempMessageText,
                                onChange: tempChatInput,
                                onKeyDown: (event)=>{
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        void saveChatInput();
                                    }
                                },
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 484,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "center_chats_send_message",
                                onClick: saveChatInput,
                                disabled: sendLimit || isSending || isLoadingChat,
                                "aria-label": isSending ? "Sending message" : "Send message",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "center_send_button_image",
                                    src: "send.svg",
                                    width: 30,
                                    height: 30,
                                    alt: "send button"
                                }, void 0, false, {
                                    fileName: "[project]/components/main_page.tsx",
                                    lineNumber: 509,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 483,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/main_page.tsx",
                lineNumber: 444,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `drawer_toggle right_drawer_toggle${rightOpen ? " is_open" : ""}`,
                type: "button",
                "aria-label": rightOpen ? "Close playlist panel" : "Open playlist panel",
                "aria-controls": "right-drawer",
                "aria-expanded": rightOpen,
                onClick: ()=>setRightOpen((open)=>!open),
                children: rightOpen ? ">" : "<"
            }, void 0, false, {
                fileName: "[project]/components/main_page.tsx",
                lineNumber: 523,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `right_box${rightOpen ? " is_open" : ""}`,
                id: "right-drawer",
                "aria-hidden": !rightOpen,
                inert: !rightOpen,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "playlist_top_bar",
                        children: "Your Playlists"
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 560,
                        columnNumber: 5
                    }, this),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "right_playlist_status",
                        children: "Demo playlist - changes reset on refresh"
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 564,
                        columnNumber: 7
                    }, this),
                    playlistError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "right_playlist_status",
                        role: "alert",
                        children: playlistError
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 567,
                        columnNumber: 7
                    }, this),
                    isLoadingPlaylists && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "right_playlist_status",
                        role: "status",
                        children: "Loading playlists..."
                    }, void 0, false, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 570,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "right_all_playlists_container",
                        children: [
                            !isLoadingPlaylists && playlists.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "right_playlist_status",
                                children: !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLAYLIST_DEMO_MODE"] && !accessToken ? "Log in to view your playlists." : "No playlists to display."
                            }, void 0, false, {
                                fileName: "[project]/components/main_page.tsx",
                                lineNumber: 576,
                                columnNumber: 9
                            }, this),
                            playlists.map((playlist)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "right_playlist_layout",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "right_playlist_title_box",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "right_playlist_title_text",
                                                    title: playlist.title,
                                                    children: playlist.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/main_page.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "right_playlist_delete_button",
                                                    type: "button",
                                                    onClick: ()=>void removePlaylist(playlist),
                                                    disabled: deletingPlaylistId !== null,
                                                    "aria-label": `Delete playlist ${playlist.title}`,
                                                    children: deletingPlaylistId === playlist.id ? "Deleting..." : "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/main_page.tsx",
                                                    lineNumber: 589,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/main_page.tsx",
                                            lineNumber: 585,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "right_playlist_song_list",
                                            children: playlist.tracks.map((track, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "right_playlist_song_box",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "right_playlist_song_title",
                                                            title: track.title,
                                                            children: track.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/main_page.tsx",
                                                            lineNumber: 603,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "right_playlist_song_artist",
                                                            title: track.artists,
                                                            children: track.artists
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/main_page.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "right_playlist_song_length",
                                                            children: formatPlaylistDuration(track.duration_s)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/main_page.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, `${track.id}-${index}`, true, {
                                                    fileName: "[project]/components/main_page.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 15
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/main_page.tsx",
                                            lineNumber: 599,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, playlist.id, true, {
                                    fileName: "[project]/components/main_page.tsx",
                                    lineNumber: 584,
                                    columnNumber: 9
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/main_page.tsx",
                        lineNumber: 573,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/main_page.tsx",
                lineNumber: 533,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/main_page.tsx",
        lineNumber: 380,
        columnNumber: 5
    }, this);
}
_s(MainPage, "jT8VXiNbzb+wlLNnKBNnb7uBc+I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = MainPage;
var _c;
__turbopack_context__.k.register(_c, "MainPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/login-popup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$accounts$2d$popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/accounts-popup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Navbar() {
    _s();
    // defines the state of the popup
    const [loginActive, setLoginActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [accountActive, setAccountActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "navbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$login$2d$popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isActive: loginActive,
                // if the onclose, set .is_active to false to hide the popup
                onClose: ()=>setLoginActive(false)
            }, void 0, false, {
                fileName: "[project]/components/navbar.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$accounts$2d$popup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isActive: accountActive,
                onClose: ()=>setAccountActive(false)
            }, void 0, false, {
                fileName: "[project]/components/navbar.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "left_nav",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "nav_logo",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "logo_image",
                        src: "riptide-logo.svg",
                        alt: "logo",
                        width: 32,
                        height: 32,
                        loading: "eager"
                    }, void 0, false, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 27,
                        columnNumber: 43
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/navbar.tsx",
                    lineNumber: 27,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/navbar.tsx",
                lineNumber: 26,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "right_nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "nav_settings",
                        onClick: ()=>{
                            setAccountActive((active)=>!active);
                            setLoginActive(false);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "settings_img",
                            src: "settings.svg",
                            alt: "settings",
                            width: 10,
                            height: 10
                        }, void 0, false, {
                            fileName: "[project]/components/navbar.tsx",
                            lineNumber: 38,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 32,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "button_border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "nav_profile_border",
                            onClick: ()=>{
                                setAccountActive(false);
                                setLoginActive((active)=>!active);
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "nav_profile",
                                children: "JD"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 47,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/navbar.tsx",
                            lineNumber: 42,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/navbar.tsx",
                lineNumber: 30,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/navbar.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
_s(Navbar, "pBXRDbeWC2NuIQUct571TMZqYFw=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatApiError",
    ()=>ChatApiError,
    "PLAYLIST_DEMO_MODE",
    ()=>PLAYLIST_DEMO_MODE,
    "createChat",
    ()=>createChat,
    "deletePlaylist",
    ()=>deletePlaylist,
    "getChat",
    ()=>getChat,
    "getCurrentUser",
    ()=>getCurrentUser,
    "isPlaylistData",
    ()=>isPlaylistData,
    "listChats",
    ()=>listChats,
    "listPlaylists",
    ()=>listPlaylists,
    "login",
    ()=>login,
    "register",
    ()=>register,
    "sendChatMessage",
    ()=>sendChatMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// used by the static frontend at build time; localhost remains the dev fallback
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:9000';
const LOGIN_ENDPOINT = '/api/login/';
const REGISTER_ENDPOINT = '/api/signup/';
const PLAYLIST_DEMO_MODE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PLAYLIST_MODE !== "api";
async function getCurrentUser(accessToken) {
    return authRequest("/api/me/", accessToken);
}
function isPlaylistData(value) {
    if (!value || typeof value !== "object") return false;
    const playlist = value;
    return (playlist.id === undefined || typeof playlist.id === "number" && Number.isInteger(playlist.id)) && typeof playlist.title === "string" && Array.isArray(playlist.tracks) && playlist.tracks.every((track)=>!!track && typeof track === "object" && typeof track.id === "number" && typeof track.title === "string" && typeof track.artists === "string" && typeof track.duration_s === "number");
}
class ChatApiError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
        this.name = "ChatApiError";
    }
}
async function authRequest(endpoint, accessToken, options = {}) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    if (options.body != null) {
        headers.set("Content-Type", "application/json");
    }
    const response = await fetch(`${API_URL.replace(/\/+$/, "")}${endpoint}`, {
        ...options,
        headers
    });
    const data = await response.json().catch(()=>null);
    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        if (data && typeof data === "object") {
            const errorData = data;
            message = errorData.error ?? errorData.detail ?? message;
        }
        throw new ChatApiError(response.status, message);
    }
    if (data === null) {
        throw new Error("API returned no valid JSON");
    }
    return data;
}
async function listChats(accessToken) {
    const result = await authRequest("/api/chats/", accessToken);
    // accepts either a wrapped response or a plain list from django
    const chats = Array.isArray(result) ? result : result?.chats;
    if (!Array.isArray(chats)) {
        throw new Error("Django returned an unexpected chat list. Expected { chats: [...] }.");
    }
    return {
        chats
    };
}
async function createChat(accessToken, name = "Awaiting Name") {
    const chat = await authRequest("/api/chats/", accessToken, {
        method: "POST",
        body: JSON.stringify({
            name
        })
    });
    // the frontend needs the database id to submit messages to this chat
    if (!chat || typeof chat.id !== "number") {
        throw new Error("Django created a chat but did not return a numeric chat id.");
    }
    return chat;
}
async function getChat(accessToken, chatId) {
    const chat = await authRequest(`/api/chats/${chatId}/`, accessToken);
    if (!chat || !Array.isArray(chat.messages) || typeof chat.remaining_messages !== "number") {
        throw new Error("Django returned an unexpected chat detail. Expected 'messages' and 'remaining_messages'.");
    }
    return chat;
}
async function sendChatMessage(accessToken, chatId, text) {
    const result = await authRequest(`/api/chats/${chatId}/messages/`, accessToken, {
        method: "POST",
        body: JSON.stringify({
            text
        })
    });
    // catch unexpected API response shapes rather than failing silently in React
    if (!result || !result.message || typeof result.message.text !== "string" || typeof result.message.id !== "number" || typeof result.remaining_messages !== "number") {
        throw new Error("Django returned an unexpected message response. Expected 'message' and 'remaining_messages'.");
    }
    return result;
}
async function login(username, password) {
    const toSend = {
        username,
        password
    };
    const response = await fetch(API_URL + LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)
    });
    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
async function register(username, password) {
    const toSend = {
        username,
        password
    };
    const response = await fetch(API_URL + REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)
    });
    if (!response.ok) {
        // Django may return JSON validation errors, or HTML for a server error
        const errorData = await response.json().catch(()=>null);
        let message = `Registration failed: ${response.status}`;
        if (errorData && typeof errorData === "object") {
            const parts = Object.entries(errorData).flatMap(([field, value])=>{
                if (Array.isArray(value)) return value.map((item)=>`${field}: ${String(item)}`);
                if (typeof value === "string") return [
                    `${field}: ${value}`
                ];
                return [];
            });
            if (parts.length > 0) message = parts.join("; ");
        }
        throw new Error(message);
    }
    const data = await response.json();
    return data;
}
async function listPlaylists(accessToken) {
    const result = await authRequest("/api/playlists/", accessToken);
    let playlists;
    if (Array.isArray(result)) {
        playlists = result;
    } else if (result && typeof result === "object" && "playlists" in result) {
        playlists = result.playlists;
    } else {
        playlists = [
            result
        ]; // also accepts a single playlist object
    }
    if (!Array.isArray(playlists) || !playlists.every(isPlaylistData)) {
        throw new Error("Django returned invalid playlist data. Check title, tracks, artists and duration_s.");
    }
    // saved playlists need a database id so DELETE can identify the correct one
    if (playlists.some((playlist)=>typeof playlist.id !== "number" || playlist.id <= 0)) {
        throw new Error("Saved playlists returned by Django need a positive numeric playlist id.");
    }
    return playlists;
}
async function deletePlaylist(accessToken, playlistId) {
    const response = await fetch(`${API_URL.replace(/\/+$/, "")}/api/playlists/${playlistId}/`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (!response.ok) {
        const data = await response.json().catch(()=>null);
        let message = `HTTP ${response.status}`;
        if (data && typeof data === "object") {
            const error = data;
            message = error.error ?? error.detail ?? message;
        }
        throw new ChatApiError(response.status, message);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/playlist-demo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// temporary playlist data for testing the right panel without a Django endpoint
// id -1 is local only; real Django playlists should have a positive database id
__turbopack_context__.s([
    "demoPlaylists",
    ()=>demoPlaylists
]);
const demoPlaylists = [
    {
        "id": -1,
        "title": "Fun Car Ride",
        "message": "Get ready to hit the road with this fun and energetic playlist!",
        "description": "A fun and energetic car playlist to make driving more enjoyable.",
        "tracks": [
            {
                "id": 52934,
                "title": "Sabor (with Lee Wilson & ALT3N)",
                "artists": "GENNARO, Lee Wilson, ALT3N",
                "duration_s": 198,
                "spotify_track_id": "2DG8LH2I3Ln2uuR02n6y7i"
            },
            {
                "id": 41508,
                "title": "Bi-Coastal",
                "artists": "Peter Allen",
                "duration_s": 261,
                "spotify_track_id": "1JFt7RvlIgRrTs4dXYbw0o"
            },
            {
                "id": 54766,
                "title": "The Way I Feel",
                "artists": "Adrian Gurvitz",
                "duration_s": 317,
                "spotify_track_id": "1IVQChlDHjyiWkbZwbbUky"
            },
            {
                "id": 51640,
                "title": "Perla",
                "artists": "Cherry Chola, Chico Sonido",
                "duration_s": 184,
                "spotify_track_id": "3AS7Y4Oh1tgy8x7w3C35Dm"
            },
            {
                "id": 43626,
                "title": "I'm Coming Out - Original CHIC Mix",
                "artists": "Diana Ross",
                "duration_s": 360,
                "spotify_track_id": "1HoZjhl0cjWU3MfUMCc8cl"
            },
            {
                "id": 51155,
                "title": "Sing Hallelujah!",
                "artists": "Dr. Alban",
                "duration_s": 240,
                "spotify_track_id": "2qjDNbgLzfBpCvDwfw11Qg"
            },
            {
                "id": 50994,
                "title": "Don't Stop 'Til You Get Enough",
                "artists": "Michael Jackson",
                "duration_s": 364,
                "spotify_track_id": "46eu3SBuFCXWsPT39Yg3tJ"
            },
            {
                "id": 46110,
                "title": "The Power Of Love",
                "artists": "Huey Lewis & The News",
                "duration_s": 234,
                "spotify_track_id": "2olVm1lHicpveMAo4AUDRB"
            },
            {
                "id": 52371,
                "title": "Brother Louie",
                "artists": "Modern Talking",
                "duration_s": 222,
                "spotify_track_id": "5zWZ9iNevP0397xB3jWV2z"
            },
            {
                "id": 54129,
                "title": "Wannabe",
                "artists": "Spice Girls",
                "duration_s": 173,
                "spotify_track_id": "1Je1IMUlBXcx1Fz0WE7oPT"
            },
            {
                "id": 51596,
                "title": "PEACEKEEPER",
                "artists": "Baker Boy",
                "duration_s": 177,
                "spotify_track_id": "3FkW4IK2pJAo88d2Dzbjg7"
            },
            {
                "id": 58937,
                "title": "Zou bisou bisou",
                "artists": "Mathieu Koss, Gillian Hills",
                "duration_s": 147,
                "spotify_track_id": "4GZZ1mX5ijjdO3MwedvgDM"
            },
            {
                "id": 42897,
                "title": "That Don't Impress Me Much",
                "artists": "Shania Twain",
                "duration_s": 238,
                "spotify_track_id": "4I7DV3MIgxJGlObiy9s6nx"
            },
            {
                "id": 42863,
                "title": "Rock the Casbah - Remastered",
                "artists": "The Clash",
                "duration_s": 222,
                "spotify_track_id": "56KqaFSGTb7ifpt16t5Y1N"
            },
            {
                "id": 44274,
                "title": "Easy To Love",
                "artists": "Folamour, Kabusa Oriental Choir",
                "duration_s": 240,
                "spotify_track_id": "7nDdoz7NIXvWArl6a0XhN0"
            },
            {
                "id": 57106,
                "title": "Alright - Remastered 2013",
                "artists": "Jamiroquai",
                "duration_s": 263,
                "spotify_track_id": "2WkHXAVVMgRnBmQ3HYAVla"
            },
            {
                "id": 40351,
                "title": "Another Night",
                "artists": "Real McCoy",
                "duration_s": 236,
                "spotify_track_id": "0gggjVyUJd90tYzAnmBjFV"
            },
            {
                "id": 52517,
                "title": "Sexbomb",
                "artists": "Tom Jones, Mousse T.",
                "duration_s": 211,
                "spotify_track_id": "7GHKA8GIMcND6c5nN1sFnD"
            },
            {
                "id": 48701,
                "title": "Let's Stick Together",
                "artists": "Bryan Ferry",
                "duration_s": 179,
                "spotify_track_id": "6y4FVJwf09ssxuRnlEgXkp"
            },
            {
                "id": 41770,
                "title": "Never Let You Go - 2008 Remaster",
                "artists": "Third Eye Blind",
                "duration_s": 237,
                "spotify_track_id": "1sxUaLi0G2vB7dl4ogtCxH"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0oz0dv_._.js.map