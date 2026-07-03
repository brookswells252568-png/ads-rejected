import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Account Policy Violation - Page',
};

export default function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
