const global = {};
global.state = 0;//0.准备中 1.等待中 2.模拟中
global.gravity = 0.1;
global.absorb = 0.8;
global.sPos = { x: 0, y: 0 };
global.speed = 0;
global.radian = 0;
global.needSend = true;
export default global;