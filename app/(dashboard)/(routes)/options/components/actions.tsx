import { styles } from "@/app/styles";
import { DeleteDialog } from "@/components/reusable/delete-modal";
import { Edit, Eye, Trash, View } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
interface ActionsProps {
  id: string;
}
const Actions = ({ id }: ActionsProps) => {
  const [onDeleteOpen, setOnDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/question/${id}`, {
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
        <div
          className={`flex items-center justify-center w-7 h-7 p-1 rounded-sm ${styles.primaryBgColor} text-white cursor-pointer`}
        >
          <Edit
            className="h-5 w-5 text-white"
            onClick={() => router.push(`/questions/${id}`)}
          />
        </div>
        <div
          className={`flex items-center justify-center w-7 h-7 p-1 rounded-sm bg-red-500 text-white cursor-pointer`}
        >
          <Trash
            className="h-5 w-5 text-white"
            onClick={() => setOnDeleteOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Actions;
