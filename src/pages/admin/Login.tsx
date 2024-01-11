import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res.user, res);

            alert("Login success");
        } catch (e) {
            alert("Wrong email or password");
        }
    };

    // feel free to change the jsx
    return (
        <section>
            <h1>Login Form</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </section>
    );
}

export default Login;