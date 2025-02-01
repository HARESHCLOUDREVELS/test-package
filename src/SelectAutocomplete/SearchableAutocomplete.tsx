import { useDebounce } from '../@fuse/hooks';
import { useCallback, useEffect, useState } from 'react';
import CustomAutocomplete from './CustomAutocomplete';
import { TextFieldVariants } from '@mui/material';
import React from 'react';

export type Option = {
	label: string;
	id: string;
};

type SearchableAutocompleteProps = {
	label: string;
	value: string | null;
	isTooltipShow?: boolean;
	variant?: TextFieldVariants;
	onChange: (selectedOption: string) => void;
	fetchOptions: (searchTerm: string, pageIndex?: number) => Promise<Option[]>;
	isParentLoading?: boolean;
	error?: string;
	required?: boolean;
	isSmall?: boolean;
	style?: React.CSSProperties;
	pagination?: {
		pageIndex: number;
		pageSize: number;
		totalCount: number;
	},
	ref?: React.Ref<HTMLElement>;
};

const SearchableAutocomplete = (
	(
		{
			label,
			value,
			variant = "filled",
			isTooltipShow = true,
			onChange,
			fetchOptions,
			isParentLoading = false,
			error = '',
			required = false,
			isSmall = false,
			style = {},
			pagination = {
				pageIndex: 0,
				pageSize: 10,
				totalCount: 0
			},
			ref
		}: SearchableAutocompleteProps,
	) => {
		const [options, setOptions] = useState<Option[]>([]);
		const [loading, setLoading] = useState(isParentLoading);
		const [searchTerm, setSearchTerm] = useState('');
		const [isTyping, setIsTyping] = useState(false);
		const [pageIndex, setPageIndex] = useState(pagination.pageIndex || 0);
		const [isFetching, setIsFetching] = useState(false);

		const deduplicateOptions = (existingOptions: Option[], newOptions: Option[]): Option[] => {
			const existingIds = new Set(existingOptions?.map((option) => option.id));
			const filteredNewOptions = newOptions?.filter((option) => !existingIds?.has(option.id));
			return [...existingOptions, ...filteredNewOptions];
		};

		const fetchDefaultOptions = async () => {
			setLoading(true);
			try {
				const defaultData = await fetchOptions('', 0);
				setOptions(defaultData);
			} catch (err) {
				console.error('Error fetching default options:', err);
			} finally {
				setLoading(false);
			}
		};

		useEffect(() => {
			fetchDefaultOptions();
		}, []);

		const fetchDebouncedOptions = useCallback(
			useDebounce(async (search: string) => {
				setLoading(true);
				try {
					const results = await fetchOptions(search, 0);
					setOptions(results);
				} catch (err) {
					console.error('Error fetching options:', err);
				} finally {
					setLoading(false);
				}
			}, 1000),
			[fetchOptions, value]
		);

		useEffect(() => {
			if (isTyping) {
				if (searchTerm) {
					fetchDebouncedOptions(searchTerm);
				} else {
					fetchDebouncedOptions('');
				}
			}
		}, [searchTerm]);

		const loadMoreOptions = async () => {
			if (isFetching) return;

			setIsFetching(true);
			try {
				const newOptions = await fetchOptions(searchTerm, pageIndex + 1);
				setPageIndex(pageIndex + 1);
				setOptions((prevOptions) => deduplicateOptions(prevOptions, newOptions));
			} catch (err) {
				console.error('Failed to load more options:', err);
			} finally {
				setIsFetching(false);
			}
		};

		const handleScroll = async (e) => {
			const listBoxNode = e.currentTarget;
			if (listBoxNode && listBoxNode.scrollTop + listBoxNode.clientHeight >= listBoxNode.scrollHeight - 10) {
				await loadMoreOptions();
			}
		};

		useEffect(() => {
			setLoading(isParentLoading);
		}, [isParentLoading]);

		return (
			<CustomAutocomplete
				ref={ref}
				label={label}
				variant={variant as TextFieldVariants}
				isTooltipShow={isTooltipShow}
				options={options}
				value={options?.find((option) => option.id === value)?.id || null}
				onChange={(selectedValue: string) => {
					if (selectedValue) {
						onChange(selectedValue);
						setIsTyping(false);
						setSearchTerm('');
					} else {
						onChange('');
						fetchDefaultOptions();
					}
				}}
				error={error}
				required={required}
				loading={loading}
				isSmall={isSmall}
				style={style}
				onInputChange={(event: React.SyntheticEvent, inputValue: string) => {
					setSearchTerm(inputValue);
					setIsTyping(true);
					setPageIndex(0);
				}}
				getListboxProps={{
					onScroll: handleScroll
				}}
			/>
		);
	}
);

export default SearchableAutocomplete;
