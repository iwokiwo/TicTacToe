import React, { Component } from 'react'
import _ from 'lodash'

class Board extends Component {
    constructor(props) {
        super(props)

        this.state = {
            winner: null,
            player: null,
            winnerIndex: null,
            aiPlayer: "X",
            huPlayer: "O",
            board: Array(9).fill(null),
            mapIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            winLines: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ]
        }

        this.checkWinner = this.checkWinner.bind(this)
        this.huPlayerIndexies = this.huPlayerIndexies.bind(this)

    }

    checkWinner() {

        for (let index = 0; index < this.state.winLines.length; index++) {
            const [a, b, c] = this.state.winLines[index]

            if (
                this.state.board[a] === this.state.huPlayer &&
                this.state.board[b] === this.state.huPlayer &&
                this.state.board[c] === this.state.huPlayer
            ) {
                this.setState({
                    winner: this.state.huPlayer,
                    winnerIndex: [a, b, c]
                })
            } else if (
                this.state.board[a] === this.state.aiPlayer &&
                this.state.board[b] === this.state.aiPlayer &&
                this.state.board[c] === this.state.aiPlayer
            ) {
                this.setState({
                    winner: this.state.aiPlayer,
                    winnerIndex: [a, b, c]
                })
            }
        }
    }

    aiAction() {
        const availSpot = this.emptyIndexies()
        const checkWinlines = this.state.winLines
        const opponentIndexes = this.huPlayerIndexies()
        let res = []
        let coverIndex = null
        checkWinlines.map((value, key) => {
            //intersept adalah cek perbandingan contoh intersept([0,1,2],[0,1]) hasilnya akan [0,1]
            let intersept = _.intersection(value, opponentIndexes)
            console.log("intersept",intersept)
            console.log("interseptvalue",value)
            console.log("opponentIndexes",opponentIndexes)
            if (intersept.length == 2) { //cari hasil intersept yang lebih dari 2 array
                //cek perbandingan contoh diffrence([0,1,2], [0,1]) hasilnya akan [2]
                let j = _.difference(value, intersept)

                if (this.state.board[j[0]] === null) {
                    coverIndex = j[0]
                }

                console.log("difference",j)

            }
        })

        if (coverIndex) {
            ///jika user mau menang
            console.log("coverIndex",coverIndex)
            return coverIndex
        }
     
        checkWinlines.map((value, key) => {
            let d = _.intersection(value, availSpot)

            if (d && !_.isEmpty(_.difference(value, d))) {
                //masukan data papan array yang belum terpakai
                res.push(d)
            }
        })
        //pecah ke array tunggal
        let mostSpot = _.flattenDeep(res)
        // copy dan duplikat array yang sudah dijadikan  tunggal
        let uniq = _.uniq(mostSpot)

        let availtoSpot = uniq

        let rand = availtoSpot[Math.floor(Math.random() * availtoSpot.length)]
        console.log("rand",rand)
       
        console.log("checkWinlines",checkWinlines)
   
        console.log("res",res)
        console.log("mostSpot",mostSpot)
        console.log("uniq",uniq)
        console.log("availSpot",availSpot)
        //random posisi
        return rand

        
    }

    handleClick = index => {
        if (this.state.winner !== null) {
            return
        }

        let newboard = this.state.board;

        if (newboard[index] !== null) {
            return
        }

        newboard[index] = this.state.huPlayer
        this.setState({
            board: newboard,
            player: this.state.huPlayer
        })

        setTimeout(() => {
            this.checkWinner()

            if (this.state.winner === null) {
                let freshboard = this.state.board;
                let aiIndex = this.aiAction();
                console.log("aiIndex",aiIndex)
                console.log("freshboard",freshboard)
                freshboard[aiIndex] = this.state.aiPlayer
                this.setState({
                    board: freshboard,
                    player: this.state.aiPlayer
                })

                setTimeout(() => {
                    this.checkWinner()
                }, 800)
            }

        }, 800);

    }

    emptyIndexies = () => {

        let fills = []
        let iterator = _.filter(this.state.board, function (value, key) {
            if (value === null) {
                fills.push(key)
            }
        })

        return fills;
    }

    huPlayerIndexies = () => {

        let fills = []
        let iterator = _.filter(this.state.board, function (value, key) {
            if (value === 'O') {
                fills.push(key)
            }
        })

        return fills;
    }

    reset(e) {
        this.setState({
            winner: null,
            player: null,
            board: Array(9).fill(null),
            winnerIndex: null
        })
    }

    render() {
        const markColor = this.state.winner === this.state.huPlayer ? "#badc58" : "#ff7979"
        const Box = this.state.board.map((box, index) =>
            <div
                key={index}
                onClick={() => this.handleClick(index)}
             
                className="col box">
                {box}
            </div>
        )
        return (
            <div className="board" style={{
                width: "400px",
                margin: "10px auto"
            }}>
                {this.state.winner === this.state.huPlayer && <div style={{
                    color: markColor
                }}>
                    <h2>You Win!</h2>
                </div>}

                {this.state.winner === this.state.aiPlayer && <div style={{
                    color: markColor
                }}>
                    <h2>You Lose!</h2>
                </div>}

                {(this.state.winner === null && _.isEmpty(this.emptyIndexies())) && <div style={{
                    color: "#3d9edf"
                }}>
                    <h2>Draw!</h2>
                </div>}

                <div className="board-wrapper">
                    {Box}
                </div>

                <button className="btn" type="button" onClick={(e) => this.reset(e)}>
                    {this.state.winner || _.isEmpty(this.emptyIndexies()) ? 'New Game' : 'Reset'}
                </button>

            </div>
        )
    }
}

export default Board;
