import Link from "next/link";
import React from "react";

interface AdminCardProps {
  href: string;
  Icon: React.ElementType;
  title: string;
  description: string;
}

const AdminCard: React.FC<AdminCardProps> = React.memo(
  ({ href, Icon, title, description }) => {
    return (
      <Link href={href}>
        <div className="h-full rounded-lg bg-premium-backgroundAlt p-6 text-center shadow-md transition-shadow duration-300 hover:bg-premium-backgroundDark hover:shadow-lg dark:bg-premium-secondaryLight dark:hover:bg-premium-secondaryDark">
          <Icon className="mx-auto mb-4 h-10 w-10 text-premium-primary dark:text-premium-primaryLight" />
          <h2 className="text-2xl font-semibold text-premium-textPrimary dark:text-premium-textPrimary">
            {title}
          </h2>
          <p className="mt-2 text-premium-textSecondary dark:text-premium-textSecondary">
            {description}
          </p>
        </div>
      </Link>
    );
  }
);

export default AdminCard;
