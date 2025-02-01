import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appSelector } from "app/store/store";
import { showMessage } from "@fuse/core/FuseMessage/store/fuseMessageSlice";
import api from "src/app/services/apiService";
import { isEmpty } from "lodash";
import { buildQueryParams } from "src/app/services/utils";

// Loading selectors start
const setLoadingState = (key, value) => async (dispatch) => {
  dispatch(setLoading({ key, value }));
};

export const setChatContactsListLoading = (value) =>
  setLoadingState("isChatContactsListLoading", value);
export const setChatListLoading = (value) =>
  setLoadingState("isChatListLoading", value);
export const setChatImageLoading = (value) =>
  setLoadingState("isChatImageLoading", value);
export const setIsStartConversionLoading = (value) =>
  setLoadingState("isStartConversionLoading", value);
export const setIsSendMessageLoading = (value) =>
  setLoadingState("isSendMessageLoading", value);
export const getLoadingStateFactory = (loader) => (state) => {
  return state.messenger.loading[loader] || false;
};
export const setNewMessageLoading = (value) =>
  setLoadingState("hasNewMessageAdded", value);
export const getChatContactsListLoading = getLoadingStateFactory(
  "isChatContactsListLoading"
);
export const getChatListLoading = getLoadingStateFactory("isChatListLoading");
export const getHasNewMessageAdded =
  getLoadingStateFactory("hasNewMessageAdded");
export const getIsChatImageIsLoading =
  getLoadingStateFactory("isChatImageLoading");
export const getIsSendMessageLoading = getLoadingStateFactory(
  "isSendMessageLoading"
);
export const getChatContactSearchKeyword = (state) =>
  state.messenger.chatContactSearchKeyword;
export const getIsStartConversationLoading = (state) =>
  state.messenger.isStartConversionLoading;

const initialState = {
  selectedContactId: "",
  newConversationId: "",
  chatContactList: [],
  chatList: [],
  chatContactSearchKeyword: "",
  conversationDetail: {},
  chatContactsListPagination: {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    sortField: "",
    sortOrder: "",
  },
  chatListPagination: {
    pageIndex: 0,
    pageSize: 20,
    totalCount: 0,
    sortField: "",
    sortOrder: "",
  },
  selectedConversationUserDetail: null,
  loading: {
    isChatContactsListLoading: false,
    isChatListLoading: false,
    hasNewMessageAdded: false,
    isChatImageLoading: false,
  },
};

export const getChatContactList =
  (pageIndex = 0) =>
  async (dispatch, getState) => {
    const existingChatContactList = getChatContactsListData(getState());
    const pagination = getChatContactsListPaginationData(getState());
    const searchKeyword = getChatContactSearchKeyword(getState());
    try {
      dispatch(setChatContactsListLoading(true));

      const queryParams = buildQueryParams({
        PageSize: pagination.pageSize,
        PageIndex: pagination.pageIndex,
        Search: searchKeyword,
      });

      const response: any = await api.get(`/v1/Conversation?${queryParams}`);
      if (response && response.result) {
        dispatch(
          setChatContactsListPagination({
            pageIndex: response.result.conversations.page,
            pageSize: response.result.conversations.pageSize,
            totalCount: response.result.conversations.totalCount,
          })
        );
        const newChatContactList = response?.result?.conversations?.items || [];
        const updatedChatContactList: any = [
          ...existingChatContactList,
          ...(existingChatContactList.length > 0
            ? newChatContactList.filter(
                (newContact) =>
                  !existingChatContactList.some(
                    (existingContact) => existingContact.id === newContact.id
                  )
              )
            : newChatContactList),
        ];
        dispatch(setChatContactList(updatedChatContactList));
      }
      dispatch(setChatContactsListLoading(false));
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      dispatch(setChatContactsListLoading(false));
      console.error(error);
    }
  };

