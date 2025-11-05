import { Button } from "../ui/button";

type TProps = {
    isLoading: boolean;
    onClick: ()=> void;
    label?: string;
    loadingLabel?: string;
}

const DeleteButton = ({isLoading, onClick, label = "Yes", loadingLabel}: TProps) => {
  return (
    <>
          <Button
              type="button"
              disabled={isLoading}
              variant="destructive"
              onClick={onClick}
          >
              {isLoading ? (
                  <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      {loadingLabel && <span>{loadingLabel}</span>}
                  </div>
              ) : (
                  label
              )}
          </Button>
    </>
  )
}

export default DeleteButton