import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import CategoryPage from './pages/CategoryPage'
import SingleCategoryPage from './pages/SingleCategoryPage'
import FullCardDetail from './pages/FullCardDetail'
import DevPage from './pages/DevPage'
import Platform from './pages/Platform'

function App() {

  return (
    <div className='dark'>
      <Routes>
        <Route path="/games/:slug" element={<FullCardDetail />} />
        <Route path='/developers' element={<DevPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/*' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/forget' element={<ForgotPasswordPage/>} />
        <Route path='/category' element={<CategoryPage/>} />
        <Route path='/category/:categorySlug' element={<SingleCategoryPage/>} /> 
        <Route path='/Platform' element={<Platform/>} />
      </Routes>
    </div>
  )
}

export default App
