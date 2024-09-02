import { api } from "~/trpc/server";
import { ContactDataForm } from "./ContactDataForm";
import { auth } from "~/server/auth";
import { ToggleContactVisibility } from "../visibility/ToggleContactVisibility";

export const ContactDataWrapper = async () => {
  const [data, session] = await Promise.all([api.vCard.get(), auth()]);

  return (
    <>
      <ToggleContactVisibility defaultValues={data?.hasContactInfoLocked ?? false} />
      <ContactDataForm initialData={data} user={session!.user} />
    </>
  );
};

export const ContactDataLoading = () => {
  return <div>Loading...</div>;
};
