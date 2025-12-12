import React, { useState, useEffect } from 'react';
import { aiService } from '../lib/ai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function DebugPage() {
    const { user } = useAuth();
    const [aiStatus, setAiStatus] = useState<{ connected: boolean; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [dbStatus, setDbStatus] = useState<string | null>(null);
    const [messagesCount, setMessagesCount] = useState<number | null>(null);

    const checkAI = async () => {
        setLoading(true);
        setAiStatus(null);
        try {
            const status = await aiService.checkConnection();
            setAiStatus(status);
        } catch (e: any) {
            setAiStatus({ connected: false, message: e.message });
        } finally {
            setLoading(false);
        }
    };

    const checkDB = async () => {
        if (!user) {
            setDbStatus('Please login first to check DB (RLS requires auth)');
            return;
        }

        try {
            const { count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (error) throw error;
            setMessagesCount(count);
            setDbStatus('Database Connected & Readable');
        } catch (e: any) {
            setDbStatus(`DB Error: ${e.message}`);
        }
    };

    useEffect(() => {
        if (user) checkDB();
    }, [user]);

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
            <h1 className="text-3xl font-bold mb-6">System Health Check 🛠️</h1>

            <div className="space-y-6">
                {/* AI Check */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        🤖 AI Intelligence
                        {aiStatus && (
                            aiStatus.connected ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />
                        )}
                    </h2>

                    <button
                        onClick={checkAI}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                        Test AI Connection
                    </button>

                    {aiStatus && (
                        <div className={`mt-4 p-3 rounded-md ${aiStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <p className="font-bold">{aiStatus.connected ? 'Operational' : 'Malfunctioning'}</p>
                            <p className="text-sm">{aiStatus.message}</p>
                        </div>
                    )}
                </div>

                {/* Database Check */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        🗄️ Database & Chat History
                    </h2>
                    <div className="space-y-2">
                        <p className="text-gray-700">User: <span className="font-mono">{user ? user.email : 'Not Logged In'}</span></p>
                        <p className="text-gray-700">DB Status: <span className={`font-bold ${dbStatus?.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{dbStatus || 'Checking...'}</span></p>
                        <p className="text-gray-700">Messages Found: <span className="font-bold">{messagesCount !== null ? messagesCount : '-'}</span></p>
                        <button onClick={checkDB} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
