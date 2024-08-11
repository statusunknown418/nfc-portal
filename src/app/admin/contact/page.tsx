import { DiscIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import DotPattern from "~/components/magicui/dot-pattern";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import { Alert } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

export default async function ContactPage() {
  return (
    <section className="flex h-full w-full flex-col gap-8 lg:flex-row lg:gap-10">
      <section className="flex flex-col gap-4 lg:max-w-prose">
        <Breadcrumb className="self-start">
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <header>
          <h1 className="text-2xl font-bold">Contact information</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your contact information here, this is what every person you give your card to
            will see, additionally it is possible to hide it from your public page if needed.
          </p>
        </header>

        <Alert variant="indigo" className="border-dashed">
          <Label className="flex items-center gap-2">
            <Switch />
            Enable contact information visibility
          </Label>
        </Alert>

        <form className="grid grid-cols-1 gap-4 rounded-lg border p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 md:gap-10 lg:flex-row">
              <Avatar className="h-32 w-32 max-w-32">
                <AvatarFallback />
                <AvatarImage src="https://picsum.photos/id/1005/200/200" />
              </Avatar>
            </div>

            <article className="flex w-full flex-col gap-4">
              <div className="flex gap-2">
                <FormItem className="">
                  <Label>Company</Label>
                  <Input placeholder="Meow Studios" />
                </FormItem>

                <FormItem>
                  <Label>Position</Label>
                  <Input placeholder="CEO" />
                </FormItem>
              </div>

              <div className="flex gap-2">
                <FormItem className="flex-grow">
                  <Label>Name</Label>
                  <Input placeholder="Alvaro" />
                </FormItem>

                <FormItem className="flex-grow">
                  <Label>Last name</Label>
                  <Input placeholder="Aquije" />
                </FormItem>
              </div>
            </article>
          </div>

          <div className="flex gap-2">
            <FormItem className="flex-grow">
              <Label>Email</Label>
              <Input placeholder="alvaro@example.com" autoComplete="email" />
            </FormItem>

            <FormItem className="self-end">
              <Select>
                <SelectTrigger className="h-[36px] min-w-32">
                  <SelectValue placeholder="Primary" />
                </SelectTrigger>
              </Select>
            </FormItem>

            <Button variant="ghost" size="icon" type="button" className="mb-0.5 self-end">
              <PlusCircledIcon />
            </Button>
          </div>

          <div className="flex gap-2">
            <FormItem className="flex-grow">
              <Label>Phone number</Label>
              <Input placeholder="+51 993606898" />
            </FormItem>

            <FormItem className="self-end">
              <Select>
                <SelectTrigger className="h-[36px] min-w-32">
                  <SelectValue placeholder="Telephone" />
                </SelectTrigger>
              </Select>
            </FormItem>

            <Button variant="ghost" size="icon" type="button" className="mb-0.5 self-end">
              <PlusCircledIcon />
            </Button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <FormItem>
              <Label>Address type</Label>
              <Select>
                <SelectTrigger className="h-[36px] min-w-32">
                  <SelectValue placeholder="Home" />
                </SelectTrigger>
              </Select>
            </FormItem>

            <FormItem className="flex-grow md:self-end">
              <Input placeholder="Street address" />
            </FormItem>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <FormItem>
              <Input placeholder="City" autoComplete="address-level1" />
            </FormItem>

            <FormItem>
              <Input placeholder="State" />
            </FormItem>

            <FormItem>
              <Input placeholder="Zip code" autoComplete="postal-code" />
            </FormItem>

            <FormItem>
              <Input placeholder="Country" autoComplete="country" />
            </FormItem>
          </div>

          <Button className="mt-4" variant="primary">
            <DiscIcon />
            Save
          </Button>
        </form>
      </section>

      <article className="relative mt-4 flex h-full flex-grow items-start justify-center rounded-lg lg:mt-0">
        <CardContainer className="h-full w-full" containerClassName={cn("h-full w-full z-10")}>
          <CardBody className="group/card flex w-full items-start justify-center">
            <CardItem
              translateZ="100"
              rotateX={15}
              rotateZ={5}
              className="flex h-[220px] w-[380px] flex-col justify-between rounded-xl bg-primary p-6 text-sm text-primary-foreground shadow-md shadow-black/50 group-hover:shadow-xl md:h-64"
            >
              <div className="flex justify-between">
                <p className="font-medium text-muted-foreground">NearU</p>
                <p className="text-muted-foreground">#0000001</p>
              </div>

              <div className="flex justify-between">
                <p>Alvaro @status.unknown418</p>
                <p>Stacked Studio</p>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        {/* <section
          id="nfc-preview-card"
          className="z-10 h-max min-h-60 w-full max-w-[400px] rounded-xl bg-primary/90 p-6 text-primary-foreground shadow-xl shadow-black/50 backdrop-blur backdrop-filter"
        >
          <p>Card #0000001</p>
          <p>Alvaro Aquije</p>
        </section> */}

        <DotPattern
          className={cn(
            "z-0 p-1 [mask-image:linear-gradient(to_bottom,white,transparent,transparent)]",
          )}
        />
      </article>
    </section>
  );
}
