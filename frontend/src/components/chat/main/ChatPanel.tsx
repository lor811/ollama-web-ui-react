import { useChat } from "@providers/ChatProvider";
import { Outlet } from "react-router";
import ChatHeader from "./ChatHeader";
import ChatForm from "./ChatForm";

const ChatPanel = () => {
    const { 
        chatId, selectedModel, setSelectedModel, setSelectionIsBlocked,
        input, setInput, handleInputChange, 
        messages, setMessages, handleSubmit, 
        isStreaming
    } = useChat();

    return (
        <div className={"chat-panel"}>
            <header className={"chat-header"}>
                <ChatHeader />
            </header>
            
            <main className={"chat-main"}>
                <Outlet context={
                    { 
                        chatId,
                        selectedModel: selectedModel.model, setSelectedModel,  setSelectionIsBlocked,
                        setInput, isStreaming,
                        messages, setMessages
                    }
                }/>
            </main>

            <footer className={"chat-form fade-top"}>
                <ChatForm 
                    input={ input }
                    handleInputChange={ handleInputChange } 
                    handleSubmit={ handleSubmit }
                    isStreaming={ isStreaming }
                />
            </footer>
        </div>
  )
}
export default ChatPanel