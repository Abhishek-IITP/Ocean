import { updateAvailabilityAction } from "@/app/action";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hook";
import { times } from "@/app/lib/times";
import { SubmitButton } from "@/components/SubmitButtons";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({ where: { userId } });
  if (!data || data.length === 0) return notFound();
  return data;
}

export default async function AvailabilityRoute() {
  const session = await requireUser();
  const data = await getData(session.user!.id as string);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Availability"
        description="Set your working days and hours. This is the window Ocean offers when people book time with you."
      />

      <form action={updateAvailabilityAction} className="space-y-4">
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="grid items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft lg:grid-cols-[180px_1fr_1fr]"
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-3">
                <Switch
                  name={`isAvailable-${item.id}`}
                  defaultChecked={item.isAvailable}
                />
                <p className="text-sm font-semibold capitalize">
                  {item.day.toLowerCase()}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Select name={`startTime-${item.id}`} defaultValue={item.startTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Until</Label>
                <Select name={`endTime-${item.id}`} defaultValue={item.endTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <SubmitButton text="Save changes" className="w-auto px-8" />
        </div>
      </form>
    </div>
  );
}
