import { Button } from "../ui/button";

type TProps = {
    isLoading: boolean;
    onClick: ()=> void;
}

const DeleteButton = ({isLoading, onClick}: TProps) => {
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
                  </div>
              ) : (
                  "Yes"
              )}
          </Button>
    </>
  )
}

export default DeleteButton