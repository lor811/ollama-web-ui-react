import { Stack, Icon, Text } from "@chakra-ui/react"
import { RiArrowDropDownLine } from "react-icons/ri"
import { SiOllama } from "react-icons/si"

type ModelSelectionButtonProps = {
    selectedModelName: string;
}

const ModelSelectionButton = ({ selectedModelName }: ModelSelectionButtonProps) => {
  return (
    <Stack w={"150px"} h={"fit-content"} direction={"row"} alignItems={"center"}>
        <Icon bg={"whitesmoke"} rounded={"xl"}>
            <SiOllama color={"black"} />
        </Icon>
        <Text fontWeight={"normal"}>
            { selectedModelName }
        </Text>
        <Icon size={"md"}>
            <RiArrowDropDownLine />
        </Icon>
    </Stack>
  )
}

export default ModelSelectionButton