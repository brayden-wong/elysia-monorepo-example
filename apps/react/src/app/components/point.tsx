import { type DragControls, motion, useMotionValue } from "framer-motion";
import { useRef, type RefObject, useEffect } from "react";

type PointProps = {
  index: number;
  x: number;
  y: number;

  points: Array<[number, number]>;
  container: RefObject<HTMLElement>;
  controls: DragControls;
  setPoints: (points: Array<[number, number]>) => void;
  startDrag: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export function Point({
  x: initX,
  y: initY,
  container,
  points,
  index,
  controls,
  setPoints,
  startDrag,
}: PointProps) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  const X_OFFSET = useRef(0);
  const Y_OFFSET = useRef(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    X_OFFSET.current = rect.x;
    Y_OFFSET.current = rect.y;
  }, []);

  return (
    <motion.div
      ref={ref}
      drag
      draggable
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={container}
      onPointerDown={startDrag}
      onDragEnd={() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const point = points[index];

        point[0] = rect.x - X_OFFSET.current;
        point[1] = rect.y - Y_OFFSET.current;

        const newPoints = [...points];

        setPoints(newPoints);
      }}
      dragControls={controls}
      initial={{ x: x.get(), y: y.get() }}
      className="absolute w-16 h-16 bg-slate-900 rounded-lg cursor-pointer"
    />
  );
}
