"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(date);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve time if it exists
      if (selectedDateTime) {
        selectedDate.setHours(selectedDateTime.getHours());
        selectedDate.setMinutes(selectedDateTime.getMinutes());
      }
      setSelectedDateTime(selectedDate);
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (time) {
      const [hours, minutes] = time.split(":");
      const newDateTime = selectedDateTime
        ? new Date(selectedDateTime)
        : new Date();
      newDateTime.setHours(parseInt(hours));
      newDateTime.setMinutes(parseInt(minutes));
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDateTime && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            format(selectedDateTime, "PPP 'at' p")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 -mt-32" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <label className="text-sm font-medium mb-2 block">Time</label>
          <Input
            type="time"
            value={
              selectedDateTime ? format(selectedDateTime, "HH:mm") : "00:00"
            }
            onChange={handleTimeChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
