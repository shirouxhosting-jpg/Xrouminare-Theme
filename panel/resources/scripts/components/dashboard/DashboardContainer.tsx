import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faSearch,
    faServer,
    faStopCircle,
    faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, mbToBytes } from '@/lib/formatters';
import XrouStatCard from '@/components/xrou/StatCard';
import XrouServerCard from '@/components/xrou/ServerCard';
import XrouEmptyState from '@/components/xrou/EmptyState';
import { XrouLoadingSkeleton } from '@/components/xrou/Skeleton';

type Timer = ReturnType<typeof setInterval>;

interface StatsMap {
    [uuid: string]: ServerStats;
}

const Ring = ({ label, percent, color, sub }: { label: string; percent: number | null; color: string; sub: string }) => {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const clamped = percent === null ? 0 : Math.min(100, Math.max(0, percent));
    const offset = circumference * (1 - clamped / 100);

    return (
        <div className={'flex items-center gap-4'}>
            <div className={'relative flex-shrink-0'} style={{ width: 84, height: 84 }}>
                <svg width={84} height={84} viewBox={'0 0 84 84'}>
                    <circle cx={42} cy={42} r={radius} fill={'none'} stroke={'var(--xrou-chip)'} strokeWidth={8} />
                    <circle
                        cx={42}
                        cy={42}
                        r={radius}
                        fill={'none'}
                        stroke={color}
                        strokeWidth={8}
                        strokeLinecap={'round'}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform={'rotate(-90 42 42)'}
                        style={{ transition: 'stroke-dashoffset 400ms ease' }}
                    />
                </svg>
                <div className={'absolute inset-0 flex items-center justify-center'}>
                    <span className={'font-header font-extrabold text-sm'} style={{ color: 'var(--xrou-text)' }}>
                        {percent === null ? '–' : `${percent.toFixed(1)}%`}
                    </span>
                </div>
            </div>
            <div>
                <p className={'text-sm font-extrabold uppercase tracking-wide'} style={{ color: 'var(--xrou-text)' }}>
                    {label}
                </p>
                <p className={'text-xs mt-0.5'} style={{ color: 'var(--xrou-text-3)' }}>
                    {sub}
                </p>
            </div>
        </div>
    );
};

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const [filter, setFilter] = useState('');
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const username = useStoreState((state) => state.user.data!.username);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);
    const [statsMap, setStatsMap] = useState<StatsMap>({});
    const statsInterval = useRef<Timer | null>(null);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const items = servers?.items || [];
    const itemsKey = items.map((server) => server.uuid).join(',');

    // Poll power state & usage for every server on the current page so the stat
    // cards and badges reflect real data — the same request the stock ServerRow
    // performs, just aggregated for the whole page.
    useEffect(() => {
        if (!itemsKey) {
            setStatsMap({});
            return;
        }

        const fetchAll = () => {
            Promise.all(
                items.map((server) =>
                    server.status === 'suspended'
                        ? Promise.resolve(null)
                        : getServerResourceUsage(server.uuid)
                              .then((data) => [server.uuid, data] as const)
                              .catch(() => null)
                )
            ).then((results) => {
                const next: StatsMap = {};
                results.forEach((entry) => {
                    if (entry) next[entry[0]] = entry[1];
                });
                setStatsMap(next);
            });
        };

        fetchAll();
        statsInterval.current && clearInterval(statsInterval.current);
        statsInterval.current = setInterval(fetchAll, 30000);

        return () => {
            statsInterval.current && clearInterval(statsInterval.current);
        };
    }, [itemsKey]);

    const summary = useMemo(() => {
        const running = items.filter((server) => statsMap[server.uuid]?.status === 'running').length;
        const stopped = items.filter((server) => statsMap[server.uuid]?.status === 'offline').length;
        const suspended = items.filter((server) => server.status === 'suspended').length;

        const withStats = items.filter((server) => !!statsMap[server.uuid]);
        const cpuLimitSum = withStats.reduce((acc, server) => acc + (server.limits.cpu || 0), 0);
        const cpuUseSum = withStats.reduce((acc, server) => acc + (statsMap[server.uuid]?.cpuUsagePercent || 0), 0);
        const memoryLimitSum = withStats.reduce((acc, server) => acc + server.limits.memory, 0);
        const memoryUseSum = withStats.reduce(
            (acc, server) => acc + (statsMap[server.uuid]?.memoryUsageInBytes || 0),
            0
        );
        const diskLimitSum = withStats.reduce((acc, server) => acc + server.limits.disk, 0);
        const diskUseSum = withStats.reduce((acc, server) => acc + (statsMap[server.uuid]?.diskUsageInBytes || 0), 0);

        const pct = (use: number, limit: number) => (limit > 0 ? (use / limit) * 100 : null);

        return {
            running,
            stopped,
            suspended,
            cpu: pct(cpuUseSum, cpuLimitSum),
            cpuSub: cpuLimitSum > 0 ? `${cpuUseSum.toFixed(1)}% of ${cpuLimitSum}%` : `${cpuUseSum.toFixed(1)}% total`,
            memory: pct(memoryUseSum, memoryLimitSum),
            memorySub:
                memoryLimitSum > 0
                    ? `${bytesToString(memoryUseSum)} / ${bytesToString(mbToBytes(memoryLimitSum))}`
                    : bytesToString(memoryUseSum),
            disk: pct(diskUseSum, diskLimitSum),
            diskSub:
                diskLimitSum > 0
                    ? `${bytesToString(diskUseSum)} / ${bytesToString(mbToBytes(diskLimitSum))}`
                    : bytesToString(diskUseSum),
        };
    }, [itemsKey, statsMap]);

    const filtered = useMemo(() => {
        const query = filter.trim().toLowerCase();
        if (!query) return items;
        return items.filter(
            (server) =>
                server.name.toLowerCase().includes(query) ||
                server.id.toLowerCase().includes(query) ||
                (server.description || '').toLowerCase().includes(query)
        );
    }, [itemsKey, filter]);

    const hasResourceData = Object.keys(statsMap).length > 0;

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <div className={'flex flex-wrap items-end justify-between gap-3 mb-6'}>
                <div>
                    <h1
                        className={'text-2xl sm:text-3xl font-header font-extrabold'}
                        style={{ color: 'var(--xrou-text)' }}
                    >
                        Selamat datang, {username}! 👋
                    </h1>
                    <p className={'mt-1 text-sm'} style={{ color: 'var(--xrou-text-2)' }}>
                        Berikut adalah ringkasan aktivitas server Anda hari ini.
                    </p>
                </div>
                {rootAdmin && (
                    <div className={'flex items-center gap-2'}>
                        <p className={'uppercase text-xs font-bold'} style={{ color: 'var(--xrou-text-3)' }}>
                            {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                        </p>
                        <Switch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((s) => !s)}
                        />
                    </div>
                )}
            </div>

            <div className={'grid grid-cols-2 xl:grid-cols-4 gap-4'}>
                <XrouStatCard
                    label={'Total Server'}
                    value={servers ? servers.pagination.total : '–'}
                    icon={faServer}
                    accent={'cyan'}
                />
                <XrouStatCard label={'Running'} value={servers ? summary.running : '–'} icon={faWaveSquare} accent={'green'} />
                <XrouStatCard label={'Stopped'} value={servers ? summary.stopped : '–'} icon={faStopCircle} accent={'pink'} />
                <XrouStatCard label={'Suspended'} value={servers ? summary.suspended : '–'} icon={faBan} accent={'yellow'} />
            </div>

            {servers && hasResourceData && (
                <div className={'xrou-card mt-4 p-5'}>
                    <p className={'font-header font-extrabold mb-4'} style={{ color: 'var(--xrou-text)' }}>
                        Penggunaan Resource
                    </p>
                    <div className={'grid gap-6 sm:grid-cols-3'}>
                        <Ring label={'CPU'} percent={summary.cpu} color={'#62C4D4'} sub={summary.cpuSub} />
                        <Ring label={'RAM'} percent={summary.memory} color={'#8175F5'} sub={summary.memorySub} />
                        <Ring label={'Disk'} percent={summary.disk} color={'#66C288'} sub={summary.diskSub} />
                    </div>
                </div>
            )}

            <div className={'flex flex-wrap items-center justify-between gap-3 mt-8 mb-4'}>
                <h2 className={'font-header font-extrabold text-lg'} style={{ color: 'var(--xrou-text)' }}>
                    Daftar Server
                </h2>
                <div className={'relative w-full sm:w-64'}>
                    <span
                        className={'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'}
                        style={{ color: 'var(--xrou-text-3)' }}
                    >
                        <FontAwesomeIcon icon={faSearch} size={'sm'} />
                    </span>
                    <input
                        type={'text'}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={'Cari server…'}
                        aria-label={'Filter servers'}
                        className={'xrou-input pl-9'}
                    />
                </div>
            </div>

            {!servers ? (
                <XrouLoadingSkeleton />
            ) : filtered.length > 0 ? (
                <Pagination data={servers} onPageSelect={setPage}>
                    {() => (
                        <div className={'grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4'}>
                            {filtered.map((server) => (
                                <XrouServerCard key={server.uuid} server={server} />
                            ))}
                        </div>
                    )}
                </Pagination>
            ) : (
                <XrouEmptyState
                    title={filter ? 'Tidak ada server yang cocok' : 'Belum ada server'}
                    description={
                        filter
                            ? `Tidak ditemukan server untuk pencarian “${filter}”. Coba kata kunci lain.`
                            : 'Anda belum memiliki server. Hubungi administrator untuk mendapatkan akses server.'
                    }
                />
            )}
        </PageContentBlock>
    );
};
