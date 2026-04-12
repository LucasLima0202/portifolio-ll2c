import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setHovering(true);
      }
    };

    const onOut = () => setHovering(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf: number;
    const animate = () => {
      circlePos.current.x += (mousePos.current.x - circlePos.current.x) * 0.15;
      circlePos.current.y += (mousePos.current.y - circlePos.current.y) * 0.15;
      if (circleRef.current) {
        const size = hovering ? 32 : 22;
        circleRef.current.style.transform = `translate(${circlePos.current.x - size / 2}px, ${circlePos.current.y - size / 2}px)`;
        circleRef.current.style.width = `${size}px`;
        circleRef.current.style.height = `${size}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, [visible, hovering]);

  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-200"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "white",
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={circleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,opacity] duration-200"
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.5)",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
