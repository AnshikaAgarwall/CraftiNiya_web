import { Compass } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { EmptyState } from "../components/ui/Feedback.jsx";

export default function NotFoundPage({
  title = "That page does not exist",
  message = "The link may be old, or the piece may have sold out and been retired.",
}) {
  return (
    <>
      <SEO title="Not found" noIndex />
      <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
        <EmptyState
          icon={Compass}
          title={title}
          message={message}
          action={
            <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap", justifyContent: "center" }}>
              <Button to="/">Back to home</Button>
              <Button to="/shop" variant="secondary">
                Browse the shop
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}
