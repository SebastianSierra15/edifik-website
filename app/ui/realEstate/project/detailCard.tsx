type DetailCardProps = {
  icon: JSX.Element;
  label: string;
  value?: string;
};

export default function DetailCard({ icon, label, value }: DetailCardProps) {
  return (
    <div className="flex items-center rounded-lg bg-white p-2 py-3 shadow-md">
      <div className="mr-2 rounded-full bg-gray-200 p-3">{icon}</div>

      <div>
        <p className="text-brown-700 text-sm font-medium">{label}</p>
        {value && <p className="text-lg font-semibold">{value}</p>}
      </div>
    </div>
  );
}
