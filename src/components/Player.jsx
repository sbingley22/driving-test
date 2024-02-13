/* eslint-disable react/no-unknown-property */
import { useGLTF, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"

const desiredCamPos = new THREE.Vector3(0,0,0)
const offset = new THREE.Vector3(0,0.5,-1.2)
const lookAtPos = new THREE.Vector3(0,0,0)
const forward = new THREE.Vector3(0, 0, -1)
const rightVec = new THREE.Vector3(1, 0, 0)

const Player = () => {
  const group = useRef()
  const carBody = useRef()
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    const { gas, breaks, clutch, left, right, gearUp, gearDown, interact, engine } = getKeys()

    // Apply forces based on user input
    const applyForces = () => {
      if (!carBody) return;

      const carRotation = carBody.current.rotation();
      forward.set(0, 0, 1).applyQuaternion(carRotation);
      rightVec.set(1, 0, 0).applyQuaternion(carRotation);

      if (gas) {
        const speed = 0.01
        carBody.current.applyImpulse({ x: forward.x * speed, y: forward.y * speed, z: forward.z * speed}, true);
      }

      if (breaks) {
        const brakeForce = 0.01
        carBody.current.applyImpulse({ x: -forward.x * brakeForce, y: -forward.y * brakeForce, z: -forward.z * brakeForce}, true);
      }

      const impulse = 0.001
      if (left) {
        carBody.current.applyTorqueImpulse({ x: 0, y: impulse, z: 0}, true);
      }

      if (right) {
        carBody.current.applyTorqueImpulse({ x: 0, y: -impulse, z: 0}, true);
      }
    }
    applyForces()

    const updateCam = () => {
      if (!carBody) return;
    
      // Get car's position and rotation
      const carPosition = carBody.current.translation();
      const carRotation = carBody.current.rotation();
    
      // Calculate the offset vector based on car's rotation
      const offsetVector = offset.clone().applyQuaternion(carRotation);
    
      // Calculate desired camera position
      desiredCamPos.set(
        carPosition.x + offsetVector.x,
        carPosition.y + offsetVector.y,
        carPosition.z + offsetVector.z
      );
    
      // Set camera position
      state.camera.position.copy(desiredCamPos);
    
      // Set camera to look at the car's position
      lookAtPos.set(carPosition.x, carPosition.y + offset.y, carPosition.z);
      state.camera.lookAt(lookAtPos);
    
      // Update camera's projection matrix
      state.camera.updateProjectionMatrix();
    };
    updateCam()
  })

  return (
    <group ref={group} dispose={null}>
      <RigidBody
        ref={carBody}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 0, 0]}
        enabledRotations={[true, true, true]}
      >
        <Model />
        <CuboidCollider
          args={[0.2, 0.1, 0.4]}
          position={[0,0.0,0]}
        />
      </RigidBody>
    </group>
  )
}

export default Player

function Model(props) {
  const { nodes, materials } = useGLTF('/car-black-1-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.mesh.geometry} material={materials.base_material} rotation={[Math.PI / 2, 0, 0]} scale={1.725} />
    </group>
  )
}

useGLTF.preload('/car-black-1-transformed.glb')