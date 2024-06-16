import Username from "../components/Username";
import TabsContainer from "../components/TabContainer";
import MusicRow from "../components/MusicRow";
import Search from "../components/Search";
import MyMusic from "../components/MyMusic";
import { useEffect, useState } from "react";

const Main = ({currentUser, endpoint, logoutListener}) => {


    const tabNames = ["My Music", "Search"];


    const url = endpoint;

    const handleSearch = async (e) => {
        e.preventDefault();
        let inputTitle = e.target.parentElement.querySelector("#title").value.trim();
        let inputYear = e.target.parentElement.querySelector("#year").value.trim();
        let inputArtist = e.target.parentElement.querySelector("#artist").value.trim();
        
        if (inputTitle == '' && inputYear == '' && inputArtist == ''){
            // notify user of error
            console.log('no parameters')
            return ;
        }
        let obj = {
            title  : inputTitle,
            year: inputYear,
            artist: inputArtist
        }

        let urlString = `${url}?`;

        for (const [key, value] of Object.entries(obj)){
            if (value != ''){
                urlString += `${key}=${value}&` 
            }
        }


        const response = await fetch(urlString, {
            method: "GET", 
            headers: {
                "Content-Type" : "application/json"
            },
        })

        const data = await response.json();

        const items = data;
        setMusicResult(items)
    };

    const [musicResult, setMusicResult] = useState([])

    const [subscribedSongs, setSubscribedSongs] = useState([])

    const getSubscribed = async () => {
            
        let response = await fetch(`${url}?email=${currentUser[0]}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        console.log("subcribed" + data)
        setSubscribedSongs(data)
    }
    useEffect(()  => {

        getSubscribed()
    }, [])


    const addSubscription = async (title) => {
        const obj = {
            httpMethod: "POST",
            action: "subscribe",
            email: currentUser[0],
            title: title
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        let data = await response.json();
        console.log(data)
        setSubscribedSongs(data)
    }

    useEffect(() => {
        console.log(subscribedSongs)
    }, [subscribedSongs])

    const removeSong = async (title) => {
        // POST request to remove song
        const obj = {
            httpMethod: "POST",
            action: "remove",
            email: currentUser[0],
            title: title
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        let data = await response.json();
        console.log(data)
        console.log('remove ' + data);
        getSubscribed();
    }

    return (
        <div className="main-page">
            <Username username={currentUser[1]} logoutListener={logoutListener}/>
            <TabsContainer names={tabNames} contents={[<MyMusic subscribedSongs={subscribedSongs}endpoint={endpoint} removeSong={removeSong} />,<Search addSubscription={addSubscription} subscribedSongs={subscribedSongs} endpoint={endpoint}/> ]} />

        </div>
    );
};

export default Main;
