import Navbar from './components/navbar'
import Main from './components/bodyMain'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Main />
    </div>
  )
}
