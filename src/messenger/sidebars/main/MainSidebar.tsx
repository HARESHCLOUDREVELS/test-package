import FuseScrollbars from "@fuse/core/FuseScrollbars";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import { lighten } from "@mui/material/styles";
import ContactListItem from "./ContactListItem";
import UserAvatar from "./UserAvatar";
import ChatListItem from "./ChatListItem";
import { useDispatch } from "react-redux";
import {
  getChatContactList,
  setSelectedConversationUserDetail,
  setChatContactSearchKeyword,
  getChatContactById,
  getChatContactsListPaginationData,
  getChatContactsListLoading,
  setChatContactsListPagination,
  addNewChat,
  setChatContactList,
  setChatContactsListLoading,
} from "../../store/messengerAppSlice";
import { useSelector } from "react-redux";
import { getChatContactsListData } from "../../store/messengerAppSlice";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { isEmpty, throttle } from "lodash";
import { signalRFinanceHubEnum } from "src/app/common/constant";
import {
  getUserList,
  setUserSearchKeyword,
  getUsers,
  getIsUserListLoading,
  setIsUserListLoading,
  setUsers,
} from "src/app/main/finance-application/store/financeApplicationSlice";
import { useDebounce } from "@fuse/hooks";
import moment from "moment";
import history from "@history";
import { CircularProgress } from "@mui/material";
import connection from "src/app/services/SignalR/signalRService";
import { hasPermission } from "src/app/services/utils";
import { FeaturePermissions } from "src/app/common/featurePermission";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  getRoleList,
  getRoles,
} from "src/app/main/role-permission/store/rolePermissionSlice";

