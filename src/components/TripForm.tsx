import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, Trip } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { CalendarIcon, Plane, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripFormProps {
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  onSave: (trip: Trip) => void;
  defaultValues?: Partial<Trip>;
}

export function TripForm({ destinationName, destinationLat, destinationLng, onSave, defaultValues }: TripFormProps) {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      destination: {
        name: destinationName,
        lat: destinationLat,
        lng: destinationLng,
      },
      notes: "",
      ...defaultValues,
    },
  });

  function onSubmit(data: Trip) {
    onSave({ ...data, id: data.id || crypto.randomUUID() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Plane className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Sayohat manzili</p>
          <p className="text-lg font-semibold">{destinationName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Boshlanish sanasi</Label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: uz })
                    ) : (
                      <span>Sanani tanlang</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Tugash sanasi</Label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: uz })
                    ) : (
                      <span>Sanani tanlang</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                      (watch('startDate') ? date < watch('startDate') : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Qaydlar va rejalar</Label>
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Textarea 
              placeholder="Masalan: Mehmonxonani band qilish, biletlarni olish..." 
              className="resize-none h-32" 
              {...field} 
            />
          )}
        />
        <p className="text-[0.8rem] text-muted-foreground">Sayohat uchun muhim eslatmalar.</p>
      </div>

      <Button type="submit" className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Sayohatni Saqlash
      </Button>
    </form>
  );
}
