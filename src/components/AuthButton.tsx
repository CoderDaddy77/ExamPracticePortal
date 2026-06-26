import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { loginWithGoogle, logout, auth, deleteUserAccount } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { LogIn, LogOut, Loader2, User as UserIcon, Trash2, ChevronDown, Download, Upload, Check, AlertCircle, Image } from 'lucide-react';
import { readBackupFile, validateBackupFile, getImportSummary } from '../utils/dataPortability';
import type { BackupData, ImportSummary } from '../utils/dataPortability';

interface AuthButtonProps {
    isDark: boolean;
    onAuthChange?: (user: User | null) => void;
    onExportData?: () => Promise<void>;
    onImportData?: (backupData: BackupData) => Promise<boolean>;
}

export function AuthButton({ isDark, onAuthChange, onExportData, onImportData }: AuthButtonProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const [exportLoading, setExportLoading] = useState(false);
    const [exportDone, setExportDone] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [pendingImport, setPendingImport] = useState<BackupData | null>(null);
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
            onAuthChange?.(currentUser);
        });
        return () => unsubscribe();
    }, [onAuthChange]);

    // Update dropdown position when button is clicked
    useEffect(() => {
        if (showDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, [showDropdown]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                // Don't close if import confirm modal is open
                if (showImportConfirm) return;
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showImportConfirm]);

    const handleLogin = async () => {
        try {
            setLoading(true);
            await loginWithGoogle();
        } catch (error) {
            console.error("Login error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setShowDropdown(false);
            await logout();
            window.location.reload();
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This will remove all your data and cannot be undone.')) {
            try {
                if (user) {
                    await deleteUserAccount(user.uid);
                    window.location.reload();
                }
            } catch (error) {
                console.error("Delete account error", error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const handleExport = async () => {
        if (!onExportData || exportLoading) return;
        try {
            setExportLoading(true);
            setExportDone(false);
            await onExportData();
            setExportDone(true);
            setTimeout(() => setExportDone(false), 2000);
        } catch (error) {
            console.error("Export error", error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    const handleImportClick = () => {
        setImportError(null);
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input so user can re-select same file
        e.target.value = '';

        try {
            setImportLoading(true);
            setImportError(null);

            const parsed = await readBackupFile(file);
            const validation = validateBackupFile(parsed);

            if (!validation.valid) {
                setImportError(validation.error || 'Invalid backup file.');
                setImportLoading(false);
                return;
            }

            const backupData = parsed as BackupData;
            const summary = getImportSummary(backupData);

            setPendingImport(backupData);
            setImportSummary(summary);
            setShowImportConfirm(true);
        } catch (error: any) {
            setImportError(error.message || 'Failed to read file.');
        } finally {
            setImportLoading(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!pendingImport || !onImportData) return;

        try {
            setImportLoading(true);
            const success = await onImportData(pendingImport);
            if (success) {
                setShowImportConfirm(false);
                setPendingImport(null);
                setImportSummary(null);
                setShowDropdown(false);
                alert('✅ Data imported successfully! Your data has been restored.');
                window.location.reload();
            } else {
                setImportError('Import failed. Please try again.');
            }
        } catch (error) {
            console.error("Import error", error);
            setImportError('Import failed. Please try again.');
        } finally {
            setImportLoading(false);
        }
    };

    const handleCancelImport = () => {
        setShowImportConfirm(false);
        setPendingImport(null);
        setImportSummary(null);
        setImportError(null);
    };

    if (loading) {
        return (
            <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={18} />
            </div>
        );
    }

    if (user) {
        return (
            <>
                {/* Profile Button */}
                <button
                    ref={buttonRef}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${isDark
                        ? 'hover:bg-slate-700'
                        : 'hover:bg-gray-100'
                        }`}
                >
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className={`w-7 h-7 rounded-full border ${isDark ? 'border-slate-600' : 'border-gray-300'}`}
                        />
                    ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <UserIcon size={16} className={isDark ? 'text-slate-300' : 'text-gray-600'} />
                        </div>
                    )}
                    <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                </button>

                {/* Hidden file input for import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelected}
                    style={{ display: 'none' }}
                />

                {/* Dropdown Menu - Using Portal to render at body level */}
                {showDropdown && createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'fixed',
                            top: dropdownPosition.top,
                            right: dropdownPosition.right,
                            zIndex: 99999
                        }}
                        className={`w-64 rounded-xl shadow-xl border py-2 ${isDark
                            ? 'bg-[#1e1f24] border-slate-700'
                            : 'bg-white border-gray-200'
                            }`}
                    >
                        {/* User Info */}
                        <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {user.displayName || 'User'}
                            </p>
                            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                {user.email}
                            </p>
                        </div>

                        {/* Data Management Section */}
                        <div className={`py-1 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                            <p className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Data Management
                            </p>
                            <button
                                onClick={handleExport}
                                disabled={exportLoading}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                    ? 'text-emerald-400 hover:bg-emerald-900/20'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                    } ${exportLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {exportLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : exportDone ? (
                                    <Check size={16} />
                                ) : (
                                    <Download size={16} />
                                )}
                                {exportLoading ? 'Exporting...' : exportDone ? 'Downloaded!' : 'Export Data'}
                            </button>
                            <button
                                onClick={handleImportClick}
                                disabled={importLoading}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                    ? 'text-blue-400 hover:bg-blue-900/20'
                                    : 'text-blue-600 hover:bg-blue-50'
                                    } ${importLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {importLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Upload size={16} />
                                )}
                                {importLoading ? 'Processing...' : 'Import Data'}
                            </button>
                            {importError && (
                                <div className={`mx-3 my-1 px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>{importError}</span>
                                </div>
                            )}
                        </div>

                        {/* Account Section */}
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                    ? 'text-slate-300 hover:bg-slate-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                                    ? 'text-red-400 hover:bg-red-900/20'
                                    : 'text-red-600 hover:bg-red-50'
                                    }`}
                            >
                                <Trash2 size={16} />
                                Delete Account
                            </button>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Import Confirmation Modal */}
                {showImportConfirm && createPortal(
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 100000 }}
                        className="flex items-center justify-center"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleCancelImport}
                        />

                        {/* Modal */}
                        <div className={`relative w-[420px] max-w-[90vw] rounded-2xl shadow-2xl border p-6 ${isDark
                            ? 'bg-[#1e1f24] border-slate-700'
                            : 'bg-white border-gray-200'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                                    <Upload size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Import Data
                                    </h3>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        This will replace your current data
                                    </p>
                                </div>
                            </div>

                            {importSummary && (
                                <div className={`rounded-xl p-4 mb-4 space-y-2 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                                    <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                        Backup from: {new Date(importSummary.exportedAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className={`rounded-lg p-2.5 text-center ${isDark ? 'bg-slate-700/50' : 'bg-white border border-gray-200'}`}>
                                            <p className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {importSummary.resultsCount}
                                            </p>
                                            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Test Results</p>
                                        </div>
                                        <div className={`rounded-lg p-2.5 text-center ${isDark ? 'bg-slate-700/50' : 'bg-white border border-gray-200'}`}>
                                            <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {importSummary.bookmarksCount}
                                            </p>
                                            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Bookmarks</p>
                                        </div>
                                        <div className={`rounded-lg p-2.5 text-center ${isDark ? 'bg-slate-700/50' : 'bg-white border border-gray-200'}`}>
                                            <p className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                                {importSummary.customTestsCount}
                                            </p>
                                            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Custom Tests</p>
                                        </div>
                                        <div className={`rounded-lg p-2.5 text-center ${isDark ? 'bg-slate-700/50' : 'bg-white border border-gray-200'}`}>
                                            <p className={`text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                                {importSummary.customChaptersCount}
                                            </p>
                                            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Chapters</p>
                                        </div>
                                        {importSummary.imagesCount > 0 && (
                                            <div className={`rounded-lg p-2.5 text-center col-span-2 ${isDark ? 'bg-slate-700/50' : 'bg-white border border-gray-200'}`}>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image size={16} className={isDark ? 'text-pink-400' : 'text-pink-600'} />
                                                    <p className={`text-lg font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                                        {importSummary.imagesCount}
                                                    </p>
                                                </div>
                                                <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Saved Images</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className={`rounded-lg px-3 py-2 mb-4 text-xs flex items-start gap-2 ${isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <span>This will <strong>replace</strong> all your current data. Make sure to export your current data first if needed.</span>
                            </div>

                            {importError && (
                                <div className={`rounded-lg px-3 py-2 mb-4 text-xs flex items-start gap-2 ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-600'}`}>
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <span>{importError}</span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelImport}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark
                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    disabled={importLoading}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${importLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                        } bg-blue-600 hover:bg-blue-500 text-white`}
                                >
                                    {importLoading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={14} />
                                            Import & Replace
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm ${isDark
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
        >
            <LogIn size={14} />
            <span>Login</span>
        </button>
    );
}
