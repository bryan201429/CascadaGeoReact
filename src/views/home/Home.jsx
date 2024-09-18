import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import reactLogo from './react.svg';
const paleta = ['#FF0033', '#FF6600', '#0099FF', '#FFFFFF'];


export default function Home() {
  const [shapes, setShapes] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(null);
  const [mouseDownTime, setMouseDownTime] = useState(0);
  const animationRef = useRef(null);
  const timeRef = useRef(null);

  const getRandomColor = () => {
    return paleta[Math.floor(Math.random() * paleta.length)];
  };

  const getRandomShape = () => {
    const shapes = ['cuadrado', 'circulo', 'triangulo', 'pentagono'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  useEffect(() => {
    const updatePositions = () => {
      setShapes((currentShapes) =>
        currentShapes.map((shape) => {
          const windowH = window.innerHeight;
          const shapeHeight = 70;
          const floor = windowH - shapeHeight;

          if (shape.id === isMouseDown) {
            return {
              ...shape,
              y: Math.max(shape.y + shape.speed / 60, 0),
              speed: shape.speed - 0.5,
            };
          } else if (shape.y <= 0) {
            return {
              ...shape,
              y: shape.y + shape.speed / 60,
              speed: 30,
            };
          } else if (shape.y >= floor) {
            return {
              ...shape,
              y: floor,
              speed: 0,
            };
          } else {
            if (shape.speed <= 0) {
              return {
                ...shape,
                y: shape.y + shape.speed / 60,
                speed: shape.speed + 1,
              };
            } else {
              return {
                ...shape,
                y: shape.y + shape.speed / 60,
                speed: shape.y < floor ? shape.speed + 1 : 0,
              };
            }
          }
        })
      );
      animationRef.current = requestAnimationFrame(updatePositions);
    };

    animationRef.current = requestAnimationFrame(updatePositions);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isMouseDown]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDown !== null) {
        clearInterval(timeRef.current);
        const newSpeed = mouseDownTime / 100;

        setShapes((currentShapes) =>
          currentShapes.map((shape) =>
            shape.id === isMouseDown
              ? { ...shape, speed: -newSpeed }
              : shape
          )
        );
        setIsMouseDown(null);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown, mouseDownTime]);

  const handleMouseDown = (id) => {
    setIsMouseDown(id);
    setMouseDownTime(0);
    timeRef.current = setInterval(() => {
      setMouseDownTime((prev) => prev + 100);
    }, 100);
  };

  const addShape = () => {
    const randomShape = getRandomShape();
    const randomColor = getRandomColor();
    setShapes([
      ...shapes,
      {
        id: shapes.length,
        x: Math.random() * (window.innerWidth - 50),
        y: 0,
        speed: 0,
        shape: randomShape,
        color: randomColor,
      },
    ]);
  };

  return (
    <div>
      {shapes.map((shape, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            width: 70,
            height: 70,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'filter 0.3s ease',
            filter: `drop-shadow(0 0 3px ${shape.color}) drop-shadow(0 0 6px ${shape.color})`,
            cursor: 'pointer',
          }}
          onMouseDown={() => handleMouseDown(shape.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = `drop-shadow(0 0 15px ${shape.color}) drop-shadow(0 0 30px ${shape.color})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = `drop-shadow(0 0 3px ${shape.color}) drop-shadow(0 0 6px ${shape.color})`;
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: shape.color,
              borderRadius: shape.shape === 'circulo' ? '50%' : '0%',
              clipPath:
                shape.shape === 'triangulo'
                  ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  : shape.shape === 'pentagono'
                  ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                  : 'none',
            }}
          />
        </div>
      ))}
      <div id='Contenedor'>
        <h2>Cascada Geométrica</h2>
        <h2>Bryan Fausto Coaguila Torres</h2>
        <img src={reactLogo} alt='reactlogo' />
        <button id ='agregarBtn'onClick={addShape}>Agregar Figura</button>
        <button id='clearBtn' onClick={() => setShapes([])}>Limpiar</button>
      </div>
    </div>
  );
}
