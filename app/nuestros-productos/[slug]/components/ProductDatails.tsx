// app/nuestros-productos/[slug]/components/ProductDetails.tsx
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
// Asegúrate de que tus tipos estén correctamente definidos y exportados
import { ProductAttributes, ColorOptionData } from "@/app/types/productPage";
import ProductImageDisplay from "./ProductImageDisplay";
import ProductPrimaryInfo from "./ProductPrimaryInfo";
import ProductTechnicalSpecs from "./ProductTechnicalSpecs";
import ProductAdvantages from "./ProductAdvantages";
import ProductActions from "./ProductActions";

interface ProductDetailsProps {
  productId: number;
  productAttributes: ProductAttributes;
}

const ProductDetails = ({
  productId,
  productAttributes,
}: ProductDetailsProps) => {
  const {
    titulo,
    slug,
    descripcion,
    imagen,
    selloCalidad,
    colores,
    presentacion,
    tipoPintura,
    brillo,
    tiempoSecado,
    usoRecomendado,
    varianteColores,
    norma,
    ventajas,
    ficha_Tecnica,
  } = productAttributes;

  const [selectedPresentation, setSelectedPresentation] = useState<
    string | null
  >(null);
  const [selectedColor, setSelectedColor] = useState<ColorOptionData | null>(
    null
  );

  useEffect(() => {
    if (
      productAttributes.presentacion &&
      productAttributes.presentacion.length > 0 &&
      !selectedPresentation
    ) {
      setSelectedPresentation(productAttributes.presentacion[0].presentacion);
    }
    // Inicializar color seleccionado si es necesario
    // if (productAttributes.colores && productAttributes.colores.length > 0 && !selectedColor) {
    //   setSelectedColor(productAttributes.colores[0]);
    // }
  }, [
    productAttributes.presentacion,
    productAttributes.colores,
    selectedPresentation,
    selectedColor,
  ]);

  const handlePresentationSelect = (presentationValue: string) => {
    setSelectedPresentation(presentationValue);
  };

  const handleColorSelect = (color: ColorOptionData) => {
    setSelectedColor(color);
  };

  const hasSello = !!(
    selloCalidad?.data &&
    (Array.isArray(selloCalidad.data) ? selloCalidad.data.length > 0 : true) &&
    (Array.isArray(selloCalidad.data)
      ? selloCalidad.data[0]?.attributes?.url
      : selloCalidad.data.attributes?.url)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sección Superior: Imagen e Información Primaria */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
        <div className="flex items-start justify-center pt-0 md:col-span-5 md:pt-2 lg:col-span-5 xl:col-span-4">
          <ProductImageDisplay
            productId={productId}
            imageUrl={imagen?.data?.attributes.url}
            altText={imagen?.data?.attributes.alternativeText || titulo}
            hasSelloCalidad={hasSello}
          />
        </div>
        <div className="space-y-6 md:col-span-7 lg:col-span-7 xl:col-span-8">
          <ProductPrimaryInfo
            titulo={titulo}
            selloCalidad={selloCalidad}
            descripcion={descripcion}
            colores={colores}
            presentaciones={presentacion}
            selectedPresentation={selectedPresentation}
            onPresentationSelect={handlePresentationSelect}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        </div>
      </div>

      <Separator className="my-8 bg-blue-800 sm:my-10 md:my-12" />

      {/* Especificaciones Técnicas - Ancho Completo */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <ProductTechnicalSpecs
          tipoPintura={tipoPintura}
          brillo={brillo}
          tiempoSecado={tiempoSecado}
          usoRecomendado={usoRecomendado}
          varianteColores={varianteColores}
          norma={norma}
        />
      </div>

      {/* Sección Ventajas y Acciones en dos columnas */}
      <div className="relative grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:gap-x-12">
        {/* Línea divisoria vertical (solo visible en pantallas md y mayores) */}
        <div
          className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 transform bg-blue-800 md:block"
          aria-hidden="true"
        ></div>

        {/* Columna Izquierda: Ventajas */}
        <div className="pr-0 md:pr-4 lg:pr-6">
          {" "}
          {/* Padding a la derecha para separar de la línea */}
          <ProductAdvantages ventajas={ventajas} />
        </div>

        {/* Columna Derecha: Acciones (Cotizar, Descargar) */}
        {/* 'flex items-center' para centrar verticalmente ProductActions si su contenido es más bajo */}
        <div className="flex items-center pl-0 md:pl-4 lg:pl-6">
          {" "}
          {/* Padding a la izquierda para separar de la línea */}
          <div className="w-full">
            {" "}
            {/* Div adicional para asegurar que ProductActions pueda ocupar el ancho */}
            <ProductActions
              productTitle={titulo}
              // productSlug={slug} // Descomenta si ProductActions lo necesita
              selectedPresentation={selectedPresentation}
              selectedColorName={selectedColor?.nombreColor || null}
              fichaTecnicaUrl={ficha_Tecnica?.data?.[0]?.attributes.url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
