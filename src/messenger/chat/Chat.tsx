import { lighten } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useSelector } from "react-redux";
import {
  getChatList,
  getChatListData,
  addNewMessageOneToOneChat,
  getSelectedConversationUserDetail,
  resetChatList,
  setChatListPagination,
  getChatListPaginationData,
  getChatListLoading,
  markAsReadChat,
  getIsSendMessageLoading,
} from "../store/messengerAppSlice";
import { Box, Card, Grid, Input, Toolbar } from "@mui/material";
import UserAvatar from "../sidebars/main/UserAvatar";
import { ChatAppContext } from "../MessengerApp";
import { useDispatch } from "react-redux";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { acceptFileTypeImageAndPDF } from "src/app/common/constant";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import FilePreview from "app/shared-components/preview-file/FilePreview";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fileUpload,
  getSelectedDocumentPath,
  setSelectedDocumentPath,
  getIsImageLoading,
} from "../../member/store/memberSlice";
import PreviewMedia from "app/shared-components/Dialog/previewImageDialog";
import DownloadIcon from "@mui/icons-material/Download";
import { isEmpty, throttle } from "lodash";
import { hasPermission, openFileInWindow } from "src/app/services/utils";
import { FeaturePermissions } from "src/app/common/featurePermission";
import ColoredSubmitButton from "app/shared-components/Button/ColoredSubmitButton";
import { useTranslation } from "react-i18next";
import { CancelIconButton, StyledTypographyGrey, StyledFilePreview } from "../../finance-application/components/CommentsComponent";
import SendIcon from "@mui/icons-material/Send";
import { StyledTypography } from "app/shared-components/Textfield/commonPhoneNumberInputProps";
import { StyledDiv, StyledBox } from "../../finance-application/components/CommentsComponent";
import { useSearchParams } from "react-router-dom";

type ChatProps = {
  className?: string;
};

interface MessageContainerProps {
  $sender: string
  $reciever: string
}

/**
 * The chat component.
 */
