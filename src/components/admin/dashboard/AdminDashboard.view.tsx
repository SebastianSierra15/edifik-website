import AdminCard from "./AdminCard";
import AdminCardSkeleton from "./AdminCardSkeleton";

interface DashboardCard {
  href: string;
  title: string;
  description: string;
  Icon: React.ElementType;
}

interface Props {
  status: "loading" | "authenticated" | "unauthenticated";
  cards: DashboardCard[];
  skeletonCount: number;
}

export function AdminDashboardView({ status, cards, skeletonCount }: Props) {
  return (
    <div className="container mx-auto min-h-[calc(100vh-200px)] bg-premium-background px-4 py-12 dark:bg-premium-background">
      <h1 className="mb-10 mt-20 text-center text-4xl font-semibold text-premium-primary lg:mt-16 dark:text-premium-primaryLight min-h-[4rem]">
        Bienvenido al Panel de Administración de EdifiK
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {status === "loading" &&
          Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={index}
              className="min-h-[200px] rounded-lg bg-premium-backgroundAlt dark:bg-premium-secondaryLight"
            >
              <AdminCardSkeleton />
            </div>
          ))}

        {status === "authenticated" &&
          cards.map(({ href, Icon, title, description }) => (
            <div
              key={href}
              className="min-h-[200px] rounded-lg bg-premium-backgroundAlt dark:bg-premium-secondaryLight"
            >
              <AdminCard
                href={href}
                Icon={Icon}
                title={title}
                description={description}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
