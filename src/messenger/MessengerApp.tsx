import { styled } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FusePageSimple from "@fuse/core/FusePageSimple";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import MainSidebar from "./sidebars/main/MainSidebar";
import withReducer from "app/store/withReducer";
import selectedContactIdSlice from "./store/messengerAppSlice";
import history from "@history";
import Can from "src/app/services/FeaturePermission/Can";
import { FeaturePermissions } from "src/app/common/featurePermission";

type ChatAppContextType = {
  setMainSidebarOpen: (isOpen?: boolean) => void;
  setContactSidebarOpen: (isOpen?: boolean) => void;
  setUserSidebarOpen: (isOpen?: boolean) => void;
};

export const ChatAppContext = createContext<ChatAppContextType>({
  setMainSidebarOpen: () => {},
  setContactSidebarOpen: () => {},
  setUserSidebarOpen: () => {},
});

const Root = styled(FusePageSimple)(() => ({
  "& .FusePageSimple-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 100%",
    height: "100%",
    padding: "0 !important",
    margin: "0 !important",
    "&.container": {
      margin: "0",
      width: "100%",
      maxWidth: "none",
    },
  },
}));

/**
 * The chat app.
 */
function MessengerApp() {
  const location = useLocation();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
  const [contactSidebarOpen, setContactSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);

  useEffect(() => {
    setMainSidebarOpen(!isMobile);
    if (isMobile) {
      setMainSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setMainSidebarOpen(false);
    }
  }, [location, isMobile]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (location.pathname === "/messenger/chat" && !id) {
      history.replace("/messenger");
    }
  }, [location]);

  useEffect(() => {
    if (isMobile && userSidebarOpen) {
      setMainSidebarOpen(false);
    }
  }, [isMobile, userSidebarOpen]);

  const ChatAppContextData = useMemo(
    () => ({
      setMainSidebarOpen,
      setContactSidebarOpen,
      setUserSidebarOpen,
    }),
    [setMainSidebarOpen, setContactSidebarOpen, setUserSidebarOpen]
  );

  return (
    <Can permission={FeaturePermissions?.ChatMessage?.List} errorMessage="ACCESS_DENIED_CHAT_MESSAGE_LIST">
      <ChatAppContext.Provider value={ChatAppContextData as ChatAppContextType}>
        <Root
          content={<Outlet />}
          leftSidebarContent={<MainSidebar />}
          leftSidebarOpen={mainSidebarOpen}
          leftSidebarOnClose={() => {
            setMainSidebarOpen(false);
          }}
          leftSidebarWidth={400}
          rightSidebarOpen={contactSidebarOpen}
          rightSidebarOnClose={() => {
            setContactSidebarOpen(false);
          }}
          rightSidebarWidth={400}
          scroll="content"
        />
      </ChatAppContext.Provider>
    </Can>
  );
}
export default withReducer("messenger", selectedContactIdSlice)(MessengerApp);
