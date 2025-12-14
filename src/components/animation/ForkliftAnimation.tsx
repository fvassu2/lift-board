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
  const forkliftPosRef = useRef({ x: POSITIONS.neutral.x, y: POSITIONS.neutral.y });
  const binsLoadedRef = useRef(false);
  const [, setRenderTrigger] = useState(0);

  const forceRender = () => {
    setRenderTrigger(prev => prev + 1);
  };

  useEffect(() => {
    let targetPos = { ...POSITIONS.neutral };
    let speed = 2;

    switch (animationState) {
      case AnimationState.MOVING_TO_ORIGIN:
        targetPos = POSITIONS.origin;
        binsLoadedRef.current = false;
        break;
      case AnimationState.LOADING:
        targetPos = POSITIONS.origin;
        setTimeout(() => {
          binsLoadedRef.current = true;
          forceRender();
        }, 800);
        break;
      case AnimationState.MOVING_TO_DEST:
        targetPos = POSITIONS.destination;
        break;
      case AnimationState.UNLOADING:
        targetPos = POSITIONS.destination;
        setTimeout(() => {
          binsLoadedRef.current = false;
          forceRender();
        }, 800);
        break;
      case AnimationState.RETURNING:
      case AnimationState.COMPLETED:
        targetPos = POSITIONS.neutral;
        binsLoadedRef.current = false;
        break;
      default:
        targetPos = POSITIONS.neutral;
        forkliftPosRef.current = { ...POSITIONS.neutral };
    }

    const animate = () => {
      const dx = targetPos.x - forkliftPosRef.current.x;
      const dy = targetPos.y - forkliftPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > speed) {
        forkliftPosRef.current.x += (dx / distance) * speed;
        forkliftPosRef.current.y += (dy / distance) * speed;
        forceRender();
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        forkliftPosRef.current = { ...targetPos };
        forceRender();
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
    const pos = forkliftPosRef.current;
    const forkliftColor = '#f97316'; // orange
    const binsLoaded = binsLoadedRef.current;

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
