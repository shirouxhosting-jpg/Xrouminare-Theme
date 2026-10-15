import {
    faClock,
    faCog,
    faDatabase,
    faFolderOpen,
    faHistory,
    faNetworkWired,
    faRocket,
    faSave,
    faTerminal,
    faUsersCog,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Icon mapping for server sub-navigation paths (used by the XROUMINARE
 * sidebar when viewing a server).
 */
export const serverIcons: Record<string, typeof faTerminal> = {
    '/': faTerminal,
    '/files': faFolderOpen,
    '/databases': faDatabase,
    '/schedules': faClock,
    '/users': faUsersCog,
    '/backups': faSave,
    '/network': faNetworkWired,
    '/startup': faRocket,
    '/settings': faCog,
    '/activity': faHistory,
};
