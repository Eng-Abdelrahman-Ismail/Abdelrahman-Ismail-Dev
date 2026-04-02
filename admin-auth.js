import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD00Ggx8AiMItZvAh9hyrGSsJS0hQ_7m6g",
    authDomain: "portfolio-admin-1f678.firebaseapp.com",
    projectId: "portfolio-admin-1f678",
    storageBucket: "portfolio-admin-1f678.firebasestorage.app",
    messagingSenderId: "1004189583502",
    appId: "1:1004189583502:web:824e4ea08ecca9a90fe1df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ADMIN_LOGIN_ALIAS = "Abdelrahman";
const ADMIN_LOGIN_EMAIL = "abdelrahman@portfolio-admin.local";

function getElements() {
    return {
        emailInput: document.getElementById("adminEmail"),
        passwordInput: document.getElementById("adminPassword"),
        loginBtn: document.getElementById("loginBtn"),
        loginError: document.getElementById("cpLoginError"),
        loginSection: document.getElementById("login-section"),
        adminDashboard: document.getElementById("admin-dashboard")
    };
}

function setAdminVisibility(isLoggedIn) {
    const { loginSection, adminDashboard } = getElements();

    if (loginSection) {
        loginSection.style.display = isLoggedIn ? "none" : "block";
    }

    if (adminDashboard) {
        adminDashboard.style.display = isLoggedIn ? "block" : "none";
    }
}

function setLoginError(message = "") {
    const { loginError } = getElements();

    if (loginError) {
        loginError.textContent = message;
    }
}

function normalizeIdentifier(identifier) {
    const trimmed = (identifier || "").trim();

    if (!trimmed) {
        return "";
    }

    if (trimmed.toLowerCase() === ADMIN_LOGIN_ALIAS.toLowerCase()) {
        return ADMIN_LOGIN_EMAIL;
    }

    return trimmed;
}

function getFriendlyAuthMessage(error) {
    const code = typeof error?.code === "string" ? error.code.toLowerCase() : "";
    const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";
    const normalized = `${code} ${message}`;

    if (normalized.includes("api-key") || normalized.includes("api key")) {
        return "خطأ: إعداد Firebase غير صحيح.";
    }

    if (
        normalized.includes("wrong-password") ||
        normalized.includes("invalid-credential") ||
        normalized.includes("invalid-login-credentials") ||
        normalized.includes("user-not-found")
    ) {
        return "خطأ: تأكد من البيانات أو تفعيل الـ API";
    }

    if (normalized.includes("invalid-email")) {
        return "خطأ: صيغة البريد الإلكتروني غير صحيحة";
    }

    if (normalized.includes("operation-not-allowed")) {
        return "خطأ: Email/Password غير مفعلة في Firebase";
    }

    return "خطأ: تعذر تسجيل الدخول الآن";
}

let isSubmitting = false;

window.submitLogin = async (event) => {
    if (event) {
        event.preventDefault();
    }

    if (isSubmitting) {
        return;
    }

    const { emailInput, passwordInput, loginBtn } = getElements();

    if (!emailInput || !passwordInput) {
        return;
    }

    const email = normalizeIdentifier(emailInput.value);
    const password = passwordInput.value;

    isSubmitting = true;
    setLoginError("");

    if (loginBtn) {
        loginBtn.disabled = true;
    }

    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setAdminVisibility(true);

        if (window.portfolioAdminPanel && typeof window.portfolioAdminPanel.handleAuthSuccess === "function") {
            window.portfolioAdminPanel.handleAuthSuccess(credential.user);
        }

        alert("أهلاً بك يا باشمهندس عبدالرحمن!");
    } catch (error) {
        const message = getFriendlyAuthMessage(error);
        setLoginError(message);

        if (window.portfolioAdminPanel && typeof window.portfolioAdminPanel.handleAuthFailure === "function") {
            window.portfolioAdminPanel.handleAuthFailure(message, error);
        }

        console.error(error.message);
        alert(message);
    } finally {
        isSubmitting = false;

        if (loginBtn) {
            loginBtn.disabled = false;
        }
    }
};

onAuthStateChanged(auth, (user) => {
    const { adminDashboard, loginSection } = getElements();

    if (user) {
        if (adminDashboard) {
            adminDashboard.style.display = "block";
        }

        if (loginSection) {
            loginSection.style.display = "none";
        }

        console.log("تم التأكد: أنت الأدمن واللوحة مفتوحة لك.");
    } else {
        if (adminDashboard) {
            adminDashboard.style.display = "none";
        }

        if (loginSection) {
            loginSection.style.display = "block";
        }

        console.log("وصول مرفوض: اللوحة مؤمنة.");
    }

    if (window.portfolioAdminPanel && typeof window.portfolioAdminPanel.syncAuthState === "function") {
        window.portfolioAdminPanel.syncAuthState(user);
    }
});

window.logout = async () => {
    try {
        await signOut(auth);
        alert("تم تسجيل الخروج بنجاح");
    } catch (error) {
        console.error(error.message);
    }
};

window.portfolioAdminAuth = {
    submitLogin: window.submitLogin,
    signOut: () => signOut(auth)
};
