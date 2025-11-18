// Theme utility functions for consistent dark mode styling
export const getThemeClasses = (isDark: boolean) => ({
  bg: {
    primary: isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
    card: isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white',
    input: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
    button: {
      primary: isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
      secondary: isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300',
    }
  },
  text: {
    primary: isDark ? 'text-slate-100' : 'text-gray-800',
    secondary: isDark ? 'text-slate-300' : 'text-gray-600',
    muted: isDark ? 'text-slate-400' : 'text-gray-500',
  },
  border: {
    default: isDark ? 'border-slate-700' : 'border-gray-200',
  }
});

