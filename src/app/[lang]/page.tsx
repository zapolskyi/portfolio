import { getDictionary } from "@/i18n/get-dictionary";

export default async function Home() {
  const { hero } = await getDictionary();

  return (
    <main>
      <p>{hero.greeting}</p>
      <h1>
        {hero.title[0]}
        <br />
        {hero.title[1]}
      </h1>
      <p>{hero.role}</p>
    </main>
  );
}
