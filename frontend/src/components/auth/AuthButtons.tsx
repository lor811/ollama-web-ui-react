import { Button, Stack } from "@chakra-ui/react";

type AuthButtonsProps = {
  firstButtonText: string;
  firstButtonOnClick: () => void;
  secondButtonText: string;
  secondButtonOnClick: () => void;
};

const AuthButtons = ({
  firstButtonText,
  firstButtonOnClick,
  secondButtonText,
  secondButtonOnClick,
}: AuthButtonsProps) => {
  return (
    <Stack>
      <Button
        type={"button"}
        bg={"var(--primary)"}
        onClick={firstButtonOnClick}
      >
        {firstButtonText}
      </Button>
      <Button
        type={"button"}
        bg={"transparent"}
        size={"xs"}
        fontWeight={"light"}
        onClick={secondButtonOnClick}
      >
        {secondButtonText}
      </Button>
    </Stack>
  );
};

export default AuthButtons;
