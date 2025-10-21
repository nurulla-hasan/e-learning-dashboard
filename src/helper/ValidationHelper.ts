import toast from "react-hot-toast";

class ValidationHelper { 
    SuccessToast(msg: string){
        toast.success(msg);
    }

    ErrorToast(msg:string){
        toast.error(msg);
    }
}

export const { SuccessToast, ErrorToast } = new ValidationHelper();