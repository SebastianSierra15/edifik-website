type DetailCardProps = {
  icon: JSX.Element;
  label: string;
  value?: string;
};

export default function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div
      className="flex items-center rounded-lg bg-white p-2 py-3 shadow-md"
      style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="mr-2 rounded-full bg-gray-200 p-3">{icon}</div>
      <div>
        <p className="text-brown-700 text-sm font-semibold">{label}</p>
        {value && <p className="text-brown-600 text-lg font-bold">{value}</p>}
      </div>
    </div>
  );
}
