module.exports = {
  //   "./client/**/*.{js,jsx,ts,tsx}": (fileName) => [`yarn run client:lint ${fileName.join(" ")}`, "tsc -p ./client/tsconfig.json --noEmit"],
  "./server/**/*.ts": (fileName) => [`yarn run server:lint ${fileName.join(" ")}`, "tsc -p ./server/tsconfig.json --noEmit"],
};
