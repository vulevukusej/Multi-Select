import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Select,
  useSelect,
  Sky,
  ContactShadows,
  Edges,
  Environment,
  OrbitControls,
  MeshTransmissionMaterial,
  useCursor
} from '@react-three/drei'
import { Panel, useControls } from './MultiLeva'

function Cube({ color = 'white', thickness = 1, roughness = 0.5, envMapIntensity = 1, transmission = 1, metalness, ...props }) {
  const [hovered, setHover] = useState(false)
  const selected = useSelect().map((sel) => sel.userData.store)
  const [store, materialProps] = useControls(selected, {
    color: { value: color },
    roughness: { value: roughness, min: 0, max: 1 },
    thickness: { value: thickness, min: -10, max: 10 },
    envMapIntensity: { value: envMapIntensity, min: 0, max: 10 },
    transmission: { value: transmission, min: 0, max: 1 },
    ...(metalness !== undefined && { metalness: { value: metalness, min: 0, max: 1 } })
  })
  const isSelected = !!selected.find((sel) => sel === store)
  useCursor(hovered)
  return (
    <mesh
      {...props}
      userData={{ store }}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}>
      <boxGeometry />
      <MeshTransmissionMaterial resolution={128} samples={16} {...materialProps} />
      <Edges visible={isSelected} scale={1.1} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" depthTest={false} />
      </Edges>
    </mesh>
  )
}

export default function App() {
  const [selected, setSelected] = useState([])
  return (
    <>
      <Canvas dpr={[1, 2]} orthographic camera={{ position: [-10, 10, 10], zoom: 100 }}>
        <pointLight position={[10, 10, 10]} />
        <Select multiple box onChange={setSelected}>
          <Cube scale={0.9} position={[-1, 0, 0]} color="orange" thickness={2} envMapIntensity={5} />
          <Cube scale={0.9} position={[0, 0, 0]} color="#eb8686" envMapIntensity={2} />
          <Cube scale={0.9} position={[0, 0, -1]} color="hotpink" thickness={2} envMapIntensity={5} />
          <Cube scale={[1, 0.9, 0.9]} position={[0.05, 0, 1]} color="aquamarine" metalness={0} transmission={0} />
          <Cube scale={[0.9, 0.9, 1.9]} position={[1, 0, 0.5]} color="aquamarine" metalness={0} transmission={0} />
        </Select>
        <Environment preset="city" />
        <ContactShadows frames={1} position={[0, -0.5, 0]} scale={10} opacity={0.4} far={1} blur={2} />
        <OrbitControls makeDefault rotateSpeed={2} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />
        <Sky />
      </Canvas>
      <Panel selected={selected} />
    </>
  )
}