export const getChatList =
  ({ conversationId }) =>
  async (dispatch, getState) => {
    const pagination = getChatListPaginationData(getState());

    try {
      dispatch(setChatListLoading(true));

      const queryParams = buildQueryParams({
        PageSize: pagination.pageSize,
        PageIndex: pagination.pageIndex,
        ConversationId: conversationId,
      });

      const response: any = await api.get(`/v1/ChatMessage?${queryParams}`);

      if (
        response &&
        response.result &&
        response.result.messages &&
        response.result.messages.items
      ) {
        dispatch(setChatList(response.result.messages.items));
        dispatch(
          setChatListPagination({
            pageIndex: response.result.messages.page,
            totalCount: response.result.messages.totalCount,
            pageSize: response.result.messages.pageSize,
          })
        );
        return true;
      } else {
        dispatch(setChatList([]));
        return false;
      }
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      dispatch(setChatListLoading(false));
      console.error(error);
      dispatch(setChatList([]));
      return false;
    } finally {
      dispatch(setChatListLoading(false));
    }
  };

export const getConversationDetail =
  ({ conversationId }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setChatListLoading(true));
      const response: any = await api.get(
        `/v1/Conversation?id=${conversationId}`
      );
      // Use api.get to fetch chat contacts list
      if (response && response.result) {
        dispatch(setConversationDetail(response.result));
      }
      dispatch(setChatListLoading(false));
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      dispatch(setChatListLoading(false));
      console.error(error);
    }
  };

export const addNewMessageOneToOneChat =
  (requestData: any) => async (dispatch: any) => {
    try {
      dispatch(setIsSendMessageLoading(true));
      const response: any = await api.post(`v1/ChatMessage`, requestData);
      if (response && response.result) {
        return true;
      }
    } catch (error: any) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      console.error(error);
      return false;
    } finally {
      dispatch(setIsSendMessageLoading(false));
    }
  };

export const createNewConversation =
  (requestData: any) => async (dispatch: any) => {
    dispatch(setIsStartConversionLoading(true));
    try {
      const response: any = await api.post("/v1/Conversation", requestData);
      if (response && response.result) {
        dispatch(setSelectedConversationUserDetail(response.result));
        dispatch(getChatContactById({ conversationId: response.result.id }))
        dispatch(getChatContactList());
        return response.result;
      } else {
        return false;
      }
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      console.error(error);
      return false;
    } finally {
      dispatch(setIsStartConversionLoading(false));
    }
  };

export const getChatContactById =
  ({ conversationId }) =>
  async (dispatch, getState) => {
    try {
      const existingChatContactList = getChatContactsListData(getState());

      const response: any = await api.get(`/v1/Conversation/${conversationId}`);
      if (response && response.result) {
        const newChatContact = response.result;

        const isAlreadyExists = existingChatContactList?.some(
          (contact) => contact.id === newChatContact.id
        );

        if (!isAlreadyExists) {
          const updatedChatContactList: any = [
            newChatContact,
            ...existingChatContactList,
          ];
          dispatch(setChatContactList(updatedChatContactList));
        }
        return newChatContact;
      }
      return false;
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
      console.error(error);
      return false;
    }
  };

export const markAsReadChat = (request_data) => async (dispatch, getState) => {
  try {
    const response: any = await api.put(
      "/v1/ChatMessage/MarkAsRead",
      request_data
    );
    if (response && response.result) {
      const updatedMessages = response.result;
      const existingChat: any = getChatListData(getState());
      const chatContacts = getChatContactsListData(getState());

      if (!isEmpty(existingChat) && !isEmpty(updatedMessages)) {
        const updatedChatList = existingChat.map((chat) => {
          const updatedMessage = updatedMessages.find(
            (message) => message.id === chat.id
          );

          return updatedMessage
            ? {
                ...chat,
                readAt: updatedMessage.readAt,
              }
            : chat;
        });

        dispatch(setChatList(updatedChatList));
      }

      if (!isEmpty(chatContacts) && !isEmpty(updatedMessages)) {
        const updatedChatContacts = chatContacts?.map((chat) => {
          const updatedMessage = updatedMessages?.find(
            (message) => message?.id === chat?.lastChatMessage?.id
          );

          return updatedMessage
            ? {
                ...chat,
                lastChatMessage: updatedMessage,
              }
            : chat;
        });

        dispatch(setChatContactList(updatedChatContacts));
      }
    }
  } catch (error) {
    dispatch(showMessage({ message: error.message, variant: "error" }));
    console.error(error);
  }
};

