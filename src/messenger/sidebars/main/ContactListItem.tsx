import { styled } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import ListItemButton from "@mui/material/ListItemButton";
import { NavLinkAdapterPropsType } from "@fuse/core/NavLinkAdapter/NavLinkAdapter";
import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useDispatch } from "react-redux";
import { createNewConversation } from "../../store/messengerAppSlice";
import { useNavigate } from "react-router";
import history from "@history";
import { Chip } from "@mui/material";
import themesConfig from "app/configs/themesConfig";
import { hasPermission } from "src/app/services/utils";
import { FeaturePermissions } from "src/app/common/featurePermission";

const StyledListItem = styled(ListItemButton)<any>(({ theme }) => ({
  "&.active": {
    backgroundColor: theme.palette.background.default,
  },
}));

const SmallChip = styled(Chip)({
  height: "20px",
  fontSize: "9px",
  //   backgroundColor: themesConfig.default.palette.secondary.main,
  backgroundColor: themesConfig.default.palette.info.dark,
  color: themesConfig.default.palette.common.white,
  "& .MuiChip-label": {
    padding: "0 6px",
  },
});

type ContactListItemProps = {
  item: any;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemProps) {
  const { item } = props;
  const dispatch: any = useDispatch();
  const loginUserData = useSelector(selectUser);
  const isPermissionToCreateConversation = hasPermission(
    FeaturePermissions.ChatMessage.Create
  );
  const handleContactClick = () => {
    if (!isPermissionToCreateConversation) {
      return;
    }
    const request_data = {
      userOneId: loginUserData.uid,
      userTwoId: item.id,
    };
    dispatch(createNewConversation(request_data)).then((response) => {
      if (response && response.id) {
        history.replace(`/messenger/chat?id=${response.id}`);
      }
    });
  };

  return (
    <StyledListItem
      component="div"
      className="px-32 py-12 min-h-80"
      onClick={handleContactClick}
    >
      <UserAvatar user={item} />

      <ListItemText
        classes={{
          root: "min-w-px px-16",
          primary: "font-medium text-14",
          secondary: "truncate",
        }}
        primary={
          <div className="flex items-center">
            <span>{item.name || item.userName || item.fullName}</span>
            {item.roleName && (
              <SmallChip
                label={item.roleName}
                size="small"
                className="ml-8"
                variant="filled"
              />
            )}
          </div>
        }
      />
    </StyledListItem>
  );
}

export default ContactListItem;
