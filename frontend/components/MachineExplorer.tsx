"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function Box(props: any) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state, delta) => (meshRef.current.rotation.x += delta * 0.2));

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => {
                setActive(!active);
                props.onClick && props.onClick();
            }}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? '#FF4500' : '#4682B4'} />
        </mesh>
    );
}

const MachineExplorer = () => {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);

    return (
        <div className="h-[400px] w-full bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700">
            <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-white">
                <h3 className="text-lg font-bold">Spring Coiling Machine</h3>
                <p className="text-sm text-slate-300">Tap a part to learn more</p>
            </div>

            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                {/* Placeholder for "Feeder" */}
                <Box position={[-1.2, 0, 0]} onClick={() => setSelectedPart("Feeder Mechanism")} />
                <Text position={[-1.2, 1.2, 0]} fontSize={0.2} color="white">Feeder</Text>

                {/* Placeholder for "Coiling Point" */}
                <Box position={[1.2, 0, 0]} onClick={() => setSelectedPart("Coiling Point")} />
                <Text position={[1.2, 1.2, 0]} fontSize={0.2} color="white">Coiler</Text>

                <OrbitControls enableZoom={true} />
            </Canvas>

            {selectedPart && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-800 p-4 rounded-lg border-l-4 border-orange-500 shadow-lg animate-in slide-in-from-bottom-2 fade-in">
                    <h4 className="text-orange-500 font-bold uppercase text-xs tracking-wider">Selected Component</h4>
                    <p className="text-white text-lg font-medium">{selectedPart}</p>
                    <button className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-semibold text-sm transition-colors">
                        View Training Module
                    </button>
                </div>
            )}
        </div>
    );
};

export default MachineExplorer;
