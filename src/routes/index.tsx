import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { action$, Form, loader$ } from "@builder.io/qwik-city";

export const counterLoader = loader$(async () => {
  return 0;
});

type ActionResult = {
  newCounterValue: number;
  timestamp: number;
};

export const incrementAction = action$<ActionResult>(async (formData) => {
  const counter = Number.parseInt(formData.get("counter") as string);
  const timestamp = Date.now();
  return { newCounterValue: counter + 1, timestamp };
});

export const decrementAction = action$<ActionResult>(async (formData) => {
  const counter = Number.parseInt(formData.get("counter") as string);
  const timestamp = Date.now();
  return { newCounterValue: counter - 1, timestamp };
});

export default component$(() => {
  const counter = counterLoader.use();
  const lastOperation = useSignal<"incrementing" | "decrementing" | null>(null);

  const incrementActionUtils = incrementAction.use();
  const decrementActionUtils = decrementAction.use();

  useTask$(({ track }) => {
    track(() => incrementActionUtils.value);
    track(() => decrementActionUtils.value);

    let latestActionValue: ActionResult | undefined = undefined;
    if (
      (incrementActionUtils.value?.timestamp ?? -Infinity) >
      (decrementActionUtils.value?.timestamp ?? -Infinity)
    ) {
      latestActionValue = incrementActionUtils.value;
    } else {
      latestActionValue = decrementActionUtils.value;
    }

    if (latestActionValue) {
      counter.value = latestActionValue.newCounterValue;

      if (latestActionValue === incrementActionUtils?.value) {
        lastOperation.value = "incrementing";
      } else {
        lastOperation.value = "decrementing";
      }
    }
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
