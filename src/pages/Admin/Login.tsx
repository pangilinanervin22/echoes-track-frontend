import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import loginStyle from './LoginStyle.module.scss'
import cvsulogo from '../../assets/images/cvsuLOGO.png'
import personIcon from '../../assets/images/Vector.png'
import lockIcon from '../../assets/images/person_FILL0_wght400_GRAD0_opsz24 1.png'


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    console.log(auth, auth.currentUser);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log(res.user, res);

            alert("Login success");

        } catch (e) {
            console.log(e);
            alert("Wrong email or password");
        }
    };

    // feel free to change the jsx
    return (
        <main className={loginStyle.mainContainer}>
            <section className={loginStyle.section}>
                <img src={cvsulogo} alt="" className={loginStyle.logo} />
                <h1>Echoes Tracker</h1>
                <h1 className={loginStyle.h1margin}>Admin</h1>
                <form onSubmit={handleSubmit}>

                    <div className={loginStyle.person}>

                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <div className={loginStyle.inputLogo}>
                            <img src={personIcon} alt="" />
                        </div>

                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        <div className={loginStyle.newinputLogo}>
                            <img src={lockIcon} alt="" className={loginStyle.lockIcon} />
                        </div>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </section>
        </main>
    );
}

export default Login;