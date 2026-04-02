import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Adsmanager Rejected',
};

export default function AdsRejectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
