import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import _ from "@lodash";

const StyledBadge = styled(Badge)<{ statuscolor?: string }>(
  ({ theme, ...props }) => ({
    width: 40,
    height: 40,
    fontSize: 20,
    "& .MuiAvatar-root": {
      fontSize: "inherit",
      color: theme.palette.text.secondary,
      fontWeight: 600,
    },
  })
);

type UserAvatarPropsType = {
  user: any;
  className?: string;
};

/**
 * The user avatar component.
 */
function UserAvatar(props: UserAvatarPropsType) {
  const { user, className } = props;

  function getUserInitial(user) {
    if (!user) return "";

    if (user.fullName) return user.fullName[0];
    if (user.name) return user.name[0];
    if (user.userName) return user.userName[0];

    return "";
  }

  return (
    <StyledBadge
      className={className}
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar src={user?.avatar} alt={user?.fullName} className="w-full h-full">
        {getUserInitial(user)}
      </Avatar>
    </StyledBadge>
  );
}

export default UserAvatar;
