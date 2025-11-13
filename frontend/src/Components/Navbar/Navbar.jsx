import React, { useState } from 'react'
import { Link } from 'react-router-dom' // ADD THIS IMPORT
import './Navbar.css'
import logo from '../../assets/logo.png'

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'

  // shared fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function signup(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const r = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Signup failed')
      setMsg('Verification email sent! Please check your @uic.edu inbox.')
      setName('')
      setEmail('')
      setPassword('')
      // optional: auto-switch to signin after success
      // setTab('signin')
    } catch (err) {
      setMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function signin(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const r = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Sign in failed')
      setMsg(`Welcome, ${data.name}!`)
      // optional: close modal after success
      // setTimeout(() => setOpen(false), 800)
    } catch (err) {
      setMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className='container' style={{ position: 'relative' }}>
      <img src={logo} alt='logo' className='logo' />
      <ul>
        {/* ADD THIS LINE */}
        <li><Link to="/become-provider">Become a Provider</Link></li>
        
        <li>
          <button className='btn' onClick={() => { setOpen(true); setTab('signin') }}>
            Sign in
          </button>
        </li>
      </ul>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{ background: '#fff', padding: 24, borderRadius: 12, width: 360 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button
                className='btn'
                style={{ opacity: tab === 'signin' ? 1 : 0.5 }}
                onClick={() => setTab('signin')}
              >
                Sign in
              </button>
              <button
                className='btn'
                style={{ opacity: tab === 'signup' ? 1 : 0.5 }}
                onClick={() => setTab('signup')}
              >
                Sign up
              </button>
            </div>

            {tab === 'signin' ? (
              <>
                <h3 style={{ marginTop: 0 }}>Welcome back</h3>
                <form onSubmit={signin} style={{ display: 'grid', gap: 10 }}>
                  <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button className='btn' type='submit' disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>Create your account</h3>
                <form onSubmit={signup} style={{ display: 'grid', gap: 10 }}>
                  <input
                    type='text'
                    placeholder='Full name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <input
                    type='email'
                    placeholder='UIC email (must end with @uic.edu)'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button className='btn' type='submit' disabled={loading}>
                    {loading ? 'Sending...' : 'Sign up'}
                  </button>
                </form>
              </>
            )}

            {msg && (
              <div
                style={{
                  marginTop: 10,
                  color: msg.startsWith('Welcome') || msg.startsWith('Verification') ? 'green' : 'red'
                }}
              >
                {msg}
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <button className='btn' onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar