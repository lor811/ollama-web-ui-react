import { Button, Popover, Portal, Text } from "@chakra-ui/react";
import ModelSelectionButton from "./ModelSelectionButton";
import ModelSelectionMenu from "./ModelSelectionMenu";
import { type Model, useChat } from "@providers/ChatProvider";
import { fetchModels } from "@api/ollama";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

const ModelSelectionPopover = () => {
    const { selectedModel, setSelectedModel, selectionIsBlocked } = useChat();
    const { token } = useAuth();
    
    const { data: models, isLoading } = useSuspenseQuery<Model[]>({
        queryKey: ['models'],
        queryFn: async () => {
            try {
                let models = (await fetchModels(token!)).models;
                if (!models || !models[0]) {
                    throw new Error("Couldn't find any model. Is ollama running?");
                }
                models = models.map((model: any) => { return { 'model': model.model, 'parameter_size': model.details.parameter_size }});
                return models as Model[];
            } catch (error) {
                throw error;
            }
        },
        refetchInterval: 15_000,
        retry: false
    });

    const updateSelectedModel = (newModel: Model) => {
        setSelectedModel(newModel);
    };

    useEffect(() => {
        if (models[0]) {
            setSelectedModel(models[0]);
        }
    }, []);

    return (
        <Popover.Root>
             <Popover.Trigger asChild disabled={ isLoading || selectionIsBlocked }>
                <Button bg={"inherit"} outline={0} w={"fit-content"}>
                    { isLoading ? 
                    <ModelSelectionButton selectedModelName={ "Loading..." } />
                    :
                    <ModelSelectionButton selectedModelName={ selectedModel ? selectedModel.model : "No model found" } />
                    }
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                <Popover.Content css={{ "--popover-bg": "var(--background-contrast-dark)"}} 
                borderWidth={1} borderColor={"var(--background-contrast)"}>
                    <Popover.Arrow />
                    <Popover.Body p={0} w={"100%"}>
                        { (models ?? []).length > 0 ? 
                            <ModelSelectionMenu models={ models ?? [] } updateSelectedModel={ updateSelectedModel }/>
                            : 
                            <Text p={6}>
                                No models found. Is ollama running?
                            </Text>
                        }
                    </Popover.Body>
                </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    )
}

export default ModelSelectionPopover