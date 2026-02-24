import Navbar from './components/navbar'
import Main from './components/bodyMain'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 overflow-x-hidden overflow-y-auto">
      <Navbar />
      <div className="flex-1 lg:max-w-[900px] sm:px-8 px-4 font-[inter] transition-all ease-in-out mx-auto w-full">
        <Main />
      </div>
    </div>

  )
}