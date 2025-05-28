// app/nuestros-productos/components/SidebarFilters.tsx
"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Definición de la estructura para una opción de filtro individual
export interface FilterOption {
  label: string; // Texto que se muestra en la UI
  value: string; // Valor usado en el query param y para la API
}

// Definición de la estructura para un grupo de filtros (ej: "Líneas", "Acabados")
export interface FilterGroup {
  title: string; // Título del acordeón
  name: string; // Nombre del parámetro en la URL (ej: "lineas")
  options: FilterOption[]; // Array de opciones para este grupo
}

// Props que espera el componente SidebarFilters
interface SidebarFiltersProps {
  filterGroups: FilterGroup[];
}

// Nombre del parámetro de búsqueda en la URL que se limpiará al aplicar un filtro del sidebar
const SEARCH_QUERY_PARAM_NAME = "q";

const SidebarFilters = ({ filterGroups }: SidebarFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Función memoizada para manejar el cambio de estado de un checkbox de filtro
  const handleFilterChange = useCallback(
    (groupName: string, optionValue: string, isChecked: boolean) => {
      const currentParams = new URLSearchParams(
        Array.from(searchParams.entries()) // Clonar los parámetros actuales
      );

      // Limpiar el parámetro de búsqueda 'q' cuando se interactúa con filtros del sidebar,
      // dando prioridad al filtro del sidebar sobre una búsqueda previa.
      currentParams.delete(SEARCH_QUERY_PARAM_NAME);

      // Obtener todos los valores actuales para este grupo de filtro
      let groupValues = currentParams.getAll(groupName);

      if (isChecked) {
        // Añadir el valor si no está ya presente (evita duplicados)
        if (!groupValues.includes(optionValue)) {
          currentParams.append(groupName, optionValue);
        }
      } else {
        // Eliminar el valor específico del grupo
        // Se reconstruyen los parámetros para este grupo sin el valor deseleccionado
        currentParams.delete(groupName); // Eliminar todas las instancias de esta clave de grupo
        groupValues
          .filter((v) => v !== optionValue) // Filtrar el valor desmarcado
          .forEach((val) => currentParams.append(groupName, val)); // Añadir de nuevo los restantes
      }

      // Resetear siempre a la primera página al cambiar un filtro
      currentParams.set("page", "1");

      // Navegar a la nueva URL con los parámetros actualizados
      // scroll: false evita que la página salte al inicio
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname] // Dependencias de useCallback
  );

  // Si no hay grupos de filtros para mostrar
  if (!filterGroups || filterGroups.length === 0) {
    return <p className="text-sm text-zinc-500">No hay filtros disponibles.</p>;
  }

  // Determinar qué acordeones abrir por defecto (ej: el primero)
  const defaultOpenAccordions =
    filterGroups.length > 0 ? [filterGroups[0].name] : [];

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenAccordions} // Abre el primer grupo por defecto
        className="space-y-2" // Espacio entre los items del acordeón
      >
        {filterGroups.map((group) => {
          // Obtener las opciones actualmente seleccionadas para este grupo desde la URL
          const selectedGroupOptions = searchParams.getAll(group.name);

          return (
            <AccordionItem
              value={group.name} // Usado por el componente Accordion para controlar el estado abierto/cerrado
              key={group.name}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              <AccordionTrigger className="w-full bg-zinc-50 px-4 py-3 text-left text-sm font-semibold uppercase text-zinc-700 hover:bg-zinc-100 hover:no-underline">
                {group.title}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4 pb-3 pt-2">
                <div className="space-y-1">
                  {group.options.map((option, idx) => {
                    const isChecked = selectedGroupOptions.includes(
                      option.value
                    );
                    const checkboxId = `${group.name}-${option.value}-${idx}`; // ID único para el checkbox y label

                    return (
                      <div key={option.value + idx}>
                        {" "}
                        {/* Clave única para cada opción */}
                        <div className="flex items-center justify-between py-1.5">
                          <label
                            htmlFor={checkboxId}
                            className="flex-grow cursor-pointer text-sm text-zinc-800 hover:text-blue-600"
                          >
                            {option.label}
                          </label>
                          <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={(checkedState) => {
                              // El estado puede ser true, false, o 'indeterminate'
                              // Nos interesa si es true (marcado) o false (desmarcado)
                              handleFilterChange(
                                group.name,
                                option.value,
                                !!checkedState // Convertir a booleano explícitamente
                              );
                            }}
                            aria-labelledby={checkboxId} // Mejora accesibilidad
                            className="border-zinc-400 data-[state=checked]:border-gray-800 data-[state=checked]:bg-gray-800"
                          />
                        </div>
                        {/* Añadir separador excepto después de la última opción */}
                        {idx < group.options.length - 1 && (
                          <Separator className="my-1 bg-zinc-200" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default SidebarFilters;
