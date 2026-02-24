import Navbar from './components/navbar'
import Main from './components/bodyMain'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="lg:max-w-[900px] sm:px-8 px-4 min-h-screen font-[inter] transition-all ease-in-out mx-auto">
        <Main />
      </div>
    </>

  )
}