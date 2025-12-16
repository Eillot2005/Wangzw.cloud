import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import ParticlesBackground from '../../components/ParticlesBackground';

const Card = ({ title, data, color }: { title: string, data: any, color: string }) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: 1 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '30px',
      border: `1px solid ${color}`,
      boxShadow: `0 10px 30px -10px ${color}`,
      textAlign: 'center',
      color: '#fff',
      flex: 1,
      minWidth: '300px',
    }}
  >
    <h3 style={{ fontSize: '24px', marginBottom: '20px', color: color, textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>{title}</h3>
    <div style={{ fontSize: '48px', fontWeight: 'bold', fontFamily: 'monospace' }}>
      {typeof data === 'number' ? (
        <span>{data} <span style={{ fontSize: '16px' }}>天</span></span>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '32px' }}>
          <div>{String(data.days).padStart(2, '0')}<span style={{ fontSize: '12px' }}>天</span></div>
          <div>{String(data.hours).padStart(2, '0')}<span style={{ fontSize: '12px' }}>时</span></div>
          <div>{String(data.minutes).padStart(2, '0')}<span style={{ fontSize: '12px' }}>分</span></div>
          <div>{String(data.seconds).padStart(2, '0')}<span style={{ fontSize: '12px' }}>秒</span></div>
        </div>
      )}
    </div>
  </motion.div>
);

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState<{
    daysTogether: number;
    nextAnniversary: { days: number; hours: number; minutes: number; seconds: number };
    nextHalfYear: { days: number; hours: number; minutes: number; seconds: number };
  } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const startDate = new Date('2025-08-18T00:00:00');
      const now = new Date();

      // 1. Days together
      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      const daysTogether = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 2. Next Anniversary (Aug 18)
      let nextAnnivDate = new Date(now.getFullYear(), 7, 18); // Month is 0-indexed, 7 is Aug
      if (now > nextAnnivDate) {
        nextAnnivDate.setFullYear(now.getFullYear() + 1);
      }
      const diffAnniv = nextAnnivDate.getTime() - now.getTime();

      // 3. Next Half Year (Feb 18)
      let nextHalfDate = new Date(now.getFullYear(), 1, 18); // 1 is Feb
      if (now > nextHalfDate) {
        nextHalfDate.setFullYear(now.getFullYear() + 1);
      }
      
      const diffHalf = nextHalfDate.getTime() - now.getTime();

      const getTimeParts = (ms: number) => ({
        days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hours: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((ms % (1000 * 60)) / 1000),
      });

      setTimeLeft({
        daysTogether,
        nextAnniversary: getTimeParts(diffAnniv),
        nextHalfYear: getTimeParts(diffHalf),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <Layout role="FRIEND">
      <ParticlesBackground />
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            fontSize: '48px',
            marginBottom: '50px',
            background: 'linear-gradient(to right, #ff9a9e, #fecfef)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255,105,180,0.5))'
          }}
        >
          💖 我们的时光 💖
        </motion.h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            style={{
              width: '100%',
              background: 'rgba(255, 105, 180, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '40px',
              textAlign: 'center',
              border: '2px solid rgba(255, 105, 180, 0.3)',
              boxShadow: '0 0 50px rgba(255, 105, 180, 0.2)',
              marginBottom: '20px'
            }}
          >
            <h2 style={{ color: '#ffb6c1', marginBottom: '10px' }}>我们已经相爱</h2>
            <div style={{ fontSize: '80px', fontWeight: '900', color: '#fff', textShadow: '0 0 20px #ff69b4' }}>
              {timeLeft.daysTogether}
              <span style={{ fontSize: '24px', marginLeft: '10px' }}>天</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>起始日: 2025年8月18日</div>
          </motion.div>

          <Card 
            title="距离下一个周年纪念日 (8.18)" 
            data={timeLeft.nextAnniversary} 
            color="#ff6b9d" 
          />
          
          <Card 
            title="距离下一个半周年 (2.18)" 
            data={timeLeft.nextHalfYear} 
            color="#9c88ff" 
          />
        </div>
      </div>
    </Layout>
  );
}
