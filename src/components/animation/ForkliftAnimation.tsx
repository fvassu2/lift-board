import React, { useEffect, useRef } from 'react';
import type { AnimationState } from '../../types';

interface ForkliftAnimationProps {
  animationState: AnimationState;
}

const ForkliftAnimation: React.FC<ForkliftAnimationProps> = ({ animationState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Animation parameters
    const forkliftWidth = 80;
    const forkliftHeight = 60;
    const binSize = 40;
    const originX = 50;
    const destinationX = width - 150;
    const centerY = height / 2;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);

      // Draw origin and destination zones
      ctx.fillStyle = '#dbeafe';
      ctx.fillRect(20, 20, 100, height - 40);
      ctx.fillStyle = '#dcfce7';
      ctx.fillRect(width - 120, 20, 100, height - 40);

      // Labels
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ORIGINE', 70, 30);
      ctx.fillStyle = '#22c55e';
      ctx.fillText('DESTINAZIONE', width - 70, 30);

      let forkliftX = originX + 100;
      let binX = originX;
      let binY = centerY - binSize / 2;
      let forkliftCarrying = false;

      // Update animation based on state
      switch (animationState) {
        case 'idle':
          progressRef.current = 0;
          forkliftX = originX + 100;
          break;

        case 'moving_to_pickup':
          progressRef.current += 0.02;
          if (progressRef.current > 1) progressRef.current = 1;
          forkliftX = originX + 100 - (progressRef.current * 50);
          break;

        case 'picking_up':
          forkliftX = originX + 50;
          binY = centerY - binSize / 2 - Math.sin(progressRef.current * Math.PI) * 20;
          progressRef.current += 0.03;
          if (progressRef.current > 1) {
            progressRef.current = 0;
            forkliftCarrying = true;
          }
          break;

        case 'moving_to_delivery':
          progressRef.current += 0.015;
          if (progressRef.current > 1) progressRef.current = 1;
          forkliftX = originX + 50 + (progressRef.current * (destinationX - originX - 50));
          binX = forkliftX;
          binY = centerY - binSize / 2 - 30;
          forkliftCarrying = true;
          break;

        case 'delivering':
          forkliftX = destinationX;
          binX = destinationX;
          binY = centerY - binSize / 2 - 30 + (progressRef.current * 30);
          progressRef.current += 0.03;
          if (progressRef.current > 1) progressRef.current = 1;
          forkliftCarrying = true;
          break;

        case 'complete':
          forkliftX = destinationX;
          binX = destinationX;
          binY = centerY - binSize / 2;
          break;
      }

      // Draw bins at origin (if not picked up)
      if (!forkliftCarrying && animationState !== 'complete') {
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(binX + i * 15, binY + i * 5, binSize, binSize);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.strokeRect(binX + i * 15, binY + i * 5, binSize, binSize);
        }
      }

      // Draw bins being carried or at destination
      if (forkliftCarrying || animationState === 'complete') {
        const drawBinX = animationState === 'complete' ? destinationX : binX;
        const drawBinY = animationState === 'complete' ? centerY - binSize / 2 : binY;
        
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(drawBinX + i * 15, drawBinY + i * 5, binSize, binSize);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.strokeRect(drawBinX + i * 15, drawBinY + i * 5, binSize, binSize);
        }
      }

      // Draw forklift
      // Body
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(forkliftX, centerY - forkliftHeight / 2, forkliftWidth, forkliftHeight);
      
      // Cabin
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(forkliftX + 10, centerY - forkliftHeight / 2 - 20, 30, 25);
      
      // Forks
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(forkliftX - 20, centerY + 5, 25, 5);
      ctx.fillRect(forkliftX - 20, centerY + 15, 25, 5);
      
      // Wheels
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(forkliftX + 15, centerY + forkliftHeight / 2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(forkliftX + forkliftWidth - 15, centerY + forkliftHeight / 2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();

      // Motion lines when moving
      if (animationState === 'moving_to_delivery' || animationState === 'moving_to_pickup') {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(forkliftX - 30 - i * 10, centerY - 10 + i * 10);
          ctx.lineTo(forkliftX - 50 - i * 10, centerY - 10 + i * 10);
          ctx.stroke();
        }
      }

      // Status text
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      const statusText = {
        idle: 'Pronto',
        moving_to_pickup: 'Andando al prelievo...',
        picking_up: 'Caricamento...',
        moving_to_delivery: 'Trasporto in corso...',
        delivering: 'Scaricamento...',
        complete: 'Completato! ✓',
      }[animationState];
      ctx.fillText(statusText, width / 2, height - 20);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState]);

  // Reset progress when animation state changes
  useEffect(() => {
    progressRef.current = 0;
  }, [animationState]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Animazione Movimento</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={250}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
};

export default ForkliftAnimation;
