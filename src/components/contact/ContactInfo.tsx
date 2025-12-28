import clsx from "clsx";

interface ContactInfoProps {
  icon: JSX.Element;
  title: string;
  info: string;
  description?: string;
  py?: string;
}

export function ContactInfo({
  icon,
  title,
  info,
  description,
  py,
}: ContactInfoProps) {
  return (
    <div className={clsx("flex flex-col", py ? `py-${py}` : "py-4")}>
      <div className="mb-4 flex items-center">
        <h3 className="ml-2 text-xl font-bold text-white md:text-2xl">
          {title}
        </h3>
      </div>

      <div className="mb-5 ml-4 w-1/5 border-t border-white" />

      <div className="ml-5 flex flex-row gap-5">
        {icon}
        <div className="flex flex-col">
          <h4 className="mb-3 font-bold text-white">{info}</h4>

          {description && (
            <p className="text-client-textPlaceholder">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
