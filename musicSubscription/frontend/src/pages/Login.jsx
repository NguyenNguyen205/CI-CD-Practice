import { useState } from "react";

const Login = ({loginTrigger, endpoint}) => {

    const url = endpoint;
    const handleLogin = async (e) => {
        e.preventDefault();
        let inputEmail = e.target.parentElement.querySelector('#email').value;
        let inputPassword = e.target.parentElement.querySelector('#password').value;

        const loginObj = {
            httpMethod: "POST",
            action: "login",
            email: inputEmail,
            password: inputPassword
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify(loginObj)
            });

        const data = await response.json();
        console.log(data)

        if (data !== 'failed'){
            loginTrigger(data)
        }else {
            setAlert(true)
        }

    }

    const [alert, setAlert] = useState(false)

    return (
        <div className="login-register">
            <form action="">
                <input type="text" placeholder="Email" id="email"/>
                <input type="password" placeholder="Password" id="password"  />
                <button onClick={handleLogin}>Log in</button>
            </form>
            {
                alert ? 
                <p className="alert">Invalid email or password</p>
                : null
            }
        </div>
    );
};

export default Login;
