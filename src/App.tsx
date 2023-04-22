import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from 'react-chessboard';
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

function App() {
  const [game, setGame] = useState(new Chess());
  const [gameComment, setGameComment] = useState("");
  const [moveFrom, setMoveFrom] = useState("");
  const [squareOptions, setSquareOptions] = useState({});
  const [rightClickedSquares, setRightClickedSquares]: any = useState();
  const [hintSquares, setHintSquares] = useState({});

  const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
  const customPieces = () => {
    const returnPieces: any = {};
    pieces.map((p) => {
      returnPieces[p] = ({ squareWidth }: any) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/pieces/${p}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
      return null;
    });
    return returnPieces;
  };

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
    setRightClickedSquares({});
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

  const onSquareRightClick = (square: Square) => {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  const onPieceDrag = (piece: Piece, square: Square) => {
    const hasOptions = getMoveOptions(square);
    if(hasOptions) setMoveFrom(square);
  }

  const onPieceDragEnd = (source: Square, target: Square, piece: Piece) => {
    setRightClickedSquares({});
    setMoveFrom("");
    try {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());
      gameCopy.move({from: source, to: target});
      setGame(gameCopy);
      setMoveFrom("");
      setSquareOptions({});
      return true;
    } catch (e: any) {
      return false;
    }
  }

  return (
    <div id="page">
      <Chessboard 
        boardWidth={720} 
        position={game.fen()}
        arePiecesDraggable={true}
        onPieceDragBegin={onPieceDrag}
        onPieceDrop={onPieceDragEnd}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779952" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        customPieces={customPieces()}
        customSquareStyles={{
          //...moveSquares,
          ...squareOptions,
          ...rightClickedSquares,
          ...hintSquares,
        }}
      />
      <h1>Comment: {gameComment}</h1>
      <h3>FEN: {game.fen()}</h3>
    </div>
  )
}

export default App;