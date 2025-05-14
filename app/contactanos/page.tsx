import PageBannerImage from "@/components/pageBannerImage";
import ContactForm from "./components/ContactForm";
import ContactDetails from "./components/ContactDetails";
import LocationMap from "./components/LocationMap";

export default function Page() {
  return (
    <div>
      <PageBannerImage
        src="/contactos.png"
        alt="Vista exterior de las instalaciones de la empresa"
        priority={true}
      />
      <ContactForm />
      <ContactDetails />
      <LocationMap />
    </div>
  );
}
