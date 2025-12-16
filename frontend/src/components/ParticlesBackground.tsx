import { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 30,
    interactivity: {
      events: {
        onClick: {
          enable: false,
        },
        onHover: {
          enable: false,
        },
      },
    },
    particles: {
      color: {
        value: ['#ff0000', '#ff6b9d', '#ffb6c1', '#ffffff', '#ff1493'],
      },
      links: {
        enable: false,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'out' as const,
        },
        random: true,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000,
        },
        value: 30,
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.2,
          sync: false,
        },
      },
      shape: {
        type: 'heart',
      },
      size: {
        value: { min: 12, max: 20 },
        animation: {
          enable: false,
        },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: 'random' as const,
        animation: {
          enable: false,
        },
      },
    },
    detectRetina: true,
  }), []);

  return (
    <Particles
      id="tsparticles"
      // @ts-ignore
      init={particlesInit}
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
