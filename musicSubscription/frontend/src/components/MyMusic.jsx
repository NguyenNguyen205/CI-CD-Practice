import { useEffect, useState } from "react"
import MyMusicRow from "./MyMusicRow"

const MyMusic = ({subscribedSongs, endpoint, removeSong}) => {

    const [myMusicSongs, setMyMusicSongs] = useState([])

    useEffect(() => {
        // get all subscribed songs info
        const getSongs = async () => {
            let songs = []
            for (const song of subscribedSongs){
                let url = `${endpoint}?title=${song}`
                const response = await fetch(url, {
                method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json();

                songs.push(data[0])
            }

            setMyMusicSongs(songs)
        }
        getSongs();
    }, [subscribedSongs])  



    return (
        <div>
            { myMusicSongs.length == 0 ? <p className="result-placeholder">You have no subscribed songs</p>
            :
            myMusicSongs.map((song, index) => {
                return (
                    // <li>{song.title}</li>
                    <MyMusicRow key={index} title={song.title} year={song.year} artist={song.artist} removeSong={removeSong}/>
                )
            })
            }
        </div>
    )
}

export default MyMusic