import { Routes, Route } from 'react-router'

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

// Component
import Layout from './components/Layout';

// Pages 
import Home from './pages/Home/Home.jsx';

function App() {
  
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
