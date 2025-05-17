import { type Model } from "@providers/ChatProvider";
import { MenuRoot, MenuContent, MenuItem, Spacer, Text } from "@chakra-ui/react"

type ModelSelectionMenuProps = {
    models: Model[];
    updateSelectedModel: (newModel: Model) => void;
}

const ModelSelectionMenu = ({ models, updateSelectedModel }: ModelSelectionMenuProps) => {
  return (
    <MenuRoot open>
        <MenuContent bg={"inherit"} p={3}>
            { models.map((model: Model, index: number) => {
                return (
                    <MenuItem key={ index } value={ model.model } onClick={ () => { updateSelectedModel(model) } }>
                        <Text color={"white"}>
                            { model.model }
                        </Text>
                        <Spacer w={"30px"}/>
                        <Text fontSize={"xs"} color={"whiteAlpha.500"} ml={"auto"}>
                            { model.parameter_size }
                        </Text>
                    </MenuItem>
                )
            })}
        </MenuContent>
    </MenuRoot>
  )
}

export default ModelSelectionMenu