import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const Atom = (props) => {
    const group = useRef();

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
            group.current.rotation.z = state.clock.getElapsedTime() * 0.08;
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* Nucleus */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color="#EC4899"
                    transparent
                    opacity={0.9}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#DB2777"
                    emissiveIntensity={0.5}
                />
            </mesh>
            <Ring rotation={[Math.PI / 3, 0, 0]} delay={0} />
            <Ring rotation={[-Math.PI / 3, 0, 0]} delay={2} />
            <Ring rotation={[0, 0, Math.PI / 2]} delay={4} />
        </group>
    );
};

const Ring = ({ rotation, delay }) => {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z = state.clock.getElapsedTime() * 0.2 + delay;
        }
    })
    return (
        <group rotation={rotation}>
            <group ref={ref}>
                <mesh>
                    <torusGeometry args={[3.2, 0.02, 16, 100]} />
                    <meshStandardMaterial
                        color="#F472B6"
                        transparent
                        opacity={0.2}
                        roughness={0}
                        emissive="#EC4899"
                        emissiveIntensity={0.2}
                    />
                </mesh>
                <mesh position={[3.2, 0, 0]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#FFFFFF" emissive="#EC4899" emissiveIntensity={1} />
                </mesh>
            </group>
        </group>
    );
}

const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[100px] mix-blend-screen" />

            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]}
                className="opacity-60"
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#EC4899" />

                <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
                    <Atom scale={1.2} position={[3.5, 0, 0]} />
                </Float>
            </Canvas>
        </div>
    );
};

export default AmbientBackground;
