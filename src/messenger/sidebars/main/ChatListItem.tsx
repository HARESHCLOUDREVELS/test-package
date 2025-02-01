import { styled } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import UserAvatar from "./UserAvatar";
import { Box } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { useTranslation } from "react-i18next";
import {
  formatDate,
  hasPermission,
  truncateText,
} from "src/app/services/utils";
import history from "@history";
import { useSearchParams } from "react-router-dom";
import { FeaturePermissions } from "src/app/common/featurePermission";

const StyledListItem = styled(ListItemButton)<any>(({ theme }) => ({
  "&.active": {
    backgroundColor: theme.palette.background.default,
  },
}));

type ChatListItemProps = {
  item: any;
};

function ChatListItem(props: ChatListItemProps) {
  const { item } = props;
  const { t } = useTranslation("messenger");
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("id");
  const isPermissionToViewConversation = hasPermission(
    FeaturePermissions.ChatMessage.View
  );

  const handleClick = () => {
    if (isPermissionToViewConversation) {
      history.replace(`/messenger/chat?id=${item.id}`);
    }
  };

  return (
    <StyledListItem
      component="div"
      className={`px-16 py-12 min-h-80 ${item.id == conversationId ? "active" : ""}`}
      onClick={handleClick}
    >
      <UserAvatar user={item?.userDetail} />

      <ListItemText
        classes={{
          root: "min-w-px px-16",
          primary: "font-medium text-14",
          secondary: "truncate",
        }}
        primary={item.userDetail?.fullName}
        secondary={
          !!item.lastChatMessage?.messageText ? (
            truncateText(item.lastChatMessage?.messageText, 20)
          ) : item.lastChatMessage?.fileURL ? (
            <span className="flex items-center justify-start">
              <AttachmentIcon fontSize="small" className="mr-5" />
              <span className="flex items-start" color="text.secondary">
                {t("ATTACHMENT")}
              </span>
              <span></span>
            </span>
          ) : (
            ""
          )
        }
      />

      {item.lastChatMessage && (
        <div className="flex flex-col justify-center items-end">
          {item?.lastModified && (
            <Typography
              className="whitespace-nowrap mb-8 font-medium text-12"
              color="text.secondary"
            >
              {formatDate(item.lastModified, "DD/MM/YYYY", "DD/MMM/YYYY HH:mm:ss")}
            </Typography>
          )}
          <div className="items-center">
            {Boolean(item.lastChatMessage?.unreadMessageCount) && (
              <Box
                sx={{
                  backgroundColor: "secondary.main",
                  color: "secondary.contrastText",
                }}
                className="flex items-center justify-center min-w-20 h-20 rounded-full font-medium text-10 text-center"
              >
                {item.lastChatMessage?.unreadMessageCount}
              </Box>
            )}
          </div>
        </div>
      )}
    </StyledListItem>
  );
}

export default ChatListItem;
