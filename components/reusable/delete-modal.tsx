import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteProps {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  onDeleteData: () => void;
  isLoading: boolean;
}
export function DeleteDialog({
  open,
  onChangeOpen,
  onDeleteData,
  isLoading,
}: DeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this file from our servers?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={onDeleteData}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-500 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
