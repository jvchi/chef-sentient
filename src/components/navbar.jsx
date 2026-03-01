import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import ChefLogo from '../assets/chef.svg?react'

gsap.registerPlugin(DrawSVGPlugin)

export default function Navbar() {
  const container = useRef()

  useGSAP(() => {
    gsap.set('.chef-logo path, .chef-logo circle, .chef-logo line', { drawSVG: "0%" });

    let tl = gsap.timeline();
    tl.from('.chef-logo', { x: 80, duration: 1, ease: 'power4.out' })
      .to('.chef-logo path, .chef-logo circle, .chef-logo line', {
        drawSVG: "100%",
        duration: 2,
        stagger: 0.1
      })
      .from('.chef-name', { x: -40, duration: .5, ease: 'power4.in', opacity: 0 }, 0.1)
  }, [])

  return (
    <section>
      <nav className="w-full bg-neutral-100 min-h-16 flex items-center justify-center h-16 border-neutral-300 border-b-[0.5px] select-none fixed top-0 w-full z-50 mb-28">
        <div ref={container} className="w-max flex flex-row gap-4 items-center text-[clamp(1rem,5vw,2rem)] ">
          <ChefLogo className="chef-logo w-[clamp(48px,6vw,50px)] h-[clamp(64px,10vw,50px)]"
          />
          <span className="chef-name font-thin text-neutral-800">Chef JED</span>
        </div>
      </nav>
    </section>
  )
}