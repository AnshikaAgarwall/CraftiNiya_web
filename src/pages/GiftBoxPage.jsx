import SEO from "../components/common/SEO.jsx";
import GiftBoxBuilder from "../features/home/GiftBoxBuilder.jsx";

export default function GiftBoxPage() {
  return (
    <>
      <SEO
        title="Make Your Gift Box"
        description="Build a personalised gift box within your budget. Pick handcrafted items, add a handwritten note, and we'll wrap it beautifully — prepaid orders only."
      />
      <GiftBoxBuilder />
    </>
  );
}
