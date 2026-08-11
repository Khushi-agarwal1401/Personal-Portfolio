/* Apply saved/system theme before first paint (avoids flash of wrong theme).
   Loaded synchronously in <head> on every page. */
(function () {
    var theme = 'light';
    try { theme = localStorage.getItem('theme') || theme; } catch (e) { /* private mode etc. */ }
    if (theme !== 'dark' && theme !== 'light') {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#16161a' : '#a78bfa');
})();
