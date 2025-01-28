import Loader from "@/app/ui/loader";

export default function page() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Loader size={50} />
    </div>
  );
}
