import {
  cloneElement,
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactElement,
} from "react";
import {
  FormProvider,
  UseFormProps,
  useFormContext,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tv } from "tailwind-variants";

import { z } from "zod";
import clsx from "clsx";

import { createComponent } from ".";

const input = tv({
  base: "border border-gray-300 text-gray-900 rounded focus:ring-secondary-500 focus:border-secondary-500 block w-full p-2",
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
  base: "text-sm text-gray-500",
});

const select = tv({
  base: "border bg-gray-100 border-gray-300 text-gray-900 text-sm rounded focus:ring-secondary-500 focus:border-secondary-500 block p-2",
});

export const Input = createComponent("input", input);
export const Label = createComponent("label", label);
export const Select = createComponent("select", select);

export interface FormProps<S extends z.ZodType<any, any>>
  extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: (values: z.infer<S>) => void;
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
  console.log(form.formState.errors);
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
