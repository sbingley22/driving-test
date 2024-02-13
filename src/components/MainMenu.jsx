import { useState } from "react"
import Game from "./Game"

const MainMenu = () => {
  const [mode, setMode] = useState(1)

  return (
    <>
      { mode === 0 && 
        <div className="main-menu">
          <button onClick={()=>{setMode(1)}}>Parking</button>
        </div>
      }
      { mode !== 0 &&
        <Game mode={mode} />
      }
    </>
  )
}

export default MainMenu
