"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api, type RouterOutputs } from "~/trpc/react";

export const AllSignatures = ({
  initialData,
}: {
  initialData: RouterOutputs["signatures"]["templates"];
}) => {
  const [data] = api.signatures.templates.useSuspenseQuery(undefined, { initialData });
  const templateRef = useRef<HTMLTableElement>(null);

  const generateInfoQR = () => {
    const signature = `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        
        <body>
          <p>---</p>

          <img 
            style="width:100%;height:auto;max-width:100%;max-height:100%;display:block"
            src="https://concard.app/api/dynamics/${data.id}" alt="${data.username} Signature" 
          >

          <p>Powered by <a style="color:#818cf8" href="https://concard.app">concard.app</a></p>
        </body>
      </html>
    `;

    const generated = [
      new ClipboardItem(
        {
          "text/html": new Blob([signature], { type: "text/html" }),
        },
        {
          presentationStyle: "inline",
        },
      ),
    ];

    void navigator.clipboard.write(generated);

    toast.success("Copied to clipboard");
  };

  return (
    <section className="flex h-full w-full flex-col gap-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Info + QR</CardTitle>

          <CardDescription>
            Simple yet powerful, this is the best way to share your contact information with the
            world.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <article className="rounded-lg border p-2">
            <table ref={templateRef} cellSpacing={0} cellPadding={1} className="w-full">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>
                    {data.contactJSON?.name?.first} {data.contactJSON?.name?.last}
                  </td>
                </tr>

                {data.contactJSON?.email?.map((email, idx) => (
                  <tr key={idx}>
                    <td>Email #{idx + 1}</td>
                    <td>{email.link}</td>
                  </tr>
                ))}

                {data.contactJSON?.phoneNumbers?.map((phone, idx) => (
                  <tr key={idx}>
                    <td>Phone #{idx + 1}</td>
                    <td>{phone.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <Button className="mt-4" onClick={generateInfoQR}>
            Generate signature and copy
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};
