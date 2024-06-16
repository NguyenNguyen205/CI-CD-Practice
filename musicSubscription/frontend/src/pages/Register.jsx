import { useState } from "react";

const Register = ({switchToLogin, endpoint}) => {

    const handleRegister = async (e) => {
        e.preventDefault();
        let inputEmail = e.target.parentElement.querySelector('#email').value.trim();
        let inputUsername = e.target.parentElement.querySelector('#username').value.trim();
        let inputPassword = e.target.parentElement.querySelector('#password').value.trim();

        let obj = {
            httpMethod: "POST",
            action: "register",
            email: inputEmail,
            username: inputUsername,
            password: inputPassword
        }
        const url = endpoint;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        const data = await response.json();
        if (data == 'success'){
            switchToLogin()
            // Redirect to login page
        }else{
            // Notify the user of the duplicated email
            setAlert(true)
        }

        console.log(data)
    }

    const [alert, setAlert] = useState(false);

    return (
        <div className="login-register">
            <form action="" >
                <input type="text" placeholder="Email" id="email" />
                <input type="text" placeholder="Username" id="username"  />
                <input type="password" placeholder="Password" id="password" />

                <button onClick={handleRegister}>Register</button>
            </form>
            {
                alert ?

                <p style={{color: "red"}}>The email already exists</p>
                :
                null
            }
        </div>
    )
}

export default Register