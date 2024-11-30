type DetailCardProps = {
  icon: JSX.Element;
  label: string;
  value?: string;
};

export default function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div
      className="flex items-center p-2 py-4 shadow-md rounded-lg bg-white"
      style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="p-3 rounded-full mr-2 bg-gray-200">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-brown-700">{label}</p>
        {value && <p className="text-lg font-bold text-brown-600">{value}</p>}
      </div>
    </div>
  );
}