function MainSidebar() {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("id");
  const [searchText, setSearchText] = useState("");
  const dispatch: any = useDispatch();
  const chatContacts = useSelector(getChatContactsListData);
  const loginUser: any = useSelector(selectUser);
  const newUsersData = useSelector(getUsers);
  const conversationRef = useRef<HTMLDivElement>(null);
  const conversationPagination = useSelector(getChatContactsListPaginationData);
  const isChatContactLoading = useSelector(getChatContactsListLoading);
  const isContactListLoading = useSelector(getIsUserListLoading);
  const { t } = useTranslation("messenger");
  const isUserListPermission = hasPermission(FeaturePermissions.User.List);
  const isChatListPermission = hasPermission(
    FeaturePermissions.ChatMessage.List
  );
  const isPermissionToViewConversation = hasPermission(
    FeaturePermissions.ChatMessage.View
  );
  const hasRoleIdApiPermission = hasPermission(FeaturePermissions.Role.List);
  const allRoleIds = useSelector(getRoleList);
  const roleIds =
    allRoleIds.length > 0 ? allRoleIds.map((role) => role.id) : [];

  useEffect(() => {
    if (hasRoleIdApiPermission) {
      dispatch(getRoles());
    }
  }, []);

  useEffect(() => {
    if (isChatListPermission) {
      dispatch(getChatContactList());
    }
  }, [dispatch]);

  // For SignalR Connection To OneToOne Chat
  useEffect(() => {
    connection.on(signalRFinanceHubEnum.OneToOneChat, (newMessage) => {
      if (conversationId === newMessage?.conversationId) {
        dispatch(addNewChat(newMessage));
        if (!isEmpty(chatContacts)) {
          const updatedChatContacts = chatContacts?.map((chat) =>
            chat.id === newMessage.conversationId
              ? {
                  ...chat,
                  lastChatMessage: newMessage,
                  lastModified: newMessage.lastModified,
                }
              : chat
          );
          dispatch(setChatContactList(updatedChatContacts));
        }
      } else if (!isEmpty(chatContacts)) {
        const chatContact = chatContacts?.find(
          (chat) => chat.id === newMessage?.conversationId
        );

        if (!isEmpty(chatContact)) {
          const updatedChatContacts = chatContacts?.map((chat) =>
            chat.id === newMessage.conversationId
              ? {
                  ...chat,
                  lastChatMessage: newMessage,
                  lastModified: newMessage.lastModified,
                }
              : chat
          );

          dispatch(setChatContactList(updatedChatContacts));
        } else if (!!newMessage?.conversationId) {
          dispatch(
            getChatContactById({ conversationId: newMessage?.conversationId })
          );
        }
      } else if (!!newMessage?.conversationId) {
        dispatch(
          getChatContactById({ conversationId: newMessage?.conversationId })
        );
      }
    });

    return () => {
      connection.off(signalRFinanceHubEnum.OneToOneChat);
    };
  }, [dispatch, conversationId, chatContacts]);

  const getSearchContact = useDebounce(() => {
    if (searchText.trim()) {
      dispatch(
        setChatContactsListPagination({
          pageIndex: 0,
          pageSize: conversationPagination.pageSize,
        })
      );
      dispatch(setChatContactList([]));
      dispatch(setChatContactSearchKeyword(searchText));
      dispatch(getChatContactList());
      // INFO: For User Search
      if (isUserListPermission && roleIds.length > 0) {
        dispatch(setUserSearchKeyword(searchText));
        dispatch(getUserList(roleIds));
      }
    } else {
      dispatch(setUsers([]));
      dispatch(setChatContactSearchKeyword(""));
      dispatch(setUserSearchKeyword(""));
      dispatch(getChatContactList());
      dispatch(setIsUserListLoading(false));
    }
  }, 1500);

  function userSearchHandler(event) {
    setSearchText(event.target.value);
    dispatch(setChatContactsListLoading(true));
    if (isUserListPermission && roleIds.length > 0) {
      dispatch(setIsUserListLoading(true));
    }
    getSearchContact();
  }

  const filteredChatList: any = useMemo(() => {
    if (!chatContacts) return [];

    const sortedChats = [...chatContacts]
      .filter((chat) => chat.lastChatMessage?.created || chat.created)
      .sort((a, b) => {
        const dateA = moment(a.lastChatMessage?.created || a.created).valueOf();
        const dateB = moment(b.lastChatMessage?.created || b.created).valueOf();
        return dateB - dateA;
      });

    return sortedChats;
  }, [chatContacts, newUsersData, searchText]);

  useEffect(() => {
    if (
      !isEmpty(chatContacts) &&
      !!conversationId &&
      isPermissionToViewConversation
    ) {
      const chatContact = chatContacts?.find(
        (chat) => chat.id === conversationId
      );
      if (!isEmpty(chatContact?.userDetail)) {
        dispatch(setSelectedConversationUserDetail(chatContact.userDetail));
      } else if (!!conversationId) {
        dispatch(getChatContactById({ conversationId: conversationId })).then(
          (response) => {
            if (!isEmpty(response?.userDetail)) {
              dispatch(setSelectedConversationUserDetail(response?.userDetail));
            } else {
              history.replace("/messenger");
            }
          }
        );
      }
    } else if (!isPermissionToViewConversation) {
      history.replace("/messenger");
    }
  }, [dispatch, chatContacts, conversationId]);

  const filteredContacts: any = useMemo(() => {
    if (!newUsersData) return [];
    const chatContactIds = chatContacts.flatMap((chat) => {
      const ids = [chat.userOneId, chat.userTwoId];
      return ids.filter((id) => id !== loginUser.uid);
    });

    const filteredMemberList = newUsersData.filter(
      (member) =>
        !chatContactIds.includes(member.id) && member.id !== loginUser.uid
    );
    return filteredMemberList;
  }, [newUsersData, chatContacts]);

  // For The Load More Conversion Contact When Scroll ON Bottom
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!conversationRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;

      if (scrollHeight - scrollTop <= clientHeight + 100) {
        if (
          conversationPagination.totalCount > chatContacts.length &&
          !isChatContactLoading
        ) {
          dispatch(
            setChatContactsListPagination({
              pageIndex: conversationPagination.pageIndex + 1,
              pageSize: conversationPagination.pageSize,
            })
          );

          dispatch(getChatContactList());
        }
      }
    }, 1500); // Throttled scroll handling

    const pageNode = conversationRef.current;
    if (pageNode) {
      pageNode.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (pageNode) {
        pageNode.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dispatch, chatContacts, conversationPagination]);

  return (
    <div className="flex flex-col flex-auto h-full border-r-1 border-r-solid border-r-grey-400">
      <Box
        className="py-16 px-16 sticky top-0 z-10 border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <div className="flex justify-between items-center mb-16">
          {loginUser && (
            <div
              className="flex items-center cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <UserAvatar
                className="relative"
                user={{
                  avatar: loginUser?.avatar,
                  fullName: loginUser?.data?.displayName,
                }}
              />
              <Typography className="mx-16 font-medium">
                {loginUser?.data.displayName}
              </Typography>
            </div>
          )}
        </div>

        {useMemo(
          () => (
            <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40  shadow-none">
              <FuseSvgIcon color="action" size={20}>
                heroicons-solid:search
              </FuseSvgIcon>

              <Input
                placeholder={t("SEARCH_OR_START_NEW_CHAT")}
                className="flex flex-1 px-8"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  "aria-label": "Search",
                }}
                onChange={userSearchHandler}
              />

              {searchText.trim() &&
                (isContactListLoading || isChatContactLoading) && (
                  <CircularProgress size={18} color="secondary" />
                )}
            </Paper>
          ),
          [searchText, t, isContactListLoading, isChatContactLoading]
        )}
      </Box>

      <FuseScrollbars className="flex-1">
        <List className="w-full pt-0">
          {useMemo(() => {
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.02,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            };

            return (
              <motion.div
                className="flex flex-col min-h-[10vh] max-h-[calc(100vh-250px)] h-full shrink-0 overflow-y-auto"
                variants={container}
                initial="hidden"
                animate="show"
                ref={conversationRef}
              >
                {filteredChatList.length > 0 && (
                  <motion.div variants={item}>
                    <Typography
                      className="font-medium text-20 px-16 py-12"
                      color="secondary.main"
                    >
                      {t("CONVERSATIONS")}
                    </Typography>
                  </motion.div>
                )}

                {filteredChatList &&
                  filteredChatList.map((chat, index) => (
                    <motion.div variants={item} key={chat.id}>
                      <div
                        className={clsx(
                          filteredChatList.length !== index + 1 && "border-b-1"
                        )}
                      >
                        <ChatListItem item={chat} />
                      </div>
                    </motion.div>
                  ))}

                {/* contacts title */}
                {filteredContacts.length > 0 && (
                  <motion.div variants={item}>
                    <Typography
                      className="font-medium text-20 px-16 py-12"
                      color="secondary.main"
                    >
                      {t("CONTACTS")}
                    </Typography>
                  </motion.div>
                )}

                {!isEmpty(filteredContacts) &&
                  filteredContacts.map((contact, index) => (
                    <motion.div variants={item} key={contact.id}>
                      <div
                        className={clsx(
                          filteredContacts.length !== index + 1 && "border-b-1"
                        )}
                      >
                        <ContactListItem item={contact} />
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            );
          }, [newUsersData, filteredChatList, searchText, t])}

          {isEmpty(chatContacts) && isChatContactLoading && (
            <Box className="flex justify-center items-center absolute top-0 w-full z-10">
              <CircularProgress size={24} color="secondary" />
            </Box>
          )}
        </List>
      </FuseScrollbars>

      {/* IF Not Found Conversation And Contact */}
      {isEmpty(filteredChatList) &&
        isEmpty(filteredContacts) &&
        !isChatContactLoading &&
        !isContactListLoading && (
          <div className="flex flex-col justify-center absolute items-center w-full h-full text-center py-5 top-0">
            <Typography variant="h6" className="text-gray-500">
              {t("NOT_CONVERSATION_AND_CHAT_FOUND")}
            </Typography>
          </div>
        )}
    </div>
  );
}

export default MainSidebar;
