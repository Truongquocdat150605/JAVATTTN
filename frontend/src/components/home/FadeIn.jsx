/**
 * @file FadeIn.jsx
 * @description Component giúp tạo hiệu ứng mờ dần (fade-in) từ dưới lên khi cuộn chuột đến các phần tử trên trang.
 * @module components/home
 */
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FadeIn = ({ children, delay = 0 }) => {
  const ctrl = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  useEffect(() => { if (inView) ctrl.start("visible"); }, [ctrl, inView]);
  return (
    <motion.div ref={ref} animate={ctrl} initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 36 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}>
      {children}
    </motion.div>
  );
};

export default FadeIn;
