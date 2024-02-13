/* eslint-disable react/prop-types */
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Stars, Stats } from '@react-three/drei'
import { Suspense } from 'react'
import Parking from './Parking'
import HUD from './HUD'
import { Physics } from '@react-three/rapier'

const Game = ({ mode }) => {
  return (
    <div id="canvas-container">
      <KeyboardControls
        map={[
        { name: "gas", keys: ["ArrowUp", "w", "W"] },
        { name: "brakes", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "clutch", keys: ["Space"] },
        { name: "gearUp", keys: ["e", "E"] },
        { name: "gearDown", keys: ["q", "Q"] },
        { name: "interact", keys: ["f", "F"] },
        { name: "engine", keys: ["`", "Enter"] },
        ]}
      >
        <Canvas
          shadows
          // camera={{ fov: 70, position: [0,2,2]}}
        >
          <Suspense>
            <Stars />
            <Physics gravity={[0,-10,0]} debug>
              { mode === 1 && <Parking /> }
            </Physics>
            <Stats />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <HUD />
    </div>
  )
}

export default Game
