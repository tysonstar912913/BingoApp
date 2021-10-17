import { useState, useEffect } from "react";
import Reward from "react-rewards";
import shuffle from "shuffle-array";
// import logo from './logo.svg';
import './App.css';

import { start } from "./Confetti";
// import { start } from "./reward";

const config = {
    emoji: ['🎈', '🎊', '🎉', '🎁', '⭐', '🦃'],
    elementCount: 15,
    spread: 150,
    zIndex: 9999,
    lifetime: 300
};

function Confetti() {
    useEffect(() => {
        start();
    });
    return <canvas id="canvas" />;
}

function Tile({ id, children, onToggle, isSet }) {
    return (
        <div onClick={onToggle} className={`tile ${isSet ? "tile--set" : ""}`}>
            <div className="content">{children}</div>
        </div>
    );
}

const dimension = 5;
const center_id = Math.round(dimension * dimension / 2) - 1;
const bbb = [];
for (let index = 1; index < 100; index++) {
    bbb.push(index);
}
const random_array = shuffle(bbb).slice(0, dimension * dimension);
const data = random_array.reduce(
    (data, value, index) => ({ ...data, [index]: value }),
    {}
);

function App() {
    const [state, setState] = useState({ checked: {} });
    state.checked[center_id] = true;
    const isWon = checked => {
        const range = [0, 1, 2, 3, 4];
        return (
            undefined !==
            range.find(row => range.every(column => checked[row * dimension + column])) ||
            undefined !==
            range.find(column => range.every(row => checked[row * dimension + column])) ||
            range.every(index => checked[index * dimension + index]) ||
            range.every(index => checked[index * dimension + 4 - index])
        );
    };

    const toggle = id => {
        if (parseInt(id) !== center_id) {
            setState(state => {
                if (center_id !== id) {
                    const checked = { ...state.checked, [id]: !state.checked[id] };
                    const won = isWon(checked);
                    return {
                        ...state,
                        checked,
                        won
                    };
                }
            });
        }
    }

    const title = "BINGO";
    let map = Array.prototype.map;
    let is_free_item = false;
    return (
        <div className="App">
            <h1 className="app_title">Bingo App</h1>
            <div className="wrapper">
                {map.call(title, function (x) {
                    return (
                        <Tile key={x}>
                            {x}
                        </Tile>
                    );
                })}
                {Object.keys(data).map(id => {
                    console.log(center_id, id, center_id !== id)
                    if (center_id !== parseInt(id)) {
                        is_free_item = false;
                    }
                    else {
                        is_free_item = true;
                    }
                    return (
                        <Tile
                            key={id}
                            id={id}
                            isSet={is_free_item ? true : !!state.checked[id]}
                            onToggle={() => toggle(id)}
                        >
                            {is_free_item ? 'Free' : data[id]}
                        </Tile>
                    );
                })}
            </div>
            <h5 className="copyright_title">Andrew Kim @ 2021.10.21</h5>
            {state.won ? <Confetti /> : null}
        </div>
    );
}

export default App;
