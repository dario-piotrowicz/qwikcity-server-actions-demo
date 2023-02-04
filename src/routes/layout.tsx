import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer></footer>
    </>
  );
});

export const head: DocumentHead = {
  title: "Demo/Test",
  meta: [
    {
      name: "description",
      content: "Just a demo/test",
    },
  ],
};
