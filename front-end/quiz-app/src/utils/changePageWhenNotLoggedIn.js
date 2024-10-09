export function changePageWhenNotLoggedIn(router) {
    fetch('http://localhost:3000/check-login', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            router.push('/login');
        }
    })
    .catch(error => {
        console.error('Error fetching session info:', error);
    });
}
