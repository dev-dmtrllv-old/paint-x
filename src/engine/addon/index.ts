import { resolve } from "path";

const CPPEngine = window.require(resolve(process.cwd(), "build/Release/cppengine.node"));

export default CPPEngine;
