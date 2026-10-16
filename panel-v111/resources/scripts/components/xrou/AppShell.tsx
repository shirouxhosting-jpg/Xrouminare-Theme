import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faCogs,
    faExternalLinkAlt,
    faHistory,
    faKey,
    faLayerGroup,
    faSearch,
    faSignOutAlt,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import http from '@/api/http';
import routes from '@/routers/routes';
import SearchModal from '@/components/dashboard/search/SearchModal';
import useEventListener from '@/plugins/useEventListener';
import Avatar from '@/components/Avatar';
import Can from '@/components/elements/Can';
import { XrouLogo } from '@/components/xrou/Logo';
import XrouThemeToggle from '@/components/xrou/ThemeToggle';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { serverIcons } from '@/components/xrou/navIcons';

export interface XrouNavItem {
    name: string;
    to: string;
    exact?: boolean;
    icon?: typeof faLayerGroup;
    /** Opens in a new tab instead of using the router. */
    external?: boolean;
    /** Client permission (or list) required to see this item. Only valid inside the server context. */
    permission?: string | string[];
}

const accountIcons: Record<string, typeof faUser> = {
    '/': faUser,
    '/api': faKey,
    '/ssh': faKey,
    '/activity': faHistory,
};

const NavSectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p
        className={'px-3 pt-4 pb-2 text-2xs font-extrabold uppercase tracking-widest'}
        style={{ color: 'var(--xrou-text-3)' }}
    >
        {children}
    </p>
);

const XrouNavItemLink = ({ item, onNavigate }: { item: XrouNavItem; onNavigate?: () => void }) => {
    const link = item.external ? (
        <a href={item.to} target={'_blank'} rel={'noreferrer'} className={'xrou-nav-item'}>
            {item.icon && <FontAwesomeIcon icon={item.icon} fixedWidth />}
            <span className={'truncate'}>{item.name}</span>
            <FontAwesomeIcon icon={faExternalLinkAlt} className={'ml-auto text-2xs'} />
        </a>
    ) : (
        <NavLink to={item.to} exact={item.exact} className={'xrou-nav-item'} onClick={onNavigate}>
            {item.icon && <FontAwesomeIcon icon={item.icon} fixedWidth />}
            <span className={'truncate'}>{item.name}</span>
        </NavLink>
    );

    if (item.permission) {
        return <Can action={item.permission} matchAny>{link}</Can>;
    }

    return link;
};

/**
 * XROUMINARE application shell: fixed left sidebar on desktop, drawer on
 * mobile, and a slim top bar with global search. Replaces the stock top
 * navigation bar and sub-navigation strips.
 */
