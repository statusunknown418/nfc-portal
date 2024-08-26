import { api } from "~/trpc/server";
import { ContactDataForm } from "./ContactDataForm";

export const ContactDataWrapper = async () => {
  const data = await api.vCard.get();

  return <ContactDataForm initialData={data} />;
};

export const ContactDataLoading = () => {
  return <div>Loading...</div>;
};
