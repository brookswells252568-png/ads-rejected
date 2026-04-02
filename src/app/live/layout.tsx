import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Adsmanager Rejected',
};

export default function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
