import { Metadata } from 'next';
import LoginCallback from '../../components/logincallback';
import React from 'react';


export const metadata: Metadata = {
    title: 'Login Callback',
    description: 'Processing authentication...',
};

export default function LoginCallbackPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const code = searchParams.code as string;
    const state = searchParams.state as string;
    
    return (
        <div className="page" style={{ minHeight: '75vh' }}>
            <main>
                <LoginCallback code={code} state={state} />
            </main>
        </div>
    );
}
