import * as Headless from "@headlessui/react";
import clsx from "clsx";

type Props = {
  name: string;
  type: string;
  label?: string;
  description?: string;
  className?: string;
};

export const Input = ({ name, type, label, description, className }: Props) => {
  return (
    <div className={className}>
      <Headless.Field>
        {label && (
          <Headless.Label className="text-sm/6 font-medium text-white">
            {label}
          </Headless.Label>
        )}
        {description && (
          <Headless.Description className="text-sm/6 text-white/50">
            {description}
          </Headless.Description>
        )}
        <input
          name={name}
          type={type}
          className={clsx(
            "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
          )}
        />
      </Headless.Field>
    </div>
  );
};