function Chat(props: ChatProps) {
  const { className } = props;
  const { t } = useTranslation("messenger");
  const dispatch: any = useDispatch();
  const isSendMessageLoading = useSelector(getIsSendMessageLoading);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filePath = useSelector(getSelectedDocumentPath);
  const [searchParams] = useSearchParams();
  const selectedConversationId = searchParams.get('id');
  const chatRef = useRef<HTMLDivElement>(null);
  const chatListPagination = useSelector(getChatListPaginationData);
  const loginUserDetail = useSelector(selectUser);
  const isPermissionToCreateCommunication = hasPermission(
    FeaturePermissions?.ChatMessage.Create
  );
  const isPermissionToRead = hasPermission(
    FeaturePermissions?.ChatMessage.Update
  );
  const chat = useSelector(getChatListData);
  const isChatLoading = useSelector(getChatListLoading);
  const userDetail = useSelector(getSelectedConversationUserDetail);
  const isChatImageLoading = useSelector(getIsImageLoading);
  const isPermissionToViewConversation = hasPermission(
    FeaturePermissions.ChatMessage.View
  );
  const { setMainSidebarOpen, setContactSidebarOpen } =
    useContext(ChatAppContext);

  const [messages, setMessages] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (filePath) {
      setSelectedFile(filePath);
    }
  }, [filePath]);

  useEffect(() => {
    return () => {
      setSelectedFile(null);
      dispatch(setSelectedDocumentPath(null));
    };
  }, [selectedConversationId]);

  useEffect(() => {
    if (!!selectedConversationId && isPermissionToViewConversation) {
      setMessages([]);
      setIsInitialLoad(true);

      // Reset pagination and chat list before fetching new conversation
      dispatch(
        setChatListPagination({
          pageIndex: 0,
          pageSize: 20, // or the desired default page size
        })
      );
      dispatch(resetChatList());
      dispatch(getChatList({ conversationId: selectedConversationId }));
    }
  }, [selectedConversationId]);

  useEffect(() => {
    setMessages(chat);
    if (isEmpty(chat) || !isPermissionToRead) return;
  
    if (chat.some((item: any) => {
      const isUnread = item.senderId !== loginUserDetail?.uid && !item.readAt;
      return isUnread;
    })) {
      dispatch(markAsReadChat({ conversationId: selectedConversationId }));
    }
  }, [chat]);
  
  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  };

  // For The Load More Data When Scroll ON Top
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!chatRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;

      if (scrollTop === 0) {
        const previousScrollHeight = scrollHeight;
        setIsInitialLoad(false);
        // Fetch more messages on scroll to top
        if (chatListPagination.totalCount > chat.length && !isChatLoading) {
          dispatch(
            setChatListPagination({
              pageIndex: chatListPagination.pageIndex + 1,
              pageSize: chatListPagination.pageSize,
            })
          );
          dispatch(getChatList({ conversationId: selectedConversationId })).then(() => {
            //Info: Adjust scrollTop after new data is appended
            setTimeout(() => {
              if (chatRef.current) {
                const newScrollHeight = chatRef.current.scrollHeight;
                chatRef.current.scrollTop = newScrollHeight - previousScrollHeight;
              }
            });
          });
        }
      }
    }, 1000); // Throttled scroll handling

    if (isInitialLoad && messages.length > 0) {
      // Scroll to bottom only on initial load
      scrollToBottom();
      setIsInitialLoad(false); // Set to false after initial scroll
    }

    const pageNode = chatRef.current;
    if (pageNode) {
      pageNode.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (pageNode) {
        pageNode.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dispatch, messages, chatListPagination]);

  function onMessageSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    const requestData = {
      conversationId: selectedConversationId,
      messageText: inputText,
      fileURL: selectedFile,
    };
    dispatch(addNewMessageOneToOneChat(requestData)).then((success) => {
      if (success) {
        setInputText("");
        setSelectedFile(null);
        setTimeout(() => {
          scrollToBottom();
        });
      } else {
        console.error("Failed to send the message.");
      }
    });
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (file) {
      dispatch(fileUpload(file));
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  const renderMessageContent = (message) => {
    return (
      <>
        <div>
          {message.fileURL && (
            <Paper variant="outlined" className="p-6 mb-10 flex items-start">
              <>
                <PreviewMedia filePath={message.fileURL}>
                  <FilePreview fileUrl={message.fileURL} />
                </PreviewMedia>
                <IconButton
                  className="top-0 right-0"
                  onClick={() => openFileInWindow(message.fileURL)}
                >
                  <DownloadIcon />
                </IconButton>
              </>
            </Paper>
          )}
          {message.messageText && (
            <StyledTypography variant="body2" className='!font-normal'>
              {message.messageText}
            </StyledTypography>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Box
        className="w-full border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <Toolbar className="flex items-center justify-between px-16 w-full">
          <div className="flex items-center">
            <IconButton
              aria-label="Open drawer"
              onClick={() => setMainSidebarOpen(true)}
              className="flex lg:hidden"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
            </IconButton>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setContactSidebarOpen(true);
              }}
              onKeyDown={() => setContactSidebarOpen(true)}
              role="button"
              tabIndex={0}
            >
              <UserAvatar
                className="relative mx-8"
                user={{
                  name: `${userDetail?.fullName}`,
                  status: "online",
                }}
              />
              <Typography
                color="inherit"
                className="text-16 font-semibold px-4"
              >
                {userDetail?.fullName}
              </Typography>
            </div>
          </div>
        </Toolbar>
      </Box>

      <div className="flex flex-auto h-full min-h-0 w-full">
        <div className={clsx("flex flex-1 z-10 flex-col relative", className)}>
          <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto w-full">
            {isChatLoading && (
              <Box className="flex justify-center items-center absolute top-0 w-full z-10">
                <CircularProgress size={24} color="secondary" />
              </Box>
            )}
            {messages?.length > 0 &&
              messages?.map((message, index) => (
                <Grid item xs={12} key={index} className='!p-0'>
                  <StyledDiv $sender={loginUserDetail?.uid} $personaldataname={message.senderId} className='pl-8 pr-2'>
                    <div className="max-w-[80%]">
                      <div className="flex flex-col mb-4">
                        <StyledBox
                          $sender={loginUserDetail?.uid as any}
                          $personaldataname={message.senderId}
                        >
                          {renderMessageContent(message)}
                        </StyledBox>
                        <StyledTypographyGrey className={`text-12 !font-normal !italic ${message.senderId === loginUserDetail?.uid ? 'mr-16' : 'ml-16'}`}>
                          {message.created}
                        </StyledTypographyGrey>
                      </div>
                    </div>
                  </StyledDiv>
                </Grid>
              ))}
          </div>
          {isPermissionToCreateCommunication && (
            <Grid item xs={12} className="mx-10 mb-10">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={acceptFileTypeImageAndPDF}
                onChange={handleFileChange}
              />
              <Card className="w-full overflow-hidden">
                <Input
                  className="p-24 w-full"
                  classes={{ root: "text-14" }}
                  placeholder={t("WRITING_MESSAGE")}
                  multiline
                  rows="4"
                  margin="none"
                  disableUnderline
                  value={inputText}
                  disabled={isSendMessageLoading}
                  onChange={(e) => setInputText(e.target.value)}
                />
                {isChatImageLoading && (
                  <StyledFilePreview variant="outlined">
                    <CircularProgress size={18} color="secondary" />
                  </StyledFilePreview>
                )}

                {selectedFile && (
                  <StyledFilePreview variant="outlined">
                    <CancelIconButton
                      onClick={handleRemove}
                      disabled={isSendMessageLoading}
                    >
                      <CancelIcon />
                    </CancelIconButton>
                    <FilePreview fileUrl={selectedFile}></FilePreview>
                  </StyledFilePreview>
                )}
                <Box className="card-footer flex items-center flex- border-t-1 px-24 py-12">
                  <div className="flex flex-1 items-center">
                    <IconButton
                      onClick={handleAttachmentClick}
                      disabled={isSendMessageLoading}
                    >
                      <AttachFileOutlinedIcon />
                    </IconButton>
                    <StyledTypographyGrey
                      variant="body2"
                      className="text-12 !font-400 italic tracking-wide"
                    >
                      ({t("SUPPORT_FILE")}: {acceptFileTypeImageAndPDF})
                    </StyledTypographyGrey>
                  </div>

                  <div>
                    <ColoredSubmitButton
                      size="small"
                      onClick={onMessageSubmit}
                      disabled={!inputText.trim() && !selectedFile}
                      text={t("SEND")}
                      isLoading={isSendMessageLoading}
                      endIcon={<SendIcon />}
                    />
                  </div>
                </Box>
              </Card>
            </Grid>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
