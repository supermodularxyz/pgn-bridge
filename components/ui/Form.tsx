import { PropsWithChildren } from "react";
import { FormProvider, UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tv } from "tailwind-variants";

import { z } from "zod";

import { createComponent } from ".";

const input = tv({
  base: "bg-white text-gray-900 rounded focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2",
  variants: {
    size: {
      sm: "p-2 text-xs",
      md: "p-2 text-sm",
      lg: "p-3 text-md",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const label = tv({
  base: "text-xs uppercase tracking-widest text-gray-600",
});

const select = tv({
  base: "text-gray-900 bg-white text-sm rounded focus:ring-secondary-500 focus:border-secondary-500 block p-2",
});

export const Input = createComponent("input", input);
export const Label = createComponent("label", label);
export const Select = createComponent("select", select);

export interface FormProps<S extends z.ZodType<any, any>>
  extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: (values: z.infer<S>, reset: () => void) => void;
}

export function Form<S extends z.ZodType<any, any>>({
  defaultValues,
  schema,
  children,
  onSubmit,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({ defaultValues, resolver: zodResolver(schema) });
  // Pass the form methods to a FormProvider. This lets us access the form from components without passing props.
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values, form.reset))}
      >
        {children}
      </form>
    </FormProvider>
  );
}
