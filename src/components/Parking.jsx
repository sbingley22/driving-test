/* eslint-disable react/no-unknown-property */
import * as THREE from "three"
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import Player from "./Player";
import Box from "./Box";

const threeBox = new THREE.BoxGeometry()

const Parking = () => {
  const { scene } = useThree();
  
  const spotlightRefs = useRef([]);
  const addSpotLights = () => {
    // If already added spot lights, don't add them again
    if (spotlightRefs.current.length != 0) return

    // Remove existing spotlights
    spotlightRefs.current.forEach((spotlight) => {
      scene.remove(spotlight, spotlight.target);
      spotlight.dispose();
    })

    // Spot light position
    const spotlightDetails = [
      { pos: [0,10,0] },
      { pos: [5,10,5] },
      { pos: [-5,10,5] },
    ]

    // Add spotlights
    const spotlights = spotlightDetails.map((light) => {
      const spotlight = new THREE.SpotLight('#fff');
      spotlight.position.set(light.pos[0], light.pos[1], light.pos[2]);
      spotlight.target.position.set(light.pos[0], 0, light.pos[2]);
      spotlight.intensity = 10
      spotlight.castShadow = true
      spotlight.penumbra = 0.75
      scene.add(spotlight, spotlight.target);
      return spotlight;
    });
    spotlightRefs.current = spotlights;
  }
  addSpotLights()

  //console.log("Parking")

  return (
    <>
      <ambientLight intensity={0.4} />
      {spotlightRefs.current.map((spotlight, index) => (
        <primitive key={index} object={spotlight} />
      ))}

      <Player />
      <group>
        <Box geo={threeBox} position={[0, -1, 0]} scale={[10,1,10]} />
      </group>
    </>
  )
}

export default Parking
