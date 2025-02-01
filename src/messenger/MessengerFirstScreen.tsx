import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '../@fuse/core/FuseSvgIcon';
import { useContext } from 'react';
import { ChatAppContext } from './MessengerApp';
import { useTranslation } from 'react-i18next';
import React from 'react';

/**
 * The chat first screen.
 */
function MessengerFirstScreen() {
	const { setMainSidebarOpen } = useContext(ChatAppContext);
	const { t } = useTranslation("messenger")
	return (
		<div className="flex flex-col flex-1 items-center justify-center w-full p-24">
			<FuseSvgIcon
				className="icon-size-128 mb-16"
				color="disabled"
			>
				heroicons-outline:chat
			</FuseSvgIcon>
			<Typography
				className="hidden lg:flex text-20 font-semibold tracking-tight text-secondary"
				color="text.secondary"
			>
				{t("SELECT_CONVERSATION_TO_START_CHAT")}
			</Typography>
			<Button
				variant="contained"
				color="secondary"
				className="flex lg:hidden"
				onClick={() => setMainSidebarOpen(true)}
			>
				{t("SELECT_CONVERSATION_TO_START_CHAT")}
			</Button>
		</div>
	);
}

export default MessengerFirstScreen;
