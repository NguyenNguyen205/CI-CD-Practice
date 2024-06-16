const MyMusicRow = ({ title, year, artist, removeSong }) => {
    const deleteSong = () => {
        removeSong(title);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function convertToFileName(artist) {
        let words = artist.split(' ')
        for (let i = 0; i < words.length; i ++){
            words[i] = capitalizeFirstLetter(words[i])
        }
        return words.join('')
    }

    return (
        <div className="row">
            <div>
                <img
                    src={`https://s3927198-music-images.s3.amazonaws.com/${convertToFileName(artist)}.jpg`}
                    alt="artist image"
                    height={50}
                />

                <span className="info">
                <span>
                    Artist: {artist} 
                    </span>
                    <span>Title: {title}</span>
                    <span>Year: {year}</span>
                </span>
                <button onClick={deleteSong} className="remove-btn">Remove</button>
            </div>
        </div>
    );
};

export default MyMusicRow;
