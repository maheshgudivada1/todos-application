import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import './index.css'

class Auth extends Component {
  state = {
    isLogin: true,
    username: '',
    password: '',
    confirmPassword: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    localStorage.setItem('jwt_token', jwtToken)
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = event => {
    event.preventDefault()
    const {isLogin, username, password, confirmPassword} = this.state

    if (!isLogin && password !== confirmPassword) {
      this.onSubmitFailure('Passwords do not match')
      return
    }

    if (isLogin) {
      const storedUsername = localStorage.getItem('username')
      const storedPassword = localStorage.getItem('password')

      if (storedUsername === username && storedPassword === password) {
        const jwtToken = 'dummy-jwt-token'
        this.onSubmitSuccess(jwtToken)
      } else {
        this.onSubmitFailure('Invalid login credentials')
      }
    } else {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      this.setState({isLogin: true})
    }
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeConfirmPassword = event => {
    this.setState({confirmPassword: event.target.value})
  }

  toggleForm = () => {
    this.setState(prevState => ({
      isLogin: !prevState.isLogin,
      showSubmitError: false,
    }))
  }

  render() {
    const {
      showSubmitError,
      errorMsg,
      isLogin,
      username,
      password,
      confirmPassword,
    } = this.state
    return (
      <div className="bg-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://logowik.com/content/uploads/images/todo-group3144.logowik.com.webp"
            className="logo"
            alt="website logo"
          />
          <label htmlFor="USERNAME">Username</label>
          <input
            type="text"
            id="USERNAME"
            value={username}
            onChange={this.onChangeUserName}
            placeholder="username"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="password"
          />
          {!isLogin && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={this.onChangeConfirmPassword}
                placeholder="confirm password"
              />
            </>
          )}
          <button className="button" type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          {showSubmitError && <p className="paragraph">{errorMsg}</p>}
          <p className="toggle-form" onClick={this.toggleForm}>
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </p>
        </form>
      </div>
    )
  }
}

export default Auth
