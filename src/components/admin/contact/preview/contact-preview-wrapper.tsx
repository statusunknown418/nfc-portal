import { api } from "~/trpc/server";
import { ContactPreview } from "./ContactPreview";

export const ContactPreviewWrapper = async () => {
  const data = await api.vCard.get();

  return <ContactPreview initialData={data} />;
};
