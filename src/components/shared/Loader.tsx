interface LoaderProps {
  size?: number;
  message?: string;
}

export function Loader({ size = 12, message }: LoaderProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="z-50 border-3 border-client-accentLight border-t-transparent rounded-full animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 6}px`,
        }}
      />
      {message && (
        <p className="mt-3 text-sm text-white text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
}
