const location = window.location

if (location.search.startsWith('?/')) {
  const decoded = location.search
    .slice(1)
    .split('&')
    .map((segment) => segment.replace(/~and~/g, '&'))
    .join('?')

  window.history.replaceState(
    null,
    '',
    `${location.pathname.slice(0, -1)}${decoded}${location.hash}`,
  )
}
