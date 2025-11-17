import React from 'https://cdn.skypack.dev/react@18.2.0';
import { AnimatePresence, motion } from 'https://cdn.skypack.dev/framer-motion@10.12.16';
import { cn } from '../../../lib/utils.js';

// Plain-JS (no JSX) implementation so this module can be loaded directly in the browser
export const HoverEffect = ({ items = [], className }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return React.createElement(
    'div',
    { className: cn('grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10', className) },
    items.map((item, idx) => {
      const anchorProps = {
        href: item?.link || '#',
        key: item?.link || idx,
        className: 'relative group  block p-2 h-full w-full',
        onMouseEnter: () => setHoveredIndex(idx),
        onMouseLeave: () => setHoveredIndex(null),
      };

      const hoverBackground = hoveredIndex === idx
        ? React.createElement(
            motion.span,
            {
              className: 'absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl',
              layoutId: 'hoverBackground',
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { duration: 0.15 } },
              exit: { opacity: 0, transition: { duration: 0.15, delay: 0.2 } },
            }
          )
        : null;

      return React.createElement(
        'a',
        anchorProps,
        React.createElement(AnimatePresence, null, hoverBackground),
        React.createElement(Card, null,
          React.createElement(CardTitle, null, item.title),
          React.createElement(CardDescription, null, item.description)
        )
      );
    })
  );
};

export const Card = ({ className, children }) => {
  return React.createElement(
    'div',
    {
      className: cn(
        'rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20',
        className
      ),
    },
    React.createElement('div', { className: 'relative z-50' }, React.createElement('div', { className: 'p-4' }, children))
  );
};

export const CardTitle = ({ className, children }) => {
  return React.createElement('h4', { className: cn('text-zinc-100 font-bold tracking-wide mt-4', className) }, children);
};

export const CardDescription = ({ className, children }) => {
  return React.createElement('p', { className: cn('mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm', className) }, children);
};
