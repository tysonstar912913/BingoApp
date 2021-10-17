import React, { Component } from 'react';
import Reward from "react-rewards";
import shuffle from "shuffle-array";
import './App.css';

const config = {
    emoji: ['🎈', '🎊', '🎉', '🎁', '⭐', '🦃'],
    elementCount: 5,
    spread: 150,
    zIndex: 9999,
    lifetime: 300
};

function Tile({ id, children, onToggle, isSet }) {
    return (
        <div onClick={onToggle} className={`tile ${isSet ? "tile--set" : ""}`}>
            <div className="content">{children}</div>
        </div>
    );
}

class Bingo extends Component {
    constructor(props) {
        super(props);
        const dimension = 5;
        this.state = {
            app_title: "BINGO",
            dimension: dimension,
            center_id: Math.round(dimension * dimension / 2) - 1,
            data: null,
            won: false,
        }
        this.state.checked = { ...this.state.checked, [this.state.center_id]: true };

        const bbb = [];
        for (let index = 1; index < 100; index++) {
            bbb.push(index);
        }
        const random_array = shuffle(bbb).slice(0, this.state.dimension * this.state.dimension);
        const rand_data = random_array.reduce(
            (data, value, index) => ({ ...data, [index]: value }),
            {}
        );
        this.state = { ...this.state, data: rand_data };
    }

    componentDidMount() {
        // this.reward.rewardMe()
    }

    render() {
        const isWon = (checked) => {
            const range = [0, 1, 2, 3, 4];
            return (
                undefined !==
                range.find(row => range.every(column => checked[row * this.state.dimension + column])) ||
                undefined !==
                range.find(column => range.every(row => checked[row * this.state.dimension + column])) ||
                range.every(index => checked[index * this.state.dimension + index]) ||
                range.every(index => checked[index * this.state.dimension + 4 - index])
            );
        };

        const toggle = id => {
            if (parseInt(id) !== this.state.center_id) {
                this.setState(state => {
                    const checked = { ...this.state.checked, [id]: !this.state.checked[id] };
                    const won = isWon(checked);
                    console.log(won)
                    if (won) {
                        this.reward.rewardMe()
                    }
                    return {
                        ...state,
                        checked,
                        won
                    }
                })
            }
        }

        // console.log(this.state)

        let map = Array.prototype.map;
        let is_free_item = false;
        return (
            <div className="App">
                <h1 className="app_title">Bingo App</h1>
                <div className="wrapper">
                    {map.call(this.state.app_title, function (x) {
                        return (
                            <Tile key={x}>
                                {x}
                            </Tile>
                        );
                    })}
                    {Object.keys(this.state.data).map(id => {
                        if (this.state.center_id !== parseInt(id)) {
                            is_free_item = false;
                        }
                        else {
                            is_free_item = true;
                        }
                        return (
                            <Tile
                                key={id}
                                id={id}
                                isSet={is_free_item ? true : !!this.state.checked[id]}
                                onToggle={() => toggle(id)}
                            >
                                {is_free_item ? 'Free' : this.state.data[id]}
                            </Tile>
                        );
                    })}
                </div>
                <Reward
                    ref={ref => this.reward = ref}
                    type="emoji"
                    config={config}
                >
                    <h5 className="copyright_title">Andrew Kim @ 10/21/2021</h5>
                </Reward>
            </div>
        );
    }
}

export default Bingo;