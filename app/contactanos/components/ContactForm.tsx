// components/ContactForm.tsx

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  return (
    <section className="w-full py-16 px-4 md:px-24 bg-white">
      <h2 className="text-6xl font-extrabold text-center text-[#1D1E8D] mb-6">
        ¡Contáctanos!
      </h2>

      <div className="flex flex-col lg:flex-row justify-around items-start gap-2">
        {/* Formulario */}
        <form className="w-full lg:w-1/2 space-y-6">
          <p className="text-2xl text-[#1D1E8D] font-semibold text-left mb-14">
            Envíanos un correo electrónico
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="firstName"
                className="text-[#1D1E8D] font-medium mb-3"
              >
                Nombre
              </Label>
              <Input id="firstName" placeholder="Primer Nombre" />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-[#1D1E8D] font-medium mb-3"
              >
                Apellido
              </Label>
              <Input id="lastName" placeholder="Primer Apellido" />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-[#1D1E8D] font-medium mb-3">
              Correo
            </Label>
            <Input id="email" type="email" placeholder="ejemplo@hotmail.com" />
          </div>

          <div>
            <Label
              htmlFor="message"
              className="text-[#1D1E8D] font-medium mb-3"
            >
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe la solicitud que desees."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1D1E8D] text-white text-lg font-semibold hover:bg-[#1D1E8D]/90"
          >
            ENVIAR
          </Button>
        </form>

        {/* Ilustración */}
        <div className="w-full lg:w-2/6 flex justify-end">
          <Image
            src="/contact-illustration.png"
            alt="Ilustración de contacto"
            width={527}
            height={623}
            className="rounded-xl "
            priority
          />
        </div>
      </div>
    </section>
  );
}
