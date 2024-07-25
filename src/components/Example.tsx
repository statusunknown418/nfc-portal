"use client";

import VCard from "vcard-creator";
import Link from "next/link";
import { Button } from "./ui/button";

export const Example = () => {
  const exampleVCard = new VCard();

  exampleVCard.addName("John Doe");
  exampleVCard.addNickname("Johnny");
  exampleVCard.addCompany("Example Corp.", "CEO & founder");
  exampleVCard.addPhotoURL("https://picsum.photos/200");
  exampleVCard.addURL("https://example.com");
  exampleVCard.addJobtitle("CEO");
  exampleVCard.addSocial("https://x.com/", "Twitter", "statusunknown418");
  exampleVCard.addEmail("john.doe@example.com");
  exampleVCard.addPhoneNumber("+1 (555) 555-5555");
  exampleVCard.addAddress(
    "Home Address",
    "Extended Address here",
    "Menlo Park",
    "San Francisco",
    "CA",
    "94025",
    "US",
  );

  exampleVCard.addNote("This is a note");
  exampleVCard.setFilename("john_doe.vcf");

  return (
    <div>
      <Button
        onClick={() => {
          console.log(exampleVCard.buildVCard());

          const blob = new Blob([exampleVCard.buildVCard()], {
            type: "text/vcard",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "john_doe.vcf";
          link.click();
        }}
      >
        get vCard
      </Button>
    </div>
  );
};
