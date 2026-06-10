import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { RecoverPassword } from './RecoverPassword';

export const AuthPage = () => {
    const [view, setView] = useState('login'); // 'login', 'recover'

    return (
        <>
            {view === 'login' && (
                <LoginPage onSwitchToRecover={() => setView('recover')} />
            )}
            {view === 'recover' && <RecoverPassword onSwitchToLogin={() => setView('login')} />}
        </>
    );
};
