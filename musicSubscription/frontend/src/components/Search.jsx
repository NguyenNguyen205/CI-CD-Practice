import MusicRow from "./MusicRow";
import { useState } from "react";

const Search = ({addSubscription, subscribedSongs, endpoint}) => {
    const [musicResult, setMusicResult] = useState([])
    const url = endpoint


    const handleSearch = async (e) => {
        e.preventDefault();
        let inputTitle = e.target.parentElement.querySelector("#title").value.trim();
        let inputYear = e.target.parentElement.querySelector("#year").value.trim();
        let inputArtist = e.target.parentElement.querySelector("#artist").value.trim();
        
        if (inputTitle == '' && inputYear == '' && inputArtist == ''){
            // notify user of error
            setAlert(true);
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
        if (items.length == 0){
            setAlert(true);
        }
        setMusicResult(items)
    };

    const [alert, setAlert] = useState(false);

    return (
        <div className="search">
            <form action="">
                <input type="text" placeholder="Title" id="title" />
                <input type="text" placeholder="Year" id="year" />
                <input type="text" placeholder="Artist" id="artist" />

                <button onClick={handleSearch} type="">
                    Query
                </button>
            </form>

            <div>
                {musicResult.length > 0 ? (
                    musicResult.map((item, index) => {
                        return (
                            <MusicRow
                                key={index}
                                artist={item.artist}
                                title={item.title}
                                year={item.year}
                                addSubscription={addSubscription}
                                subscribed={subscribedSongs.includes(item.title)}
                            />
                        );
                    })
                ) : (
                    
                        alert ?
                        <p className="alert">No result is retrieved. Please query again</p>
                    :
                    <p className="result-placeholder">Search music here</p>
                )}
            </div>
        </div>
    );
};

export default Search;
