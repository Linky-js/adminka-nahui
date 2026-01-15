<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import { useApi } from '@/composables/useApi'

const router = useRouter()
const store = useAppStore()
const api = useApi()

const login = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
    if (document.cookie.includes('auth_token')) {
        router.push('/admin')
    }
})

const handleLogin = async () => {
    loading.value = true
    error.value = ''
    try {
        const response = await api.post('login', { login: login.value, password: password.value })
        if (response.success) {
            store.setUser({ username: response.username, auth_key: '' }) // auth_key не нужен, кука
            router.push('/admin')
        }
    } catch (err) {
        error.value = err.response?.data?.error || 'Ошибка входа'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-container">
            <div class="settings-header">
                <div class="header-content">
                    <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 13a8 8 0 0 1 7 7 6 6 0 0 0 3-5 9 9 0 0 0 6-8 3 3 0 0 0-3-3 9 9 0 0 0-8 6 6 6 0 0 0-5 3Zm0 0a9 9 0 0 1 9-9" />
                    </svg>
                    <div>
                        <h1>Вход в админку</h1>
                        <p class="subtitle">Введите логин и пароль для доступа</p>
                    </div>
                </div>
            </div>

            <div class="login-form-container">
                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Логин</span>
                        </label>
                        <div class="input-group">
                            <div class="input-prefix">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
                                </svg>
                            </div>
                            <input v-model="login" type="text" placeholder="admin" class="form-input" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-text">Пароль</span>
                        </label>
                        <div class="input-group">
                            <div class="input-prefix">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z" />
                                </svg>
                            </div>
                            <input v-model="password" type="password" placeholder="adminadmin" class="form-input"
                                required />
                        </div>
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <button type="submit" class="btn primary full-width" :disabled="loading">
                        <span v-if="loading">Вход...</span>
                        <span v-else>Войти</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color, #f8f9fa);
}

.login-container {
    max-width: 400px;
    width: 100%;
    margin: 2rem;
}

.login-form-container {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    text-align: center;
}

.btn.full-width {
    width: 100%;
}

/* Используем стили из AdminSettingsApi */
.settings-header {
    margin-bottom: 2rem;
    text-align: center;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.header-icon {
    color: var(--primary-color, #007bff);
}

h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color, #333);
}

.subtitle {
    margin: 0.5rem 0 0 0;
    color: var(--text-muted, #666);
    font-size: 0.875rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-weight: 500;
    color: var(--text-color, #333);
}

.label-text {
    display: block;
    font-size: 0.875rem;
}

.input-group {
    position: relative;
    display: flex;
    align-items: center;
}

.input-prefix {
    position: absolute;
    left: 0.75rem;
    color: var(--text-muted, #666);
    z-index: 1;
}

.form-input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color, #007bff);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn.primary {
    background: var(--primary-color, #007bff);
    color: white;
}

.btn.primary:hover:not(:disabled) {
    background: var(--primary-hover, #0056b3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>