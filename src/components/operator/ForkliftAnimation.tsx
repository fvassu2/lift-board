import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import type { Mission } from '../../types/mission';
import './ForkliftAnimation.css';

interface ForkliftAnimationProps {
  mission: Mission;
}

type AnimationState = 'idle' | 'moving_to_origin' | 'loading' | 'moving_to_dest' | 'unloading' | 'returning' | 'completed';

const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeOutCubic = (t: number) => (--t) * t * t + 1;
const easeInCubic = (t: number) => t * t * t;

const positions = {
  neutral: { x: 350 },
  origin: { x: 100 },
  destination: { x: 600 }
};

const ForkliftAnimation = ({ mission }: ForkliftAnimationProps) => {
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [forkliftX, setForkliftX] = useState(350);
  const [forkliftY] = useState(150);
  const [binY, setBinY] = useState(170);
  const animationRef = useRef<number | undefined>(undefined);
  const stateRef = useRef<AnimationState>('idle');
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (mission.status !== 'IN_PROGRESS') {
      // Reset animation when mission is not in progress
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stateRef.current = 'idle';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationState('idle');
       
      setForkliftX(positions.neutral.x);
       
      setBinY(170);
      return;
    }

    // Start animation
    startTimeRef.current = Date.now();
    stateRef.current = 'idle';

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      if (stateRef.current === 'idle') {
        // Move to origin
        if (elapsed < 2000) {
          const progress = elapsed / 2000;
          setForkliftX(positions.neutral.x + (positions.origin.x - positions.neutral.x) * easeInOutQuad(progress));
          stateRef.current = 'moving_to_origin';
          setAnimationState('moving_to_origin');
        } else {
          stateRef.current = 'loading';
          setAnimationState('loading');
          startTimeRef.current = Date.now();
        }
      } else if (stateRef.current === 'loading') {
        // Loading animation
        if (elapsed < 800) {
          const progress = elapsed / 800;
          setBinY(170 - 30 * easeOutCubic(progress));
        } else {
          stateRef.current = 'moving_to_dest';
          setAnimationState('moving_to_dest');
          startTimeRef.current = Date.now();
        }
      } else if (stateRef.current === 'moving_to_dest') {
        // Move to destination
        if (elapsed < 2000) {
          const progress = elapsed / 2000;
          setForkliftX(positions.origin.x + (positions.destination.x - positions.origin.x) * easeInOutQuad(progress));
        } else {
          stateRef.current = 'unloading';
          setAnimationState('unloading');
          startTimeRef.current = Date.now();
        }
      } else if (stateRef.current === 'unloading') {
        // Unloading animation
        if (elapsed < 800) {
          const progress = elapsed / 800;
          setBinY(140 + 30 * easeInCubic(progress));
        } else {
          stateRef.current = 'returning';
          setAnimationState('returning');
          startTimeRef.current = Date.now();
        }
      } else if (stateRef.current === 'returning') {
        // Return to neutral
        if (elapsed < 2000) {
          const progress = elapsed / 2000;
          setForkliftX(positions.destination.x + (positions.neutral.x - positions.destination.x) * easeInOutQuad(progress));
        } else {
          stateRef.current = 'completed';
          setAnimationState('completed');
          setTimeout(() => {
            stateRef.current = 'idle';
            setAnimationState('idle');
            startTimeRef.current = Date.now();
          }, 1000);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mission.status]);

  return (
    <div className="forklift-animation-container">
      <Stage width={750} height={250}>
        <Layer>
          {/* Ground line */}
          <Line
            points={[0, 200, 750, 200]}
            stroke="#888"
            strokeWidth={2}
            dash={[10, 5]}
          />

          {/* Origin marker */}
          <Circle x={positions.origin.x} y={200} radius={8} fill="#4CAF50" />
          <Text
            x={positions.origin.x - 20}
            y={210}
            text="ORIGINE"
            fontSize={12}
            fill="#4CAF50"
          />

          {/* Destination marker */}
          <Circle x={positions.destination.x} y={200} radius={8} fill="#2196F3" />
          <Text
            x={positions.destination.x - 30}
            y={210}
            text="DESTINAZIONE"
            fontSize={12}
            fill="#2196F3"
          />

          {/* Forklift body */}
          <Rect
            x={forkliftX - 30}
            y={forkliftY}
            width={60}
            height={40}
            fill="#FF9800"
            cornerRadius={5}
          />
          
          {/* Forklift mast */}
          <Rect
            x={forkliftX - 5}
            y={forkliftY - 30}
            width={10}
            height={30}
            fill="#F57C00"
          />

          {/* Wheels */}
          <Circle x={forkliftX - 15} y={forkliftY + 45} radius={8} fill="#333" />
          <Circle x={forkliftX + 15} y={forkliftY + 45} radius={8} fill="#333" />

          {/* Bin */}
          {(animationState === 'loading' || animationState === 'moving_to_dest' || animationState === 'unloading') && (
            <Rect
              x={forkliftX - 20}
              y={binY}
              width={40}
              height={40}
              fill="#795548"
              stroke="#5D4037"
              strokeWidth={2}
            />
          )}

          {/* Animation state text */}
          <Text
            x={10}
            y={10}
            text={`Stato: ${animationState.replace(/_/g, ' ').toUpperCase()}`}
            fontSize={14}
            fill="#333"
            fontStyle="bold"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default ForkliftAnimation;