const XrouAppShell = ({ serverNav, children }: { serverNav?: XrouNavItem[]; children: React.ReactNode }) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const username = useStoreState((state: ApplicationStore) => state.user.data!.username);
    const email = useStoreState((state: ApplicationStore) => state.user.data!.email);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEventListener('keydown', (e: KeyboardEvent) => {
        if (['input', 'textarea'].indexOf(((e.target as HTMLElement).tagName || 'input').toLowerCase()) < 0) {
            if (!searchVisible && e.metaKey && e.key.toLowerCase() === '/') {
                setSearchVisible(true);
            }
        }
    });

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const mainNav: XrouNavItem[] = [
        { name: 'Dashboard', to: '/', exact: true, icon: faLayerGroup },
    ];

    const accountNav: XrouNavItem[] = routes.account
        .filter((route) => !!route.name)
        .map((route) => ({
            name: route.name!,
            to: `/account/${route.path}`.replace('//', '/'),
            exact: route.exact,
            icon: accountIcons[route.path] || faUser,
        }));

    const sidebarInner = (onNavigate?: () => void) => (
        <div className={'flex flex-col h-full'}>
            <div className={'px-4 pt-5 pb-4'}>
                <Link to={'/'} className={'inline-block'} onClick={onNavigate}>
                    <span className={'flex items-center gap-2.5'}>
                        <XrouLogo size={34} />
                        <span>
                            <span className={'block font-header font-extrabold tracking-wide text-lg leading-none'} style={{ color: 'var(--xrou-text)' }}>
                                {name}
                            </span>
                            <span className={'block text-2xs font-semibold mt-1'} style={{ color: 'var(--xrou-text-3)' }}>
                                One Panel. Endless Possibilities.
                            </span>
                        </span>
                    </span>
                </Link>
            </div>

            <nav className={'flex-1 overflow-y-auto px-3 pb-4'}>
                {mainNav.map((item) => (
                    <XrouNavItemLink key={item.to} item={item} onNavigate={onNavigate} />
                ))}

                {!!serverNav && serverNav.length > 0 && (
                    <>
                        <NavSectionLabel>Server</NavSectionLabel>
                        {serverNav.map((item) => (
                            <XrouNavItemLink key={item.to} item={item} onNavigate={onNavigate} />
                        ))}
                    </>
                )}

                <NavSectionLabel>Akun</NavSectionLabel>
                {accountNav.map((item) => (
                    <XrouNavItemLink key={item.to} item={item} onNavigate={onNavigate} />
                ))}

                {rootAdmin && (
                    <>
                        <NavSectionLabel>Administrasi</NavSectionLabel>
                        <XrouNavItemLink item={{ name: 'Admin CP', to: '/admin', icon: faCogs, external: true }} onNavigate={onNavigate} />
                    </>
                )}
            </nav>

            <div className={'px-3 pb-4 space-y-3'}>
                <XrouThemeToggle />
                <div className={'xrou-card-flat p-2.5 flex items-center gap-2.5'}>
                    <span className={'flex-shrink-0 rounded-lg overflow-hidden'} style={{ border: '2px solid var(--xrou-border-strong)' }}>
                        <Avatar.User size={30} />
                    </span>
                    <span className={'min-w-0 flex-1'}>
                        <span className={'block text-sm font-bold truncate'} style={{ color: 'var(--xrou-text)' }}>
                            {username}
                        </span>
                        <span className={'block text-2xs truncate'} style={{ color: 'var(--xrou-text-3)' }}>
                            {email}
                        </span>
                    </span>
                    <button
                        type={'button'}
                        title={'Sign out'}
                        aria-label={'Sign out'}
                        onClick={onTriggerLogout}
                        className={'flex-shrink-0 px-2 py-1.5 rounded-md transition-colors'}
                        style={{ color: 'var(--xrou-text-2)', backgroundColor: 'var(--xrou-chip)', border: '2px solid var(--xrou-border-strong)' }}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} size={'sm'} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={'min-h-screen flex'}>
            <SpinnerOverlay visible={isLoggingOut} />

            {/* Desktop sidebar */}
            <aside
                className={'hidden lg:flex flex-col w-[268px] flex-shrink-0 sticky top-0 h-screen border-r-2'}
                style={{ backgroundColor: 'var(--xrou-bg)', borderColor: 'var(--xrou-border)' }}
            >
                {sidebarInner()}
            </aside>

            {/* Mobile drawer */}
            <div className={'lg:hidden'}>
                {drawerOpen && (
                    <div className={'fixed inset-0 z-40 flex'}>
                        <div
                            className={'fixed inset-0'}
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            onClick={() => setDrawerOpen(false)}
                            aria-hidden={'true'}
                        />
                        <aside
                            className={'relative w-[280px] max-w-[85vw] h-full flex flex-col border-r-2'}
                            style={{ backgroundColor: 'var(--xrou-bg)', borderColor: 'var(--xrou-border-strong)' }}
                        >
                            {sidebarInner(() => setDrawerOpen(false))}
                        </aside>
                    </div>
                )}
            </div>

            {/* Content column */}
            <div className={'flex-1 min-w-0 flex flex-col'} style={{ backgroundColor: 'var(--xrou-surface)' }}>
                <header
                    className={'sticky top-0 z-30 h-[60px] flex items-center gap-3 px-4 sm:px-6 border-b-2'}
                    style={{ backgroundColor: 'var(--xrou-bg)', borderColor: 'var(--xrou-border)' }}
                >
                    <button
                        type={'button'}
                        className={'lg:hidden xrou-btn xrou-btn-neutral !p-2'}
                        aria-label={'Open menu'}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    <button
                        type={'button'}
                        onClick={() => setSearchVisible(true)}
                        className={'hidden sm:flex items-center gap-2 w-full max-w-[360px] px-3 py-2 text-sm rounded-md xrou-input font-semibold'}
                        style={{ color: 'var(--xrou-text-3)' }}
                        aria-label={'Search servers'}
                    >
                        <FontAwesomeIcon icon={faSearch} size={'sm'} />
                        <span className={'truncate'}>Cari server…</span>
                        <span
                            className={'ml-auto text-2xs font-bold px-1.5 py-0.5 rounded'}
                            style={{ border: '1.5px solid var(--xrou-border)', color: 'var(--xrou-text-3)' }}
                        >
                            Ctrl + /
                        </span>
                    </button>

                    <div className={'lg:hidden'}>
                        <XrouLogo size={30} />
                    </div>

                    <div className={'flex-1'} />

                    {rootAdmin && (
                        <a href={'/admin'} rel={'noreferrer'} title={'Admin CP'} className={'px-2 py-1.5 rounded-md'} style={{ color: 'var(--xrou-text-2)' }}>
                            <FontAwesomeIcon icon={faCogs} />
                        </a>
                    )}
                    <NavLink to={'/account'} title={'Account settings'} className={'flex items-center gap-2'}>
                        <span className={'rounded-lg overflow-hidden'} style={{ border: '2px solid var(--xrou-border-strong)' }}>
                            <Avatar.User size={28} />
                        </span>
                    </NavLink>
                </header>

                <main className={'flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6'}>{children}</main>
            </div>

            {searchVisible && <SearchModal appear visible onDismissed={() => setSearchVisible(false)} />}
        </div>
    );
};

export default XrouAppShell;
