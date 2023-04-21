import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from 'react-chessboard';
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

function App() {
  const [game, setGame] = useState(new Chess());
  const [gameComment, setGameComment] = useState("");
  const [moveFrom, setMoveFrom] = useState("");
  const [squareOptions, setSquareOptions] = useState({});

  const makeMove = (from: Square, to: Square, promotion: string = "q") => {
    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());
      gameCopy.move({from, to});
      setGame(gameCopy);
      return true;
    } catch (e: any) {
      return false;
    }
  }

  const onDrop = (from: Square, to: Square, piece: Piece) => {
    const moveResult = makeMove(from, to, "q");
    if(moveResult) {
      setGameComment(game.getComment());
      return true;
    } else {
      return false;
    }
  }

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({square, verbose: true});
    if(moves.length === 0) {
      return false;
    }

    const newSquares: any = {};
    moves.map((move: any) => {
      newSquares[move.to] = {
        background: game.get(move.to) && game.get(move.to).color !== game.get(square).color
        ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
        : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });

    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    }
    setSquareOptions(newSquares);
    return true;
  }

  const onSquareClick = (square: Square) => {
    function resetFirstMove(square: Square) {
      const hasOptions = getMoveOptions(square);
      if(hasOptions) setMoveFrom(square);
    }

    if(!moveFrom) {
      resetFirstMove(square);
      return;
    }

    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());
      gameCopy.move({from: moveFrom, to: square});
      setGame(gameCopy);
      setMoveFrom("");
      setSquareOptions({});
      return true;
    } catch (e: any) {
      resetFirstMove(square);
      return;
    }

  }

  return (
    <div id="page">
      <Chessboard 
        boardWidth={560} 
        position={game.fen()}
        arePiecesDraggable={false}
        onSquareClick={onSquareClick}
        //onSquareRightClick={onSquareRightClick}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          //...moveSquares,
          ...squareOptions,
          //...rightClickedSquares,
        }}
      />
      <h1>{gameComment}</h1>
    </div>
  )
}

export default App;