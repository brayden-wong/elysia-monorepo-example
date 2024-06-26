import { api } from "libs";
import { LevelSelector } from "./components/level-selector";

export default async function MainPage() {
  /* Load data from the backend */
  const { data: levels, error } = await api.levels.get();

  /* Handle loading and error states */
  if (error) {
    return <div>Failed to load levels</div>;
  }

  /* Returns JSX that shows the level selector */
  return (
    <main className="h-screen overflow-hidden flex flex-col space-y-2">
      <header className="shrink-0 border-b-2 border-black py-2 text-2xl px-4">
        <h1>Drunken Duck Level Editor</h1>
      </header>
      <h2 className="text-lg px-4 shrink-0">Level Overview</h2>
      <LevelSelector levels={levels ?? []} />
    </main>
  );
}
