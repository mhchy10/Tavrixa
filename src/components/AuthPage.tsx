import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { supabase } from '../lib/supabase'
import './AuthPage.css'

type AuthMode = 'login' | 'signup' | 'reset'

/* ───────────── Icons (inline SVG, no extra packages) ───────────── */

const svgBase = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const MailIcon = () => (
  <svg {...svgBase}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 8 8 5.5L20 8" />
  </svg>
)

const LockIcon = ({ size = 18 }: { size?: number }) => (
  <svg {...svgBase} width={size} height={size}>
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

const UserIcon = () => (
  <svg {...svgBase}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5" />
  </svg>
)

const EyeIcon = () => (
  <svg {...svgBase}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg {...svgBase}>
    <path d="M2.5 12S6 5.5 12 5.5c2 0 3.7.7 5.1 1.6M21.5 12S18 18.5 12 18.5c-2 0-3.7-.7-5.1-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m3 3 18 18" />
  </svg>
)

const ArrowIcon = () => (
  <svg {...svgBase}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const ChevronUpIcon = () => (
  <svg {...svgBase} width={16} height={16}>
    <path d="m6 15 6-6 6 6" />
  </svg>
)

const SearchIcon = () => (
  <svg {...svgBase} width={20} height={20}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
)

const BarsIcon = () => (
  <svg {...svgBase} width={20} height={20}>
    <path d="M5 20v-7M12 20V5M19 20v-10" />
  </svg>
)

const TrendIcon = () => (
  <svg {...svgBase} width={20} height={20}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
)

const AlertIcon = () => (
  <svg {...svgBase} width={16} height={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.2v.1" />
  </svg>
)

const CheckIcon = () => (
  <svg {...svgBase} width={16} height={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.4 2.6 2.6 5-5.4" />
  </svg>
)

/* Official multi-colour Google "G" */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-4.06 1.12c-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.25a7.2 7.2 0 0 1 0-4.5v-3.1H1.27a12 12 0 0 0 0 10.7l4-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.65l4 3.1C6.22 6.88 8.87 4.77 12 4.77z"
    />
  </svg>
)

/* ───────────── Small reusable pieces ───────────── */
/* These live OUTSIDE AuthPage on purpose: defined inside, they would be
   re-created on every keystroke and the input would lose focus. */

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode
  label: string
  trailing?: ReactNode
  inputRef?: Ref<HTMLInputElement>
}

function Field({ icon, label, trailing, inputRef, ...inputProps }: FieldProps) {
  return (
    <div className={`auth-field${trailing ? ' has-trailing' : ''}`}>
      <span className="auth-field-icon">{icon}</span>
      <input ref={inputRef} placeholder=" " aria-label={label} {...inputProps} />
      <span className="auth-field-label">{label}</span>
      {trailing}
    </div>
  )
}

function Feedback({ error, message }: { error: string; message: string }) {
  return (
    <>
      {error && (
        <div className="auth-feedback auth-error" role="alert">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="auth-feedback auth-success" role="status">
          <CheckIcon />
          <span>{message}</span>
        </div>
      )}
    </>
  )
}

function GoogleButton({
  onClick,
  loading,
  disabled,
  children,
}: {
  onClick: () => void
  loading: boolean
  disabled: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="auth-google"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <span className="auth-spinner auth-spinner-light" /> : <GoogleIcon />}
      <span>{children}</span>
    </button>
  )
}

/* ───────────── Page ───────────── */

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loginPaneRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const drawerOpen = mode === 'signup'
  const busy = loading || googleLoading

  // Keep whichever layer is hidden unreachable by keyboard / screen readers,
  // and move focus into the drawer when it opens.
  useEffect(() => {
    loginPaneRef.current?.toggleAttribute('inert', drawerOpen)
    drawerRef.current?.toggleAttribute('inert', !drawerOpen)

    if (drawerOpen) {
      const timer = window.setTimeout(() => nameRef.current?.focus(), 420)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [drawerOpen])

  // Escape closes the drawer.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMode((current) => (current === 'signup' ? 'login' : current))
        setError('')
        setMessage('')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (signInError) throw signInError

        setMessage('Signed in successfully. Loading your workspace…')
        // App.tsx will handle displaying the authenticated workspace.
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/`,
          },
        )

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

  async function handleGoogle() {
    setError('')
    setMessage('')
    setGoogleLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })

      if (oauthError) throw oauthError
      // On success the browser leaves for Google, so we keep the spinner on.
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Google sign-in could not start. Please try again.',
      )
      setGoogleLoading(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
    setShowPassword(false)
  }

  const passwordToggle = (
    <button
      type="button"
      className="auth-field-toggle"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      aria-pressed={showPassword}
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  )

  return (
    <main className="auth-shell">
      <header className="auth-topbar">
        <a className="auth-brand" href="/" aria-label="Tavrixa home">
          <img
            className="auth-brand-logo"
            src="/tavrixalogo.jpeg"
            alt="Tavrixa logo"
          />
          <span>
            Tavrixa<span className="auth-brand-dot">.</span>
          </span>
        </a>

        <span className="auth-top-note">
          <span className="auth-status-dot" />
          <span className="auth-top-note-desktop">YOUR RESEARCH TERMINAL</span>
          <span className="auth-top-note-mobile">RESEARCH TERMINAL</span>
        </span>
      </header>

      <section className="auth-main">
        {/* ───── Left: brand message ───── */}
        <div className="auth-intro">
          <span className="auth-eyebrow">
            <span /> CLARITY IN EVERY MOVE
          </span>

          <h1>
            Research better.
            <br />
            <span>Invest smarter.</span>
          </h1>

          <p>
            A focused workspace for market discovery, company analysis,
            quantitative insights, and portfolio experimentation.
          </p>

          <ul className="auth-feature-list">
            <li className="auth-feature">
              <span className="auth-feature-icon">
                <SearchIcon />
              </span>
              <div>
                <strong>
                  Research with{' '}
                  <span className="auth-feature-highlight">Depth</span>
                </strong>
                <span>
                  Explore company fundamentals, valuation, financial strength,
                  and historical market data.
                </span>
              </div>
            </li>

            <li className="auth-feature">
              <span className="auth-feature-icon">
                <BarsIcon />
              </span>
              <div>
                <strong>
                  Understand the{' '}
                  <span className="auth-feature-highlight">Markets</span>
                </strong>
                <span>
                  Discover opportunities through market intelligence, stock
                  screening, and technical analysis.
                </span>
              </div>
            </li>

            <li className="auth-feature">
              <span className="auth-feature-icon">
                <TrendIcon />
              </span>
              <div>
                <strong>
                  Practice before{' '}
                  <span className="auth-feature-highlight">Investing</span>
                </strong>
                <span>
                  Practice trades, track portfolio, &amp; explore
                  machine-learning-powered stock predictions through the Quant
                  Engine.
                </span>
              </div>
            </li>
          </ul>

          <div className="auth-disclaimer">
            <span className="auth-disclaimer-line" />
            INTELLIGENCE BEFORE INVESTMENT.
          </div>
        </div>

        {/* ───── Right: card with sign-in + create-account drawer ───── */}
        <div className="auth-card">
          <div className="auth-stage">
            {/* Layer 1: Sign in / Reset (always the base layer) */}
            <section
              ref={loginPaneRef}
              className={`auth-pane${drawerOpen ? ' is-covered' : ''}`}
            >
              <div className="auth-card-heading">
                <span className="auth-card-kicker">
                  {mode === 'reset' ? 'ACCOUNT RECOVERY' : 'WELCOME BACK'}
                </span>
                <h2>{mode === 'reset' ? 'Reset your password' : 'Sign in'}</h2>
                <p>
                  {mode === 'reset'
                    ? 'We’ll send you a secure reset link by email.'
                    : 'Pick up where your research left off.'}
                </p>
              </div>

              {mode !== 'reset' && (
                <>
                  <GoogleButton
                    onClick={handleGoogle}
                    loading={googleLoading}
                    disabled={busy}
                  >
                    Continue with Google
                  </GoogleButton>

                  <div className="auth-divider">
                    <span>or use your email</span>
                  </div>
                </>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <Field
                  icon={<MailIcon />}
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                {mode === 'login' && (
                  <>
                    <Field
                      icon={<LockIcon />}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      trailing={passwordToggle}
                    />

                    <button
                      type="button"
                      className="auth-forgot"
                      onClick={() => changeMode('reset')}
                    >
                      Forgot password?
                    </button>
                  </>
                )}

                {!drawerOpen && <Feedback error={error} message={message} />}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={busy}
                >
                  {loading && !drawerOpen ? (
                    <span className="auth-spinner" />
                  ) : null}
                  <span>
                    {loading && !drawerOpen
                      ? 'Please wait…'
                      : mode === 'reset'
                        ? 'Send reset link'
                        : 'Sign in to Tavrixa'}
                  </span>
                  {!(loading && !drawerOpen) && (
                    <span className="auth-submit-icon">
                      <ArrowIcon />
                    </span>
                  )}
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
                <button
                  type="button"
                  className="auth-drawer-trigger"
                  onClick={() => changeMode('signup')}
                  aria-expanded={drawerOpen}
                >
                  <span className="auth-drawer-trigger-text">
                    New to Tavrixa?
                  </span>
                  <span className="auth-drawer-trigger-action">
                    Create account
                    <span className="auth-drawer-trigger-chevron">
                      <ChevronUpIcon />
                    </span>
                  </span>
                </button>
              )}
            </section>

            {/* Layer 2: Create-account drawer (slides up on demand) */}
            <section
              ref={drawerRef}
              className={`auth-drawer${drawerOpen ? ' is-open' : ''}`}
              aria-label="Create account"
            >
              <button
                type="button"
                className="auth-drawer-handle"
                onClick={() => changeMode('login')}
                aria-label="Close and return to sign in"
              >
                <span />
              </button>

              <div className="auth-card-heading">
                <span className="auth-card-kicker">YOUR NEXT CHAPTER</span>
                <h2>Create your account</h2>
                <p>Create your personal research workspace.</p>
              </div>

              <GoogleButton
                onClick={handleGoogle}
                loading={googleLoading}
                disabled={busy}
              >
                Sign up with Google
              </GoogleButton>

              <div className="auth-divider">
                <span>or use your email</span>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <Field
                  inputRef={nameRef}
                  icon={<UserIcon />}
                  label="Display name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={80}
                />

                <Field
                  icon={<MailIcon />}
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <Field
                  icon={<LockIcon />}
                  label="Password · 8 characters at least"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  trailing={passwordToggle}
                />

                {drawerOpen && <Feedback error={error} message={message} />}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={busy}
                >
                  {loading && drawerOpen ? (
                    <span className="auth-spinner" />
                  ) : null}
                  <span>
                    {loading && drawerOpen
                      ? 'Please wait…'
                      : 'Create your account'}
                  </span>
                  {!(loading && drawerOpen) && (
                    <span className="auth-submit-icon">
                      <ArrowIcon />
                    </span>
                  )}
                </button>
              </form>

              <p className="auth-terms">
                By creating an account, you agree to use Tavrixa responsibly.
              </p>

              <button
                type="button"
                className="auth-back"
                onClick={() => changeMode('login')}
              >
                Already have an account? <strong>Sign in</strong>
              </button>
              </section>
          </div>

          <div className="auth-card-footer">
            <LockIcon size={12} />
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