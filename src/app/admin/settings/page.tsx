import ThemeSwitcher from "../../../components/shared/ThemeSwitcher";

export default async function SettingsPage() {
  return (
    <section className="h-full">
      <h1>Settings</h1>
      <ThemeSwitcher />
    </section>
  );
}
