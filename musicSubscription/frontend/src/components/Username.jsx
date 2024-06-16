const Username = ({ username, logoutListener }) => {
    const handleLogout = () => {
        logoutListener();
    };

    return (
        <div className="username">
            <p>Welcome back, {username}</p>

            <button onClick={handleLogout} className="logout-btn">Log out</button>
        </div>
    );
};

export default Username;
