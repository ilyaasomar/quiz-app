import { styles } from "@/app/styles";
import { DeleteDialog } from "@/components/reusable/delete-modal";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MousePointerClick, Trash, View } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface ActionsProps {
  id: string;
  startTime: Date;
  endTime: Date;
}
const Actions = ({ id, startTime, endTime }: ActionsProps) => {
  const [onDeleteOpen, setOnDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //   getting start and endtime as local time
  const localStartTime: string = startTime.toLocaleString();
  const localEndTime: string = endTime.toLocaleString();

  //  get current date and time
  const currentDate: string = new Date().toLocaleString();

  //   const isDisabled = currentDate > localEndTime;

  //   console.log(currentDate);
  //   console.log(localEndTime);

  //   if (currentDate >= localStartTime && currentDate <= localEndTime) {
  //     console.log("current is smaller you can enter");
  //   } else if (currentDate < localStartTime) {
  //     console.log("current is smaller quiz still left");
  //   } else if (currentDate > localEndTime) {
  //     console.log("current is larger");
  //   } else {
  //     console.log("current is equal");
  //   }

  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/option/${id}`, {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      const data = await response.json();
      if (response.status === 401) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
      setOnDeleteOpen(false);
      router.refresh();
    }
  };

  return (
    <div>
      <DeleteDialog
        open={onDeleteOpen}
        onChangeOpen={setOnDeleteOpen}
        onDeleteData={deleteData}
        isLoading={loading}
      />
      <div className="flex items-center justify-center gap-x-2">
        {/* <div
          className={`flex items-center justify-center w-fit h-7 px-3 p-1 space-x-2 rounded-sm ${
            styles.primaryBgColor
          } text-white  ${
            isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } `}
        > */}
        <Button
          disabled={currentDate > localEndTime || currentDate < localStartTime}
          onClick={() => router.push(`/attempts/${id}`)}
          className={`rounded-sm ${styles.primaryBgColor} hover:${styles.primaryBgColor} text-white cursor-pointer`}
        >
          <MousePointerClick className="h-5 w-5 text-white" />
          <p className="font-semibold ">
            {currentDate <= localEndTime && currentDate >= localStartTime
              ? "Take quiz"
              : currentDate < localStartTime
              ? "Quiz Left"
              : "Quiz Ended"}
          </p>
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Actions;