export const getChatContactsListData = (state) =>
  state.messenger.chatContactList;
export const getChatContactsListPaginationData = (state) =>
  state.messenger.chatContactsListPagination;
export const getChatListData = (state) => state.messenger.chatList;
export const getChatListPaginationData = (state) =>
  state.messenger.chatListPagination;
export const getConversationDetailData = (state) =>
  state.messenger.conversationDetail;
export const getSelectedConversationUserDetail = (state) =>
  state.messenger.selectedConversationUserDetail;
/**
 * The slice for the contacts.
 */
export const selectedContactIdSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {
    setSelectedContactId: (state, action: PayloadAction<string>) => {
      state.selectedContactId = action.payload;
    },
    removeSelectedContactId: (state) => {
      state.selectedContactId = "";
    },
    setChatContactList: (state, action: PayloadAction<[]>) => {
      state.chatContactList = action.payload;
    },
    setChatContactsListPagination: (state, action: PayloadAction<any>) => {
      state.chatContactsListPagination = {
        ...state.chatContactsListPagination,
        ...action.payload,
      };
    },
    setChatList: (state, action: PayloadAction<[]>) => {
      const newChats: any = action.payload;
      const uniqueNewChats =
        newChats &&
        newChats.filter(
          (newChat) =>
            !state.chatList.some(
              (existingChat) => existingChat.id === newChat.id
            )
        );
      newChats.forEach((newChat) => {
        const existingChatIndex = state.chatList.findIndex(
          (chat) => chat.id === newChat.id
        );

        if (existingChatIndex !== -1) {
          state.chatList[existingChatIndex] = {
            ...state.chatList[existingChatIndex],
            ...newChat,
          };
        }
      });
      state.chatList = [...uniqueNewChats, ...state.chatList];
    },
    setChatListPagination: (state, action: PayloadAction<any>) => {
      state.chatListPagination = {
        ...state.chatListPagination,
        ...action.payload,
      };
    },
    setConversationDetail: (state, action: PayloadAction<any>) => {
      state.conversationDetail = action.payload;
    },
    setSelectedConversationUserDetail: (state, action: PayloadAction<any>) => {
      state.selectedConversationUserDetail = action.payload;
    },
    setNewConversationId: (state, action: PayloadAction<string>) => {
      state.newConversationId = action.payload;
    },
    setChatContactSearchKeyword: (state, action: PayloadAction<string>) => {
      state.chatContactSearchKeyword = action.payload;
    },
    addNewChat: (state, action: PayloadAction<any>) => {
      state.chatList.push(action.payload);
    },
    resetChatList: (state) => {
      state.chatList = initialState.chatList;
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading = {
        ...state.loading,
        [key]: value,
      };
    },
  },
});
export const {
  setSelectedContactId,
  removeSelectedContactId,
  setChatContactList,
  setChatContactsListPagination,
  setChatListPagination,
  setChatList,
  addNewChat,
  setConversationDetail,
  setSelectedConversationUserDetail,
  setNewConversationId,
  setChatContactSearchKeyword,
  resetChatList,
  setLoading,
} = selectedContactIdSlice.actions;

export const selectSelectedContactId = appSelector(
  (state) => state.messenger.selectedContactId
);

export default selectedContactIdSlice.reducer;
