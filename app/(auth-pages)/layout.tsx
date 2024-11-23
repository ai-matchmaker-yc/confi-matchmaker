export default async function Layout({
  children, points
}: {
  children: React.ReactNode;
  points: number
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
  );
}
