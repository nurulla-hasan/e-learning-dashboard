import type React from "react";
import { Button } from "../ui/button";

type TProps = {
    isLoading: boolean;
    loadingTitle?: string;
    children: React.ReactNode;
}

const FormButton = ({ isLoading, loadingTitle="Processing...", children}: TProps) => {
  return (
    <>
          <Button
              type="submit"
              className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600 duration-200 font-semibold py-2.5 transition-colors"
              disabled={isLoading}
          >
              {isLoading ? (
                  <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      <span>{loadingTitle}</span>
                  </div>
              ) : (
                  <>
                    {children}
                  </>
              )}
          </Button>
    </>
  )
}

export default FormButton;