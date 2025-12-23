export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      User Header
      {children}
      User Footer
    </section>
  );
}
