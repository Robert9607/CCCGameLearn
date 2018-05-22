const CMD = {
	S_to_C: {
		sign: 1001,
		newClientJoin: 1002,
		updataOthers: 1003,
		startMove: 1004,
		touchMove: 1005,
	},
	C_to_S: {
		position: 1001,
		startGame: 1002,
		heart: 1003,
		touch: 1004,
	}
};
export default CMD;