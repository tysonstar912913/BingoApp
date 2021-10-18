import React, { Component } from 'react';
import Reward from "react-rewards";
import shuffle from "shuffle-array";
import { css, StyleSheet } from 'aphrodite';
import { ProgressBar, Row, Col } from 'react-bootstrap';
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

let tick_interval = null;

class Bingo extends Component {
    constructor(props) {
        super(props);
        const dimension = 5;
        this.state = {
            dimension: dimension,
            center_id: Math.round(dimension * dimension / 2) - 1,
            checked: {},
            range: [0, 1, 2, 3, 4],
            max_selectable_time: 15,
            data: null,
            won: false,
            randomAnimation: "",
            win_title_visibility: false,
            delay_time: 0,
            selected_card: null,
        }
    }

    init = () => {
        this.setState((prevState) => {
            const checked = { [prevState.center_id]: true };
            let { rand_data, random_array } = this.generate_random_array();
            random_array.splice(this.state.center_id, 1);
            return {
                ...this.state,
                checked,
                data: rand_data,
                selectable_numbers: random_array,
                won: false,
                randomAnimation: "",
                win_title_visibility: false,
                delay_time: 0,
                selected_card: this.get_rand_card(random_array),
            }
        }, () => {
            if (tick_interval !== null) {
                clearInterval(tick_interval);
            }
            this.start_tick();
        })
    }

    componentDidMount() {
        this.init();
    }

    get_rand_card = (selectable_numbers) => {
        let randomNumber = Math.floor(
            Math.random() * (selectable_numbers.length)
        );
        let selected_number = selectable_numbers[randomNumber];
        return selected_number;
    }

    generate_random_array = () => {
        let bbb = [];
        for (let index = 1; index < 100; index++) {
            bbb.push(index);
        }
        let random_array = shuffle(bbb).slice(0, this.state.dimension * this.state.dimension);
        let rand_data = random_array.reduce(
            (data, value, index) => ({ ...data, [index]: value }),
            {}
        );
        return {
            random_array: random_array,
            rand_data: rand_data
        };
    }

    start_tick = () => {
        if (tick_interval !== null) {
            this.setState({
                delay_time: 0,
                selected_card: this.get_rand_card(this.state.selectable_numbers)
            })
            clearInterval(tick_interval);
        }

        tick_interval = setInterval(() => {
            this.setState(prevState => {
                let state = prevState;
                if (state.delay_time >= 100) {
                    state.delay_time = 0;
                    state.selected_card = this.get_rand_card(state.selectable_numbers);
                }
                else {
                    state.delay_time += 100 / state.max_selectable_time;
                }
                return {
                    ...state
                }
            })
        }, 1000)
    }

    handleAnimation = () => {
        if (tick_interval !== null) {
            clearInterval(tick_interval);
        }
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
                this.setState({ randomAnimation: randomAnimation });

            }, 750)
            setTimeout(() => {
                clearInterval(danceInterval);
                this.init();
            }, 5000);
        }
    }

    you_are_winner = () => {
        this.reward.rewardMe();
        this.handleAnimation();
    }

    isWon = (checked) => {
        let range = this.state.range;
        return (
            undefined !==
            range.find(row => range.every(column => checked[row * this.state.dimension + column])) ||
            undefined !==
            range.find(column => range.every(row => checked[row * this.state.dimension + column])) ||
            range.every(index => checked[index * this.state.dimension + index]) ||
            range.every(index => checked[index * this.state.dimension + 4 - index])
        );
    };

    render() {
        let is_free_item = false;
        const { randomAnimation, won, win_title_visibility, data, delay_time, range, selected_card } = this.state;
        const toggle = id => {
            if (parseInt(id) !== this.state.center_id) {
                this.setState(prevState => {
                    let state = prevState;
                    if (state.data[id] === state.selected_card) {
                        const checked = { ...state.checked, [id]: !state.checked[id] };
                        let selectable_numbers = state.selectable_numbers;
                        const remove_index = selectable_numbers.indexOf(state.selected_card);
                        if (remove_index > -1) {
                            selectable_numbers.splice(remove_index, 1);
                        }
                        this.start_tick();
                        const won = this.isWon(checked);
                        if (won) {
                            this.you_are_winner();
                        }
                        return {
                            ...state,
                            checked,
                            won,
                            selectable_numbers: selectable_numbers,
                        }
                    }
                })
            }
        }
        return (
            <div className="App">
                <Row>
                    <Col md="12">
                        <h1 className="app_title">Bingo Game</h1>
                    </Col>
                </Row>
                <Row className="rand_card">
                    <Col>
                        <h3>Here is the card : {selected_card}</h3>
                    </Col>
                </Row>
                <Row className="progress_bar">
                    <Col md="12" className="padding-0">
                        <ProgressBar striped animated now={delay_time} variant="success" />
                    </Col>
                </Row>
                <h1 className={`
                    win_title 
                    ${!win_title_visibility ? 'display-hide' : 'display-show'} 
                    ${css(won && randomAnimation && styles[randomAnimation])}
                    `}>You are winner!</h1>
                <div className="wrapper">
                    {data === null ? '' : Object.keys(data).map(id => {
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