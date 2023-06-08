import {
  ComponentPropsWithRef,
  forwardRef,
  ReactNode,
  ElementType,
} from "react";
import { TVReturnType, TVSlots } from "tailwind-variants";

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type ComponentProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
} & ComponentPropsWithRef<C>;

// TODO: How to get props typings for the TV props (eg, color)?
export const createComponent = (
  tag: string | ElementType,
  variant: any
  //   variant: TVReturnType<any, any, any, any, any, any>
) => {
  // eslint-disable-next-line react/display-name
  const Comp = forwardRef(
    <C extends ElementType>(
      { as, className, ...props }: ComponentProps<C>,
      ref?: PolymorphicRef<C>
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const Component = as || tag;
      return (
        <Component
          ref={ref}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          className={variant({ class: className, ...props })}
          {...props}
        />
      );
    }
  );

  return Comp;
};
