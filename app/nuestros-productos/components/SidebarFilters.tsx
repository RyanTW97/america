"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface FilterGroup {
  title: string;
  name: string;
  options: string[];
}

const SidebarFilters = ({ filters }: { filters: FilterGroup[] }) => {
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggleOption = (group: string, value: string) => {
    setSelected((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  return (
    <div className=" w-full md:w-[270px] ">
      <Accordion type="multiple" defaultValue={["lineas"]}>
        <div className="space-y-2">
          {filters.map((group) => (
            <AccordionItem
              value={group.name}
              key={group.name}
              className="bg-white border rounded-lg shadow-sm overflow-hidden"
            >
              <div className="bg-zinc-100 px-4 py-2">
                <AccordionTrigger className="text-left text-sm font-semibold uppercase text-zinc-700">
                  {group.title}
                </AccordionTrigger>
              </div>
              <AccordionContent className="px-4 pb-3 pt-1 bg-white">
                <div className="space-y-1">
                  {group.options.map((option, idx) => (
                    <div key={option}>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-zinc-800">{option}</span>
                        <Checkbox
                          checked={
                            selected[group.name]?.includes(option) || false
                          }
                          onCheckedChange={() =>
                            toggleOption(group.name, option)
                          }
                          className="border-zinc-400"
                        />
                      </div>
                      {idx !== group.options.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default SidebarFilters;
