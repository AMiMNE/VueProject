<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="left-decoration">
        <div class="decoration-content">
          <div class="icon-circle">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="icon-circle">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="icon-circle">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="decoration-text">
            <h3>欢迎登录</h3>
            <p>安全可靠的管理系统</p>
          </div>
        </div>
      </div>
      <div class="login-box">
        <h2 class="login-title">用户登录</h2>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              placeholder="请输入用户名"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              @input="validatePassword"
              placeholder="请输入密码"
              required
            />
            <div class="password-requirements" v-if="showPasswordValidation">
              <div class="requirement" :class="{ valid: passwordValidation.hasNumber }">
                <span class="requirement-icon">{{ passwordValidation.hasNumber ? '✓' : '○' }}</span>
                包含数字
              </div>
              <div class="requirement" :class="{ valid: passwordValidation.hasUpperCase }">
                <span class="requirement-icon">{{ passwordValidation.hasUpperCase ? '✓' : '○' }}</span>
                包含大写字母
              </div>
              <div class="requirement" :class="{ valid: passwordValidation.hasLowerCase }">
                <span class="requirement-icon">{{ passwordValidation.hasLowerCase ? '✓' : '○' }}</span>
                包含小写字母
              </div>
            </div>
            <div class="password-error" v-if="showPasswordError">
              <span class="error-icon">!</span>
              用户名或密码错误
            </div>
          </div>
          <div class="form-group">
            <label for="role">身份</label>
            <select
              id="role"
              v-model="formData.role"
              @change="handleRoleChange"
              required
            >
              <option value="">请选择身份</option>
              <option value="admin">管理员</option>
              <option value="user">用户</option>
            </select>
            <div class="role-error" v-if="showRoleError">
              <span class="error-icon">!</span>
              未找到该身份对应的用户
            </div>
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" id="remember" v-model="formData.remember" />
            <label for="remember">记住我</label>
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="login-footer">
          <a href="#" class="forgot-password">忘记密码？</a>
          <a href="#" class="register-link">注册新账号</a>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { validateUser } from '@/data/users.js'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        role: '',
        remember: false
      },
      loading: false,
      passwordValidation: {
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false
      },
      showPasswordValidation: false,
      showRoleError: false,
      showPasswordError: false
    }
  },
  methods: {
    validatePassword() {
      const password = this.formData.password
      this.passwordValidation.hasNumber = /\d/.test(password)
      this.passwordValidation.hasUpperCase = /[A-Z]/.test(password)
      this.passwordValidation.hasLowerCase = /[a-z]/.test(password)
      
      if (password.length > 0) {
        const isValid = this.passwordValidation.hasNumber && 
                       this.passwordValidation.hasUpperCase && 
                       this.passwordValidation.hasLowerCase
        this.showPasswordValidation = !isValid
      } else {
        this.showPasswordValidation = false
      }
      this.showPasswordError = false
    },
    handleRoleChange() {
      this.showRoleError = false
      this.showPasswordError = false
    },
    handleLogin() {
      this.showRoleError = false
      this.showPasswordError = false

      if (!this.formData.username || !this.formData.password) {
        alert('请输入用户名和密码')
        return
      }

      if (!this.formData.role) {
        alert('请选择身份')
        return
      }

      this.loading = true

      setTimeout(() => {
        const user = validateUser(this.formData.username, this.formData.password, this.formData.role)
        
        if (user) {
          localStorage.setItem('username', this.formData.username)
          localStorage.setItem('userRole', this.formData.role)

          if (this.formData.remember) {
            localStorage.setItem('remember', 'true')
          } else {
            localStorage.removeItem('remember')
          }

          if (this.formData.role === 'admin') {
            this.router.push('/dashboard')
          } else {
            this.router.push('/dashboard-user')
          }
        } else {
          this.showPasswordError = true
        }

        this.loading = false
      }, 1000)
    }
  },
  mounted() {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      this.formData.username = savedUsername
      this.formData.remember = true
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 30px 40px 30px;
  overflow: hidden;
  box-sizing: border-box;
}

.login-wrapper {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  width: 100%;
  max-height: calc(100vh - 70px);
}

.left-decoration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: auto;
}

.decoration-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.icon-circle:nth-child(1) {
  animation-delay: 0s;
}

.icon-circle:nth-child(2) {
  animation-delay: 0.5s;
}

.icon-circle:nth-child(3) {
  animation-delay: 1s;
}

.icon-circle:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.icon {
  width: 35px;
  height: 35px;
  color: white;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.decoration-text {
  text-align: center;
  color: white;
  margin-top: 15px;
}

.decoration-text h3 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.decoration-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.login-box {
  background: rgb(255, 255, 255);
  border-radius: 9px;
  box-shadow: 0 9px 36px rgba(0, 0, 0, 0.2);
  padding: 28px;
  width: 100%;
  max-width: 360px;
  min-height: auto;
  transform: scale(0.9);
  transform-origin: center center;
}

.login-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 21.6px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 12.6px;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group select {
  padding: 10px 12px;
  border: 1.8px solid #e0e0e0;
  border-radius: 7.2px;
  font-size: 12.6px;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus,
.form-group select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2.7px rgba(102, 126, 234, 0.1);
}

.form-group select {
  cursor: pointer;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232c3e50' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.role-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 5.4px;
  color: #c53030;
  font-size: 11px;
  animation: slideDown 0.3s ease;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #c53030;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.password-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 5.4px;
  color: #c53030;
  font-size: 11px;
  animation: slideDown 0.3s ease;
}

.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 5.4px;
  border: 0.9px solid #e9ecef;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.requirement {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6c757d;
  transition: all 0.3s ease;
}

.requirement.valid {
  color: #28a745;
  font-weight: 500;
}

.requirement-icon {
  font-size: 12px;
  min-width: 14px;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-group label {
  cursor: pointer;
  margin: 0;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 7.2px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1.8px);
  box-shadow: 0 5px 18px rgba(102, 126, 234, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 0.9px solid #e0e0e0;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    gap: 30px;
  }
  
  .left-decoration {
    min-height: auto;
  }
  
  .login-box {
    transform: scale(0.9);
  }
  
  .icon-circle {
    width: 60px;
    height: 60px;
  }
  
  .icon {
    width: 30px;
    height: 30px;
  }
  
  .decoration-text h3 {
    font-size: 24px;
  }
  
  .decoration-text p {
    font-size: 14px;
  }
}
</style>
