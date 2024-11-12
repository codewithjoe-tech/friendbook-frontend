import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { NotiOpen } from "@/redux/Slices/NotificationSlice";

export function Toaster() {
  const { toasts } = useToast();
  const dispatch = useDispatch()


  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, image, username, content, action, ...props }) {

        return (
          <Toast key={id} {...props} onClick={()=>dispatch(NotiOpen())}>
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 flex ">
                {image ? (
                  <AvatarImage src={image.replace(`${import.meta.env.VITE_API_URL}`,"")} alt={username} />
                ) : (
                  <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
                {content && <p className="text-sm text-gray-600">{content}</p>}
              </div>

              {action}

              <ToastClose />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
