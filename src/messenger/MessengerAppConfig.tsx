import { lazy } from 'react';
import { authRoles } from 'src/app/auth';
import MessengerFirstScreen from './MessengerFirstScreen';
import Chat from './chat/Chat';
import i18next from "i18next";
import en from "./i18n/en";
import ms from "./i18n/ms";
import React from 'react';

i18next.addResourceBundle("en", "messenger", en);
i18next.addResourceBundle("ms", "messenger", ms);

const MessengerApp = lazy(() => import('./MessengerApp'));
/**
 * The chat app config.
 */
const MessengerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: 'messenger',
			title: 'MESSENGER',
			element: <MessengerApp />,
			children: [
				{
					path: '',
					title: 'MESSENGER',
					element: <MessengerFirstScreen />
				},
				{
					path: 'chat',
					title: 'MESSENGER',
					element: <Chat />
				}
			]
		}
	]
};

export default MessengerAppConfig;
