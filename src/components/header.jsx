import Logo from "/src/assets/chef.png"

export default function Header(){
  return(
    <header>
      <img src={Logo} alt="chef Sentient logo" className="logo"/>
      <h1 className="heading">Chef Sentient</h1>
    </header>
  )
}