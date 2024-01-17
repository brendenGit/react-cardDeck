import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import Card from '../Card/Card';

import './CardDeck.css';

function CardDeck() {
    const [deckId, setDeckId] = useState(null);
    const [cardsDrawn, setCardsDrawn] = useState([]);

    const shuffleBtn = useRef();

    // this is called *after* component first added to DOM
    useEffect(function fetchDeckOnLoad() {
        async function fetchDeck() {
            const deckResult = await axios.get(
                "https://deckofcardsapi.com/api/deck/new/shuffle");
            setDeckId(deckResult.data.deck_id);
        }
        fetchDeck();
    }, [])

    const drawCard = async () => {
        const cardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw`);
        const remaining = cardResult.data.remaining
        if (remaining > 0) {
            const cardImg = cardResult.data.cards[0].image;
            const cardOffset = Math.floor(Math.random() * 31) - 15;
            const card = { cardImg, cardOffset }
            setCardsDrawn(oldCardsDrawn => ([...oldCardsDrawn, card]))
        } else {
            alert('There are no more cards to draw. Reshuffle the deck to continue drawing');
        }
    }

    const shuffleDeck = async () => {
        shuffleBtn.current.disabled = true;
        const shuffle = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        shuffleBtn.current.disabled = false;
        const success = shuffle.data.success
        success ? setCardsDrawn(oldCardsDrawn => ([])) : alert('Failed to shuffle');
    }

    return (
        <div>
            <button onClick={drawCard}>DRAW A CARD</button>
            <button onClick={shuffleDeck} ref={shuffleBtn}>SHUFFLE DECK</button>
            <div className="CardDeck">
                {cardsDrawn.map(card => <Card cardImg={card.cardImg} cardOffset={card.cardOffset} key={uuid()} />)}
            </div>
        </div>
    )
};

export default CardDeck;