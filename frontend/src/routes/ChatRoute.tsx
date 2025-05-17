import "./ChatRoute.css";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import ErrorFallback from "@components/suspense/ErrorFallback";
import LoadingFallback from "@components/suspense/LoadingFallback";
import ChatProvider from "@providers/ChatProvider";
import Sidebar from "@components/chat/sidebar/Sidebar";
import ChatPanel from "@components/chat/main/ChatPanel";

const ChatRoute = () => {
  return (
    <ErrorBoundary
      fallbackRender={(props: FallbackProps) => {
        return (
          <ErrorFallback
            error={props.error}
            resetErrorBoundary={props.resetErrorBoundary}
          />
        );
      }}
      onReset={() => {
        window.location.href = window.location.href;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ChatProvider>
          <Sidebar />
          <ChatPanel />
        </ChatProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default ChatRoute;
