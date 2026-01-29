import Navbar from './components/navbar'
import Main from './components/bodyMain'

export default function App(){
  return(
    <div className="w-full min-h-screen bg-neutral-100 font-[inter] transition-all ease-in-out">
    <Navbar/>
    <Main/>
    </div>
  )
}