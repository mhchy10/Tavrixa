
import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import './AuthPage.css'

type AuthMode = 'login' | 'signup' | 'reset'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        })

        if (signUpError) throw signUpError

        setMessage(
          'Your account has been created. Check your inbox for the verification link before signing in.',
        )
      } else if (mode === 'login') {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

        if (signInError) throw signInError

        setMessage('Signed in successfully. Loading your workspace…')
        // App.tsx will handle displaying the authenticated workspace.
      } else {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/`,
          })

        if (resetError) throw resetError

        setMessage(
          'If an account exists for this email, a password reset link will be sent.',
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  return (
    <main className="auth-shell">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <header className="auth-topbar">
       <a className="auth-brand" href="/" aria-label="Tavrixa home">
  <img
    className="auth-brand-logo"
    src="/tavrixalogo.jpeg"
    alt="Tavrixa logo"
  />
  <span>Tavrixa<span className="auth-brand-dot">.</span></span>
</a>
       
<span className="auth-top-note">
  <span className="auth-status-dot" />
  <span className="auth-top-note-desktop">YOUR RESEARCH TERMINAL</span>
  <span className="auth-top-note-mobile">RESEARCH TERMINAL</span>
</span>
      </header>

      <section className="auth-main">
        <div className="auth-intro">
          <span className="auth-eyebrow">
            <span /> CLARITY IN EVERY MOVE
          </span>

          <h1>
            Research deeper.
            <br />
            <span>Invest smarter.</span>
          </h1>

          <p>
            A focused workspace for market discovery, company analysis,
            valuation, and portfolio experimentation.
          </p>


<div className="auth-feature-list">
  <div className="auth-feature">
    <span className="auth-feature-icon">⌕</span>
    <div>
     <strong>Research with <span className="auth-feature-highlight">Depth</span></strong>
      <span>Explore company fundamentals, valuation, and financial strength.</span>
    </div>
  </div>

  <div className="auth-feature">
    <span className="auth-feature-icon">◈</span>
    <div>
     <strong>Understand the <span className="auth-feature-highlight">Market</span></strong>
      <span>Discover opportunities through market intelligence and stock screening.</span>
    </div>
  </div>

  <div className="auth-feature">
    <span className="auth-feature-icon">↗</span>
    <div>
      <strong>Test before you <span className="auth-feature-highlight">Invest</span></strong>
      <span>Practice trades, track portfolio performance, and evaluate risk.</span>
    </div>
  </div>
</div>

          <div className="auth-disclaimer">
            <span className="auth-disclaimer-line" />
          INTELLIGENCE BEFORE INVESTMENT.
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-kicker">
              {mode === 'login'
                ? 'WELCOME BACK'
                : mode === 'signup'
                  ? 'YOUR NEXT CHAPTER'
                  : 'ACCOUNT RECOVERY'}
            </span>

            <h2>
              {mode === 'login'
                ? 'Sign in'
                : mode === 'signup'
                  ? 'Create your account'
                  : 'Reset your password'}
            </h2>

            <p>
              {mode === 'login'
                ? 'Pick up where your research left off.'
                : mode === 'signup'
                  ? 'Create your personal research workspace.'
                  : 'We’ll send you a secure reset link by email.'}
            </p>
          </div>

          {mode !== 'reset' && (
            <div className="auth-mode-switch">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => changeMode('login')}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => changeMode('signup')}
              >
                Create account
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label>
                <span>Display name</span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="How should we address you?"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                />
              </label>
            )}

            <label>
              <span>Email address</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            {mode !== 'reset' && (
              <label>
                <span>Password</span>
                <input
                  type="password"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  placeholder={
                    mode === 'signup'
                      ? 'At least 8 characters'
                      : 'Enter your password'
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={mode === 'signup' ? 8 : undefined}
                  required
                />
              </label>
            )}

            {mode === 'login' && (
              <button
                type="button"
                className="auth-forgot"
                onClick={() => changeMode('reset')}
              >
                Forgot password?
              </button>
            )}

            {error && (
              <div className="auth-feedback auth-error" role="alert">
                <span>!</span>
                {error}
              </div>
            )}

            {message && (
              <div className="auth-feedback auth-success" role="status">
                <span>✓</span>
                {message}
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in to Tavrixa'
                  : mode === 'signup'
                    ? 'Create your account'
                    : 'Send reset link'}
              {!loading && <span>↗</span>}
            </button>
          </form>

          {mode === 'reset' ? (
            <button
              type="button"
              className="auth-back"
              onClick={() => changeMode('login')}
            >
              ← Back to sign in
            </button>
          ) : (
            <p className="auth-terms">
              {mode === 'signup'
                ? 'By creating an account, you agree to use Tavrixa responsibly.'
                : 'Your research terminal is waiting.'}
            </p>
          )}

          <div className="auth-card-footer">
            <span className="auth-lock">◇</span>
            EMAIL-BASED AUTHENTICATION
            <span className="auth-footer-separator">·</span>
            SECURE SESSION
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} Tavrixa by MHCx</span>
        <span>BUILT FOR CURIOUS INVESTORS</span>
      </footer>
    </main>
  )
}
