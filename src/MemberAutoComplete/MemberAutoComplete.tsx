import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsUserListLoading,
  getUserList,
  getUserListPaginationData,
  setIsUserListLoading,
  setUserListPagination,
  setUserSearchKeyword,
} from "src/app/main/finance-application/store/financeApplicationSlice";
import { TextFieldVariants } from "@mui/material";
import SearchableAutocomplete from "../SelectAutocomplete/SearchableAutocomplete";

const MemberAutoComplete = ({
  label,
  roleIds = [],
  onChange,
  value = null,
  error = "",
  required = true,
  style = {},
  isTooltipShow = true,
  variant = "filled",
}) => {
  const dispatch: any = useDispatch();
  const loading = useSelector(getIsUserListLoading);
  const pagination = useSelector(getUserListPaginationData);

  useEffect(() => {
    return () => {
      dispatch(setUserSearchKeyword(""));
      dispatch(setUserListPagination({ pageIndex: 0 }));
    };
  }, [dispatch]);

  const handleOptionChange = (dispatch, onChange, value) => {
    const selectedId = value ? value.id : null;
    onChange(selectedId);
    dispatch(setIsUserListLoading(false));
  };

  const fetchUserOptions = async (dispatch, roleIds, searchTerm, pageIndex) => {
    dispatch(setUserSearchKeyword(searchTerm));
    dispatch(setUserListPagination({ pageIndex: pageIndex }));

    const newOptions = await dispatch(getUserList(roleIds));
    return newOptions?.map((item) => ({
      id: item.id,
      label: item?.additionalDetails?.nationalId
        ? `${item.userName} (${item?.additionalDetails?.nationalId})`
        : item.userName,
    }));
  };

  return (
    <SearchableAutocomplete
      label={label}
      variant={variant as TextFieldVariants}
      value={value}
      onChange={(value: any) => handleOptionChange(dispatch, onChange, value)}
      fetchOptions={(searchTerm, pageIndex) =>
        fetchUserOptions(dispatch, roleIds, searchTerm, pageIndex)
      }
      isParentLoading={loading}
      error={error}
      required={required}
      pagination={pagination}
      style={style}
      isTooltipShow={isTooltipShow}
    />
  );
};

export default MemberAutoComplete;