import { Button } from "../Button";
import { ButtonContainer, DialogBox, Message, Overlay, Title } from "./styled";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AlertDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <DialogBox>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button variant="danger" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Confirm
          </Button>
        </ButtonContainer>
      </DialogBox>
    </Overlay>
  );
}
