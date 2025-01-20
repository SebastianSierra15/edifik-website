export default function SkeletonAdminCard() {
  return (
    <div className="h-full animate-pulse rounded-lg bg-premium-backgroundAlt p-6 text-center shadow-md dark:bg-premium-secondaryLight">
      <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-premium-backgroundDark dark:bg-premium-secondaryDark"></div>
      <div className="h-6 w-3/4 mx-auto rounded-md bg-premium-backgroundDark dark:bg-premium-secondaryDark"></div>
      <div className="mt-4 h-4 w-5/6 mx-auto rounded-md bg-premium-backgroundDark dark:bg-premium-secondaryDark"></div>
    </div>
  );
}
