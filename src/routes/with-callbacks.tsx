// @ts-nocheck
/* eslint-disable */
import { component$, useSignal } from "@builder.io/qwik";
import { action$, Form, loader$ } from "@builder.io/qwik-city";

export const counterLoader = loader$(async () => {
  return 0;
});

export const incrementAction = action$(async (formData) => {
  const counter = Number.parseInt(formData.get("counter") as string);
  return { newCounterValue: counter + 1 };
});

export const decrementAction = action$(async (formData) => {
  const counter = Number.parseInt(formData.get("counter") as string);
  return { newCounterValue: counter - 1 };
});

export default component$(() => {
  const counter = counterLoader.use();
  const lastOperation = useSignal<"incrementing" | "decrementing" | null>(null);

  const incrementActionUtils = incrementAction.use();
  const decrementActionUtils = decrementAction.use();

  incrementActionUtils.onSuccess(({ newCounterValue }) => {
    counter.value = newCounterValue;
    lastOperation.value = "incrementing";
  });

  decrementActionUtils.onSuccess(({ newCounterValue }) => {
    counter.value = newCounterValue;
    lastOperation.value = "decrementing";
  });

  return (
    <div>
      <Form action={decrementActionUtils}>
        <input hidden name="counter" readOnly value={`${counter.value}`} />
        <button>-</button>
      </Form>
      <span>{`${counter.value}`}</span>
      <Form action={incrementActionUtils}>
        <input hidden name="counter" readOnly value={`${counter.value}`} />
        <button>+</button>
      </Form>
      {lastOperation.value && (
        <p>
          The last operation performed was{" "}
          <strong>{lastOperation.value}</strong> the counter
        </p>
      )}
    </div>
  );
});
