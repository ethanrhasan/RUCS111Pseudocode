import * as fs from "fs";
import { Lexer } from "./src/Lexer";

console.log(new Lexer(String(fs.readFileSync("./examples/example2.rucs", "utf8"))).tokenize());
