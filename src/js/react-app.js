// Small React app using ESM CDN imports and Framer Motion for smooth transitions
import React from 'https://cdn.skypack.dev/react@18.2.0';
import { createRoot } from 'https://cdn.skypack.dev/react-dom@18.2.0/client';
import { motion } from 'https://cdn.skypack.dev/framer-motion@10.12.16';
import { User, Robot, BarChart2 } from 'https://cdn.skypack.dev/lucide-react';
import { HoverEffect } from './components/hover-effect.js';

const PreviewCard = ({ Icon, text, href }) => {
  const content = (
    <motion.div
      className="preview-card card-hover"
      whileHover={{ y: -6, scale: 1.02 }}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.42 }}
    >
      {Icon ? <Icon size={28} /> : null}
      <span>{text}</span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </a>
    );
  }

  return content;
};

const PreviewGrid = () => {
  return (
    <motion.div
      className="dashboard-preview"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.06
          }
        }
      }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: 300 }}
    >
  <PreviewCard Icon={User} text="Digital Twin" />
  <PreviewCard Icon={Robot} text="AI Coach" href="chatbot.html" />
  <PreviewCard Icon={BarChart2} text="Risk Radar" />
    </motion.div>
  );
};

function mountApp() {
  const rootEl = document.getElementById('react-root');
  if (!rootEl) return;
  const root = createRoot(rootEl);
  const items = [
    { link: 'chatbot.html', title: 'AI Coach', description: 'Personalized assistant' },
    { link: '#', title: 'Risk Radar', description: 'Early warnings and insights' },
    { link: '#', title: 'Digital Twin', description: 'Health snapshot' },
  ];

  root.render(React.createElement(HoverEffect, { items }));
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
