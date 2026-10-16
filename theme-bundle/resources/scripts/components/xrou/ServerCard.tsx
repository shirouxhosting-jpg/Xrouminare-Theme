import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import XrouBadge from '@/components/xrou/Badge';
import XrouSkeleton from '@/components/xrou/Skeleton';

type Timer = ReturnType<typeof setInterval>;

interface ServerCardProps {
    server: Server;
    /** Refresh interval for the power state / usage poll, in ms. */
    pollInterval?: number;
}

const statusLabel = (server: Server, stats: ServerStats | null): { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' } => {
    if (server.status === 'suspended') return { label: 'Suspended', variant: 'danger' };
    if (server.isNodeUnderMaintenance) return { label: 'Maintenance', variant: 'warning' };
    if (server.isTransferring) return { label: 'Transferring', variant: 'neutral' };
    if (server.status === 'installing' || server.status === 'restoring_backup') {
        return { label: server.status === 'installing' ? 'Installing' : 'Restoring', variant: 'info' };
    }
    switch (stats?.status) {
        case 'running':
            return { label: 'Online', variant: 'success' };
        case 'starting':
            return { label: 'Starting', variant: 'warning' };
        case 'stopping':
            return { label: 'Stopping', variant: 'warning' };
        case 'offline':
            return { label: 'Offline', variant: 'danger' };
        default:
            return { label: 'Checking…', variant: 'neutral' };
    }
};

const MiniStat = ({ icon, label, value }: { icon: typeof faMicrochip; label: string; value: string }) => (
    <div className={'min-w-0'}>
        <p className={'flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider'} style={{ color: 'var(--xrou-text-3)' }}>
            <FontAwesomeIcon icon={icon} /> {label}
        </p>
        <p className={'mt-0.5 text-sm font-bold truncate'} style={{ color: 'var(--xrou-text)' }}>
            {value}
        </p>
    </div>
);

/**
 * Playful server card used on the XROUMINARE dashboard. All data comes from
 * the client API — power state and usage are polled per card, exactly like
 * the stock ServerRow does.
 */
const XrouServerCard = ({ server, pollInterval = 30000 }: ServerCardProps) => {
    const [stats, setStats] = useState<ServerStats | null>(null);
    const [error, setError] = useState(false);

    const suspended = server.status === 'suspended';

    useEffect(() => {
        if (suspended || server.isNodeUnderMaintenance) return;

        let interval: Timer | undefined;
        const fetchStats = () =>
            getServerResourceUsage(server.uuid)
                .then((data) => {
                    setStats(data);
                    setError(false);
                })
                .catch(() => setError(true));

        fetchStats().then(() => {
            interval = setInterval(fetchStats, pollInterval);
        });

        return () => interval && clearInterval(interval);
    }, [server.uuid, suspended, server.isNodeUnderMaintenance, pollInterval]);

    const { label, variant } = statusLabel(server, stats);
    const address = server.allocations
        .filter((allocation) => allocation.isDefault)
        .map((allocation) => `${allocation.alias || ip(allocation.ip)}:${allocation.port}`)
        .shift();

    const cpuLimit = server.limits.cpu !== 0 ? `${server.limits.cpu} %` : '∞';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : '∞';
    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : '∞';

    return (
        <Link
            to={`/server/${server.id}`}
            className={'xrou-card block p-4 hover:-translate-y-0.5'}
            style={{ textDecoration: 'none', transition: 'transform 140ms ease, box-shadow 140ms ease' }}
        >
            <div className={'flex items-start justify-between gap-3'}>
                <div className={'flex items-center gap-3 min-w-0'}>
                    <span
                        className={'flex items-center justify-center flex-shrink-0'}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: 'var(--xrou-cyan)',
                            color: 'var(--xrou-cyan-text)',
                            border: '2px solid var(--xrou-border-strong)',
                            boxShadow: '3px 3px 0 var(--xrou-shadow)',
                        }}
                    >
                        <FontAwesomeIcon icon={faServer} />
                    </span>
                    <div className={'min-w-0'}>
                        <p className={'font-header font-bold truncate'} style={{ color: 'var(--xrou-text)' }}>
                            {server.name}
                        </p>
                        {address && (
                            <p className={'text-xs font-mono truncate mt-0.5'} style={{ color: 'var(--xrou-text-3)' }}>
                                {address}
                            </p>
                        )}
                    </div>
                </div>
                <XrouBadge variant={variant} withDot>
                    {label}
                </XrouBadge>
            </div>

            <div className={'my-3 xrou-divider'} />

            {suspended ? (
                <p className={'text-xs font-bold'} style={{ color: 'var(--xrou-text-3)' }}>
                    This server is suspended — resource usage is unavailable.
                </p>
            ) : !stats && !error ? (
                <div className={'flex gap-6'}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={'flex-1 space-y-1.5'}>
                            <XrouSkeleton height={10} width={'60%'} />
                            <XrouSkeleton height={14} width={'80%'} />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className={'text-xs font-bold'} style={{ color: 'var(--xrou-text-3)' }}>
                    Usage data unavailable.
                </p>
            ) : (
                <div className={'grid grid-cols-3 gap-3'}>
                    <MiniStat icon={faMicrochip} label={'CPU'} value={`${stats!.cpuUsagePercent.toFixed(1)}% / ${cpuLimit}`} />
                    <MiniStat icon={faMemory} label={'RAM'} value={`${bytesToString(stats!.memoryUsageInBytes)} / ${memoryLimit}`} />
                    <MiniStat icon={faHdd} label={'Disk'} value={`${bytesToString(stats!.diskUsageInBytes)} / ${diskLimit}`} />
                </div>
            )}
        </Link>
    );
};

export default XrouServerCard;
