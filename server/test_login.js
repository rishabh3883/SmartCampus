async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'admin@college.edu', password: 'password123' })
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Body:", text);
    } catch (err) {
        console.error(err);
    }
}
testLogin();
