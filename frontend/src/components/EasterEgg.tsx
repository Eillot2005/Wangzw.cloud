import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EasterEggProps {
  show: boolean;
  onComplete: () => void;
}

export default function EasterEgg({ show, onComplete }: EasterEggProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ fontSize: '100px' }}
          >
            ❤️
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              color: '#ff6b81',
              marginTop: '20px',
              fontSize: '32px',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255,107,129,0.5)'
            }}
          >
            你被偏爱了。
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
