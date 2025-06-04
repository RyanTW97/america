// components/ContactForm.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir el envío tradicional del formulario

    const recipientEmail = "info@pinturasamerica.com"; // <-- CAMBIA ESTO por tu email de contacto real
    const subject = encodeURIComponent(
      `Consulta de Contacto: ${formData.firstName} ${formData.lastName}`
    );
    const body = encodeURIComponent(
      `Nombre: ${formData.firstName}
Apellido: ${formData.lastName}
Correo: ${formData.email}

Mensaje:
${formData.message}
`
    );

    // Construir el enlace mailto
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    // Abrir el cliente de correo del usuario
    if (typeof window !== "undefined") {
      window.location.href = mailtoLink;
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-24 bg-white">
      <h2 className="text-6xl font-extrabold text-center text-[#1D1E8D] mb-6">
        ¡Contáctanos!
      </h2>

      <div className="flex flex-col lg:flex-row justify-around items-start gap-8">
        {" "}
        {/* Aumentado el gap */}
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-6">
          <p className="text-2xl text-[#1D1E8D] font-semibold text-left mb-14">
            Envíanos un correo electrónico
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="firstName"
                className="block text-[#1D1E8D] font-medium mb-2" // mb-2 en lugar de mb-3 y block para mejor espaciado
              >
                Nombre
              </Label>
              <Input
                id="firstName"
                placeholder="Tu nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="block text-[#1D1E8D] font-medium mb-2"
              >
                Apellido
              </Label>
              <Input
                id="lastName"
                placeholder="Tu apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-[#1D1E8D] font-medium mb-2"
            >
              Correo
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label
              htmlFor="message"
              className="block text-[#1D1E8D] font-medium mb-2"
            >
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu consulta aquí..."
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit" // El type submit ahora activará la función handleSubmit del form
            className="w-full bg-[#1D1E8D] text-white text-lg font-semibold py-3 hover:bg-[#1D1E8D]/90 transition-colors duration-150 rounded-md" // Añadido py-3, rounded-md y transición
          >
            ENVIAR POR CORREO
          </Button>
        </form>
        {/* Ilustración */}
        <div className="w-full lg:w-2/6 flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
          {" "}
          {/* Centrado de ilustración y margen */}
          <Image
            src="/contact-illustration.png" // Asegúrate que esta ruta sea correcta
            alt="Ilustración de personas contactándose"
            width={500} // Ajustado ligeramente para proporción
            height={596} // Ajustado ligeramente para proporción
            className="rounded-xl object-contain max-h-[500px] lg:max-h-full" // object-contain y max-h para mejor ajuste
            priority
          />
        </div>
      </div>
    </section>
  );
}
