import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { convertToLocaleDateTime } from "@/utils";

interface OrderCancelSectionProps {
  orderDate: string;
  paymentMethod: string;
  isLoading: boolean;
  handleUpdateOrderStatus: (status: string, notes: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  orderStatus: string;
  reason: string;
  setReason: (reason: string) => void;
}

const OrderCancelSection = ({
  orderDate,
  paymentMethod,
  isLoading,
  handleUpdateOrderStatus,
  open,
  setOpen,
  orderStatus,
  reason,
  setReason,
}: OrderCancelSectionProps) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between">
        <p className="md:text-sm text-xs">
          {convertToLocaleDateTime(orderDate, "Asia/Tokyo")} {paymentMethod}
        </p>

        <DialogTrigger asChild>
          <Button
            className={
              orderStatus === "キャンセル済み"
                ? "rounded-full bg-black/50 text-white-bg md:px-6 px-2 text-xs"
                : "rounded-full bg-secondary text-white-bg md:px-6 px-2 text-xs cursor-pointer hover:bg-secondary/80"
            }
            onClick={() => {
              if (orderStatus === "キャンセル済み") {
                return;
              }
              setOpen(true);
            }}
          >
            {orderStatus === "キャンセル済み"
              ? "注文をキャンセルしました"
              : "注文をキャンセルする"}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md bg-white border border-white-bg rounded-md">
        <DialogHeader>
          <DialogTitle>注文キャンセル</DialogTitle>
          <DialogDescription className="mt-2">
            <span className="text-xs">理由</span>
            <textarea
              className="w-full h-24 border border-white-bg rounded-md p-2 mt-2 resize-none focus:outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={orderStatus === "キャンセル済み"}
            />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-lg px-8 bg-primary text-white-bg border-white-bg cursor-pointer"
            onClick={() => handleUpdateOrderStatus("キャンセル済み", reason)}
            disabled={isLoading || orderStatus === "キャンセル済み"}
          >
            {isLoading ? "キャンセル中..." : "OK"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderCancelSection;
