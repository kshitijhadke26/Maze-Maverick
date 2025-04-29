import React, { useEffect, useState } from "react";
import { FaPlay, FaFlag } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { GiMazeSaw } from "react-icons/gi";
import { ReactTyped } from "react-typed";

const Grid = () => {
	const [grid, configureGrid] = useState({ row: 0, column: 0 });
	const [gridTemp, configureGridTemp] = useState({ row: 0, column: 0 });
	const [map, setMap] = useState([]);
	const [minPath, setMinPath] = useState([]);
	const [hardness, setHardness] = useState(0.3);

	useEffect(() => {
		if (
			gridTemp.row > 0 &&
			gridTemp.column > 0 &&
			!isNaN(gridTemp.row) &&
			!isNaN(gridTemp.column)
		) {
			const newMap = [];
			for (let i = 0; i < gridTemp.row; i++) {
				newMap.push(new Array(gridTemp.column).fill(0));
			}
			newMap[0][0] = -1;
			newMap[gridTemp.row - 1][gridTemp.column - 1] = -2;
			setMap(newMap);
			configureGrid(gridTemp);
		}
	}, [gridTemp]);

	const changeHandler = (e) => {
		const { id, value } = e.target;
		const parsedValue = Math.max(0, parseInt(value, 10));
		configureGridTemp((prev) => ({ ...prev, [id]: parsedValue }));
	};

	const gridHandler = (i, j) => {
		if (
			(i === 0 && j === 0) ||
			(i === grid.row - 1 && j === grid.column - 1)
		)
			return;
		if (minPath.length) setMinPath([]);
		const updatedMap = [...map];
		updatedMap[i][j] = updatedMap[i][j] === 0 ? 1 : 0;
		setMap(updatedMap);
	};

	const resetGrid = () => {
		setMap([]);
		setMinPath([]);
		configureGrid({ row: 0, column: 0 });
	};

	const generateGrid = () => {
		if (!map.length) return null;
		return map.map((row, i) => (
			<div key={i} className="flex justify-center">
				{row.map((cell, j) => {
					let content = null;
					if (cell === -1) content = <FaPlay size={18} />;
					else if (cell === -2) content = <FaFlag size={18} />;
					let className =
						"w-8 sm:w-10 aspect-square text-center flex justify-center items-center border border-slate-700 cursor-pointer transition-all";
					if (minPath.some(([x, y]) => x === i && y === j))
						className += " bg-green-500";
					else if (cell === 1) className += " bg-red-600";
					else className += " bg-slate-800 hover:bg-slate-700";
					return (
						<div
							key={`${i}-${j}`}
							className={className}
							onClick={() => gridHandler(i, j)}>
							{content}
						</div>
					);
				})}
			</div>
		));
	};

	const findPath = () => {
		const matrix = [...map];
		const size = grid.row;
		const dx = [1, 0, 0, -1];
		const dy = [0, 1, -1, 0];
		const ans = [];

		const isValid = (x, y) =>
			x >= 0 &&
			x < size &&
			y >= 0 &&
			y < grid.column &&
			matrix[x][y] !== 1;

		const bfs = () => {
			const q = [];
			const visited = Array.from({ length: size }, () =>
				Array(grid.column).fill(false)
			);
			const parent = Array.from({ length: size }, () =>
				Array(grid.column).fill([-1, -1])
			);

			q.push([0, 0]);
			visited[0][0] = true;

			while (q.length) {
				const [x, y] = q.shift();
				if (x === size - 1 && y === grid.column - 1) break;

				for (let i = 0; i < 4; i++) {
					const nx = x + dx[i];
					const ny = y + dy[i];
					if (isValid(nx, ny) && !visited[nx][ny]) {
						q.push([nx, ny]);
						visited[nx][ny] = true;
						parent[nx][ny] = [x, y];
					}
				}
			}

			if (!visited[size - 1][grid.column - 1]) return false;

			let x = size - 1;
			let y = grid.column - 1;
			while (x !== -1 && y !== -1) {
				ans.push([x, y]);
				[x, y] = parent[x][y];
			}
			ans.reverse();
			return true;
		};

		if (!bfs()) {
			toast.error("No path exists!");
			return;
		}
		setMinPath(ans);
	};

	const generateRandomBlockages = () => {
		const newMap = Array.from({ length: grid.row }, (_, i) =>
			Array.from({ length: grid.column }, (_, j) => {
				if (
					(i === 0 && j === 0) ||
					(i === grid.row - 1 && j === grid.column - 1)
				)
					return 0;
				return Math.random() < hardness ? 1 : 0;
			})
		);
		newMap[0][0] = -1;
		newMap[grid.row - 1][grid.column - 1] = -2;
		setMap(newMap);
		setMinPath([]);
	};

	return (
		<div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center py-6 px-2 sm:px-6">
			<Toaster />
			<div className="flex items-center gap-4 mb-4">
				<GiMazeSaw className="text-5xl animate-spin-slow" />
				<h1 className="text-4xl font-bold">Maze Maverick</h1>
			</div>
			<ReactTyped
				className="text-xl text-gray-400 mb-6"
				strings={["Grid Builder", "Path Finder", "Maze Navigator"]}
				typeSpeed={100}
				backSpeed={30}
				loop
			/>
			<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap justify-center items-center">
				{/* Row Input */}
				<div className="flex flex-col gap-1">
					<label className="text-lg font-semibold text-gray-300">
						Row
					</label>
					<input
						type="number"
						id="row"
						value={gridTemp.row}
						onChange={changeHandler}
						className="w-28 px-3 py-2 rounded-lg bg-slate-800 text-white text-center font-bold border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-300"
					/>
				</div>

				{/* Column Input */}
				<div className="flex flex-col gap-1">
					<label className="text-lg font-semibold text-gray-300">
						Column
					</label>
					<input
						type="number"
						id="column"
						value={gridTemp.column}
						onChange={changeHandler}
						className="w-28 px-3 py-2 rounded-lg bg-slate-800 text-white text-center font-bold border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-300"
					/>
				</div>

				{/* Hardness and Generate Button */}
				<div className="px-4 py-3 flex flex-col items-center gap-3 border-4 border-dashed rounded-xl bg-slate-900 my-4 shadow-md">
					<div className="flex flex-col sm:flex-row gap-3 items-center w-full">
						<span className="text-xl font-bold text-gray-300">
							Difficulty
						</span>
						<input
							type="range"
							min="0.1"
							max="0.5"
							step="0.05"
							className="w-72 accent-green-500"
							onChange={(e) => {
								setHardness(parseFloat(e.target.value));
							}}
						/>
					</div>
					<button
						className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-green-600 to-green-700 text-white shadow hover:scale-105 hover:from-green-700 hover:to-green-800 transition-all duration-300"
						onClick={() => generateRandomBlockages(hardness)}>
						Generate Random Blocks
					</button>
				</div>

				{/* Control Buttons */}
				<div className="flex flex-col gap-4">
					<button
						className="bg-gradient-to-r from-blue-500 to-blue-600 font-bold text-white px-6 py-2 rounded-lg shadow hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
						onClick={findPath}>
						Find Path
					</button>
					<button
						className="bg-gradient-to-r from-red-500 to-red-600 font-bold text-white px-6 py-2 rounded-lg shadow hover:scale-105 hover:from-red-600 hover:to-red-700 transition-all duration-300"
						onClick={resetGrid}>
						Reset
					</button>
				</div>
			</div>
			<div className="bg-slate-900 px-4 py-4 rounded-lg shadow-inner mb-4 w-full max-w-5xl overflow-auto">
				{generateGrid()}
			</div>
			<footer className="text-gray-400 text-sm mt-4">
				Made with ❤️ by{"  "}
				<a href="https://github.com/kshitijhadke26">
					<span className="text-white font-semibold">
						Kshitij Hadke
					</span>
				</a>
			</footer>
		</div>
	);
};

export default Grid;
