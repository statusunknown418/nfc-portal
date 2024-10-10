import { Eyedropper, PaintBrush } from "@phosphor-icons/react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import useEyeDropper from "use-eye-dropper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

type DropperError = {
  message: string;
  canceled?: boolean;
};

const isError = <T,>(err: DropperError | T): err is DropperError =>
  !!err && err instanceof Error && !!err.message;

const isNotCanceled = <T,>(err: DropperError | T): err is DropperError =>
  isError(err) && !err.canceled;

export function GradientPicker({
  background,
  setBackground,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) {
  const solids = [
    "#ffffff",
    "#FFFEF6",
    "#E2E2E2",
    "#70e2ff",
    "#00c6ff",
    "#4facfe",
    "#40e0d0",
    "#9fff5b",
    "#0ba360",
    "#ffa647",
    "#ffe83f",
    "#fdfc47",
    "#ff75c3",
    "#ff7882",
    "#fcc5e4",
    "#c8699e",
    "#cd93ff",
    "#7046aa",
    "#8a2be2",
    "#0c1db8",
    "#020f75",
    "#4338ca",
    "#09203f",
    "#0c2c2c",
    "#09090b",
  ];

  const gradients = [
    "linear-gradient(to top left,#accbee,#e7f0fd)",
    "linear-gradient(to top left,#d5d4d0,#d5d4d0,#eeeeec)",
    "linear-gradient(to top left,#000000,#434343)",
    "linear-gradient(to top left,#09203f,#537895)",
    "linear-gradient(to top left,#AC32E4,#7918F2,#4801FF)",
    "linear-gradient(to top left,#f953c6,#b91d73)",
    "linear-gradient(to top left,#ee0979,#ff6a00)",
    "linear-gradient(to top left,#F00000,#DC281E)",
    "linear-gradient(to top left,#00c6ff,#0072ff)",
    "linear-gradient(to top left,#4facfe,#00f2fe)",
    "linear-gradient(to top left,#0ba360,#3cba92)",
    "linear-gradient(to top left,#FDFC47,#24FE41)",
    "linear-gradient(to top left,#8a2be2,#0000cd,#228b22,#ccff00)",
    "linear-gradient(to top left,#40E0D0,#FF8C00,#FF0080)",
    "linear-gradient(to top left,#fcc5e4,#fda34b,#ff7882,#c8699e,#7046aa,#0c1db8,#020f75)",
    "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
  ];

  const images = [
    "url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=70)",
    "url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=70",
    "url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=70)",
    "url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=70)",
  ];

  const defaultTab = useMemo(() => {
    if (background?.includes("url")) return "image";
    if (background?.includes("gradient")) return "gradient";
    return "solid";
  }, [background]);

  const { open, close, isSupported } = useEyeDropper();

  const pickColor = useCallback(() => {
    const openPicker = async () => {
      try {
        const color = await open();
        setBackground(color.sRGBHex);
      } catch (e) {
        if (isNotCanceled(e)) {
          toast.error("Something went wrong");
        }

        close();
      }
    };

    void openPicker();
  }, [close, open, setBackground]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-[36px] w-full justify-start text-left font-normal md:w-[240px]",
            !background && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-5 w-5 rounded border !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <PaintBrush className="h-5 w-5" />
            )}
            <div className="flex-1 truncate">{background ? background : "Pick a color"}</div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="gradient">
              Gradient
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="image">
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="mt-0 flex flex-wrap gap-1">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="h-6 w-6 cursor-pointer rounded-sm border active:scale-105"
                onClick={() => setBackground(s)}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="mt-0">
            <div className="mb-2 flex flex-wrap gap-1">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="h-6 w-6 cursor-pointer rounded-sm active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <div className="mb-2 grid grid-cols-2 gap-1">
              {images.map((s) => (
                <div
                  key={s}
                  style={{ backgroundImage: s }}
                  className="h-12 w-full cursor-pointer rounded-md bg-cover bg-center active:scale-105"
                  onClick={() => setBackground(s)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Input
          id="custom"
          value={background}
          className="col-span-2 mt-4 h-8"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />

        {isSupported() ? (
          <Button onClick={pickColor} className="mt-2 w-full" size="sm" variant="outline">
            <Eyedropper size={14} />
            Pick another color
          </Button>
        ) : (
          <p>Eye dropper not supported here, try another browser</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
