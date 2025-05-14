
import Image from "next/image";

const SinPlaza = () => {
  return (
    <div style={{ width: "100%" }}>
      <Image
        src="/sinplaza.png"
        alt="Imagen sin plaza"
        layout="responsive"
        width={1920}
        height={1080}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default SinPlaza;
