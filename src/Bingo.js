import React, { Component } from 'react';
import Reward from "react-rewards";
import shuffle from "shuffle-array";
import { css, StyleSheet } from 'aphrodite';
import {
    tada, headShake, bounce, swing, jello, flip, rollIn, rollOut,
    shake, rotateIn, bounceOutLeft, hinge, rotateOut,
} from 'react-animations';
import './App.css';

const styles = StyleSheet.create({
    tada: {
        animationName: tada,
        animationDuration: '1s',
    },
    headShake: {
        animationName: headShake,
        animationDuration: '1s',
    },
    bounce: {
        animationName: bounce,
        animationDuration: '.75s',
    },
    flip: {
        animationName: flip,
        animationDuration: '1s',
    },
    swing: {
        animationName: swing,
        animationDuration: '.75s',
    },
    jello: {
        animationName: jello,
        animationDuration: '.75s',
    },
    shake: {
        animationName: shake,
        animationDuration: '.75s',
    },
    rotateIn: {
        animationName: rotateIn,
        animationDuration: '.75s',
    },
    rotateOut: {
        animationName: rotateOut,
        animationDuration: '.75s',
    },
    rollIn: {
        animationName: rollIn,
        animationDuration: '.75s',
    },
    rollOut: {
        animationName: rollOut,
        animationDuration: '.75s',
    },
    bounceOutLeft: {
        animationName: bounceOutLeft,
        animationDuration: '.2s',
    },
    hinge: {
        animationName: hinge,
        animationDuration: '1s',
    },
})

const config = {
    emoji: ['🎈', '🎊', '🎉', '🎁', '⭐', '🦃'],
    elementCount: 10,
    zIndex: 9999,
    lifetime: 300,
    angle: 90,
    spread: 40,
    springAnimation: false
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
            randomAnimation: "",
            win_title_visibility: false,
            checked: {}
        }
        this.state.checked = { ...this.state.checked, [this.state.center_id]: true };
        this.state = { ...this.state, data: this.generate_random_array() };
    }

    generate_random_array = () => {
        const bbb = [];
        for (let index = 1; index < 100; index++) {
            bbb.push(index);
        }
        const random_array = shuffle(bbb).slice(0, this.state.dimension * this.state.dimension);
        const rand_data = random_array.reduce(
            (data, value, index) => ({ ...data, [index]: value }),
            {}
        );
        return rand_data;
    }

    restart_game = () => {
        this.setState(state => {
            const checked = { [state.center_id]: true }
            return {
                ...state,
                checked: checked,
                data: this.generate_random_array(),
                win_title_visibility: false
            }
        })
    }

    handleAnimation = () => {
        if (!this.state.randomAnimation) {
            const animations = [
                "wobble", "tada", "headShake",
                "bounce", "rotateOut",
                "swing", "jello",
                "rotateIn", "flip"
            ];
            this.setState((prevState) => {
                return {
                    ...prevState,
                    randomAnimation: "rollIn",
                    win_title_visibility: true
                }
            })
            let danceInterval = setInterval(() => {
                const randomNumber = Math.floor(
                    Math.random() * (animations.length)
                );
                const randomAnimation = animations[randomNumber];
                this.setState(prevState => ({
                    randomAnimation: randomAnimation,
                }))
            }, 750)
            setTimeout(() => {
                clearInterval(danceInterval);
                this.setState({
                    randomAnimation: "",
                })
                this.restart_game();
            }, 5000);
        }
    }

    you_are_winner = () => {
        this.reward.rewardMe();
        this.handleAnimation();
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
                    if (won) {
                        this.you_are_winner();
                    }
                    return {
                        ...state,
                        checked,
                        won
                    }
                })
            }
        }
        let map = Array.prototype.map;
        let is_free_item = false;
        const { randomAnimation, won, win_title_visibility } = this.state;
        return (
            <div className="App">
                <h1 className="app_title">Bingo App</h1>
                <h1 className={`
                    win_title 
                    ${!win_title_visibility ? 'display-hide' : 'display-show'} 
                    ${css(won && randomAnimation && styles[randomAnimation])}
                    `}>You are winner!</h1>
                <div className="wrapper">
                    {map.call(this.state.app_title, function (x) {
                        return (
                            <Tile key={x}>
                                {x}
                            </Tile>
                        );
                    })}
                    {this.state.data === null ? '' : Object.keys(this.state.data).map(id => {
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