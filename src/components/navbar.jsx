import chefLogo from "../assets/chef.png"

export default function Navbar(){
  return(
    <section >
      <nav className="w-full bg-neutral-50 min-h-16 flex items-center h-16 border-neutral-300 border-b-1 select-none">
      <div className="w-full flex flex-row gap-4 justify-center items-center mx-auto text-[clamp(1rem,5vw,2rem)]">
        <img className="chef-logo h-[clamp(48px,6vw,50px)]" src={chefLogo} alt="chef-logo" />
      <span className="font-medium text-neutral-300">Chef JED</span>
      </div>
      </nav>
    </section>
  )
}
