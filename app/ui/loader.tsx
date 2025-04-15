interface LoaderProps {
  size?: number;
}

export default function Loader({ size = 12 }: LoaderProps) {
  return (
    <div
      className="z-50 border-3 border-client-accentLight border-t-transparent rounded-full animate-spin"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${size / 6}px`,
      }}
    />
  );
}
