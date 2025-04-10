import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
    characterType: 'police' | 'thief';
    position: [number, number, number];
    targetPosition: [number, number, number];
    isMoving?: boolean;
    isCaught?: boolean;
}

// 由于我们没有实际的模型文件，我们将创建一个简单的3D角色
// 在实际项目中，你可以替换为真实的3D模型
const Character: React.FC<CharacterProps> = ({
    characterType,
    position,
    targetPosition,
    isMoving = false,
    isCaught = false
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);


    // 角色颜色和形状
    const color = characterType === 'police' ? '#1E40AF' : '#DC2626'; // 深蓝色警察，红色小偷
    const characterHeight = characterType === 'police' ? 1.2 : 1.0; // 警察稍高一些

    // 角色动画 - 上下跳动效果
    useFrame((state) => {
        if (!groupRef.current) return;

        // 平滑移动到目标位置
        groupRef.current.position.x += (targetPosition[0] - groupRef.current.position.x) * 0.1;
        groupRef.current.position.y += (targetPosition[1] - groupRef.current.position.y) * 0.1;
        groupRef.current.position.z += (targetPosition[2] - groupRef.current.position.z) * 0.1;

        // 如果角色在移动，添加跳动动画
        if (isMoving && !isCaught) {
            const time = state.clock.getElapsedTime();
            const bounce = Math.sin(time * 10) * 0.05;
            if (meshRef.current) {
                meshRef.current.position.y = 0.5 + bounce;
            }

            // 旋转效果
            if (characterType === 'thief' && isCaught) {
                groupRef.current.rotation.y += 0.1; // 被抓住的小偷旋转
            } else if (isMoving) {
                // 移动时轻微摇晃
                groupRef.current.rotation.y = Math.sin(time * 5) * 0.1;
            }
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* 角色主体 */}
            <group position={[0, 0, 0]}>
                {/* 身体 */}
                <mesh ref={meshRef} position={[0, 0.5, 0]}>
                    <capsuleGeometry args={[0.3, characterHeight, 8, 16]} />
                    <meshStandardMaterial color={color} />
                </mesh>

                {/* 头部 */}
                <mesh position={[0, 1.3, 0]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial color={characterType === 'police' ? '#1E3A8A' : '#991B1B'} />
                </mesh>

                {/* 警察帽子 */}
                {characterType === 'police' && (
                    <group position={[0, 1.55, 0]}>
                        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                            <cylinderGeometry args={[0.26, 0.3, 0.15, 16]} />
                            <meshStandardMaterial color="#1E3A8A" />
                        </mesh>
                        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
                            <cylinderGeometry args={[0.05, 0.26, 0.1, 16]} />
                            <meshStandardMaterial color="#1E3A8A" />
                        </mesh>
                    </group>
                )}

                {/* 小偷面具/帽子 */}
                {characterType === 'thief' && (
                    <group position={[0, 1.5, 0]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
                            <meshStandardMaterial color="#000000" />
                        </mesh>
                    </group>
                )}

                {/* 眼睛 */}
                <group position={[0, 1.35, 0.2]}>
                    <mesh position={[-0.08, 0, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial color="white" />
                    </mesh>
                    <mesh position={[0.08, 0, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial color="white" />
                    </mesh>

                    {/* 瞳孔 */}
                    <mesh position={[-0.08, 0, 0.03]}>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                    <mesh position={[0.08, 0, 0.03]}>
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshStandardMaterial color="black" />
                    </mesh>
                </group>

                {/* 手臂 */}
                <group position={[0, 0.8, 0]}>
                    {/* 左臂 */}
                    <mesh position={[-0.4, 0, 0]} rotation={[0, 0, isMoving ? Math.sin(Date.now() * 0.01) * 0.2 : -0.2]}>
                        <capsuleGeometry args={[0.08, 0.5, 8, 8]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                    {/* 右臂 */}
                    <mesh position={[0.4, 0, 0]} rotation={[0, 0, isMoving ? -Math.sin(Date.now() * 0.01) * 0.2 : 0.2]}>
                        <capsuleGeometry args={[0.08, 0.5, 8, 8]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                </group>

                {/* 腿部 */}
                <group position={[0, 0, 0]}>
                    {/* 左腿 */}
                    <mesh position={[-0.15, -0.3, 0]} rotation={[isMoving ? Math.sin(Date.now() * 0.01) * 0.2 : 0, 0, 0]}>
                        <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
                        <meshStandardMaterial color={characterType === 'police' ? '#1E3A8A' : '#4B5563'} />
                    </mesh>
                    {/* 右腿 */}
                    <mesh position={[0.15, -0.3, 0]} rotation={[isMoving ? -Math.sin(Date.now() * 0.01) * 0.2 : 0, 0, 0]}>
                        <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
                        <meshStandardMaterial color={characterType === 'police' ? '#1E3A8A' : '#4B5563'} />
                    </mesh>
                </group>
            </group>

            {/* 角色标签 */}
            <Text
                position={[0, 1.8, 0]}
                fontSize={0.2}
                color="white"

                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {characterType === 'police' ? '警察' : '小偷'}
            </Text>

            {/* 被抓住的效果 */}
            {characterType === 'thief' && isCaught && (
                <group position={[0, 2.2, 0]}>
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.3}
                        color="#FF0000"

                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.04}
                        outlineColor="#FFFFFF"
                    >
                        被抓住了！
                    </Text>
                </group>
            )}
        </group>
    );
};

export default Character;