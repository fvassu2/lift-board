import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva';
import { useStore } from '../../store/useStore';
import { AnimationState } from '../../types';

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 300;

const POSITIONS = {
  neutral: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
  origin: { x: 100, y: CANVAS_HEIGHT / 2 },
  destination: { x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT / 2 },
};

export const ForkliftAnimation = () => {
  const { animationState, currentMission } = useStore();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [forkliftPos, setForkliftPos] = useState(POSITIONS.neutral);
  const [binsLoaded, setBinsLoaded] = useState(false);
  const currentPosRef = useRef({ ...POSITIONS.neutral });

  // Update bins loaded state based on animation state
  useEffect(() => {
    if (animationState === AnimationState.LOADING) {
      const timeout = setTimeout(() => setBinsLoaded(true), 800);
      return () => clearTimeout(timeout);
    }
    
    if (animationState === AnimationState.UNLOADING) {
      const timeout = setTimeout(() => setBinsLoaded(false), 800);
      return () => clearTimeout(timeout);
    }
    
    if (animationState === AnimationState.MOVING_TO_ORIGIN || 
        animationState === AnimationState.RETURNING || 
        animationState === AnimationState.COMPLETED ||
        animationState === AnimationState.IDLE) {
      const timeout = setTimeout(() => setBinsLoaded(false), 0);
      return () => clearTimeout(timeout);
    }
  }, [animationState]);

  // Animate forklift position
  useEffect(() => {
    const speed = 2;
    
    // Determine target position based on animation state
    const targetPos = (() => {
      switch (animationState) {
        case AnimationState.MOVING_TO_ORIGIN:
        case AnimationState.LOADING:
          return POSITIONS.origin;
        case AnimationState.MOVING_TO_DEST:
        case AnimationState.UNLOADING:
          return POSITIONS.destination;
        case AnimationState.RETURNING:
        case AnimationState.COMPLETED:
        case AnimationState.IDLE:
        default:
          return POSITIONS.neutral;
      }
    })();

    const animate = () => {
      const dx = targetPos.x - currentPosRef.current.x;
      const dy = targetPos.y - currentPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > speed) {
        currentPosRef.current.x += (dx / distance) * speed;
        currentPosRef.current.y += (dy / distance) * speed;
        setForkliftPos({ ...currentPosRef.current });
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentPosRef.current = { ...targetPos };
        setForkliftPos({ ...targetPos });
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState]);

  const renderForklift = () => {
    const pos = forkliftPos;
    const forkliftColor = '#f97316'; // orange

    return (
      <>
        {/* Forklift Body */}
        <Rect
          x={pos.x - 25}
          y={pos.y - 15}
          width={50}
          height={30}
          fill={forkliftColor}
          cornerRadius={5}
        />
        
        {/* Forklift Fork */}
        <Rect
          x={pos.x + 20}
          y={pos.y - 8}
          width={15}
          height={4}
          fill="#666"
        />
        <Rect
          x={pos.x + 20}
          y={pos.y + 4}
          width={15}
          height={4}
          fill="#666"
        />

        {/* Wheels */}
        <Circle
          x={pos.x - 12}
          y={pos.y + 20}
          radius={6}
          fill="#333"
        />
        <Circle
          x={pos.x + 12}
          y={pos.y + 20}
          radius={6}
          fill="#333"
        />

        {/* Bins if loaded */}
        {binsLoaded && (
          <>
            <Rect
              x={pos.x + 30}
              y={pos.y - 25}
              width={20}
              height={20}
              fill="#8b4513"
              stroke="#654321"
              strokeWidth={2}
            />
            <Rect
              x={pos.x + 30}
              y={pos.y - 5}
              width={20}
              height={20}
              fill="#8b4513"
              stroke="#654321"
              strokeWidth={2}
            />
          </>
        )}
      </>
    );
  };

  const renderLocation = (pos: { x: number; y: number }, label: string, isOrigin: boolean) => {
    const color = isOrigin ? '#10b981' : '#3b82f6';
    return (
      <>
        <Circle
          x={pos.x}
          y={pos.y}
          radius={30}
          fill={color}
          opacity={0.3}
        />
        <Circle
          x={pos.x}
          y={pos.y}
          radius={20}
          fill={color}
          opacity={0.5}
        />
        <Text
          x={pos.x - 20}
          y={pos.y + 40}
          width={40}
          text={label}
          fontSize={14}
          fontStyle="bold"
          fill="#333"
          align="center"
        />
      </>
    );
  };

  const renderPath = () => {
    return (
      <Line
        points={[POSITIONS.origin.x, POSITIONS.origin.y, POSITIONS.destination.x, POSITIONS.destination.y]}
        stroke="#ddd"
        strokeWidth={3}
        dash={[10, 5]}
      />
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-700">Animazione Trasporto</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          animationState === AnimationState.IDLE ? 'bg-gray-200 text-gray-700' :
          animationState === AnimationState.COMPLETED ? 'bg-green-200 text-green-800' :
          'bg-blue-200 text-blue-800'
        }`}>
          {animationState === AnimationState.IDLE ? 'In Attesa' :
           animationState === AnimationState.MOVING_TO_ORIGIN ? 'Verso Origine' :
           animationState === AnimationState.LOADING ? 'Caricamento' :
           animationState === AnimationState.MOVING_TO_DEST ? 'Verso Destinazione' :
           animationState === AnimationState.UNLOADING ? 'Scaricamento' :
           animationState === AnimationState.RETURNING ? 'Ritorno' :
           'Completato'}
        </span>
      </div>
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill="#f9fafb"
          />

          {/* Path */}
          {renderPath()}

          {/* Origin & Destination */}
          {renderLocation(POSITIONS.origin, currentMission?.origin.name.split(' ')[0] || 'ORIGINE', true)}
          {renderLocation(POSITIONS.destination, currentMission?.destination.name.split(' ')[0] || 'DEST', false)}

          {/* Forklift */}
          {renderForklift()}
        </Layer>
      </Stage>
    </div>
  );
};
