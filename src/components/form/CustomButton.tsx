import type React from "react";
import { Button } from "../ui/button";



type TProps = {
    isLoading: boolean;
    onClick: ()=> void;
    children: React.ReactNode;
    loadingTitle?: string;
    disabled?: boolean
}

const CustomButton = ({ isLoading, loadingTitle="Processing...", onClick, children, disabled }: TProps) => {
    return (
        <>
          <Button
              type="button"
              onClick={onClick}
              className="w-full bg-cyan-500 hover:bg-cyan-600 duration-200 font-semibold py-2.5 transition-colors disabled:cursor-not-allowed"
              disabled={disabled}
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

export default CustomButton