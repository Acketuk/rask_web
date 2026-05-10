import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

interface Category {
  id: string
  name: string
  level: number
  parent_id: string | null
}

function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/v1/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories')
        return res.json()
      })
      .then((data: Category[]) =>
        setCategories(data.filter((c) => c.level === 0))
      )
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>Categories</h1>
      {error && <p>{error}</p>}
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/sign-in">Sign In</Link>
        {' | '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
