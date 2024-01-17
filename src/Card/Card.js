import React from "react";
import './Card.css';

function Card({ cardImg, cardOffset }) {
    const styles = {
        transform: `rotate(${cardOffset}deg)`
    };
    return (
        <img className="Card" src={cardImg} style={styles}/>
    )
};

export default Card;