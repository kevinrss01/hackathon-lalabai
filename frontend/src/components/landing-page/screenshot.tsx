interface ScreenshotProps {
  width: number;
  height: number;
  src: string;
  className?: string;
}

export const Screenshot = ({ width, height, src }: ScreenshotProps) => {
  return (
    <div
      className="relative"
      style={{
        aspectRatio: `${width}/${height}`,
      }}
    >
      <div className="absolute -inset-2 rounded-xl shadow-xs ring-1 ring-black/5" />
      <img alt="" src={src} className="h-full rounded-xl shadow-2xl ring-1 ring-black/10" />
    </div>
  );
};
