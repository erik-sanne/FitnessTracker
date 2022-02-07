import React from "react";

const NewsCard = ({ date, title, message }) => {

    return (
        <div className={"post"}>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <p><b>{ title }</b></p>
                <p>{ date }</p>
            </div>

            <div style={{ display: 'flex', justifyContent: "space-between" }}>
            <p>{message}</p>
            </div>
        </div>
    );
}

export default NewsCard;