import { Token, TokenType } from "../types/types";

import { keywords } from "../constants/keywords";

export class Lexer {
    private source: string;

    private cursor: number = 0;
    private line: number = 1;
    private column: number = 1;

    public constructor(source: string) {
        this.source = source;
    }

    private atEOF(): boolean {
        return this.cursor >= this.source.length;
    }

    private peek(): string {
        return this.atEOF() ? "\0" : this.source[this.cursor];
    }

    private peekNext(): string {
        return this.cursor + 1 >= this.source.length ? "\0" : this.source[this.cursor + 1];
    }

    private advance(): string {
        this.column++;
        return this.source[this.cursor++];
    }

    private createToken(tokenType: TokenType, value: string): Token {
        return {
            type: tokenType,
            value: value,
            line: this.line,
            column: this.column - value.length,
        } satisfies Token;
    }

    public tokenize(): ReadonlyArray<Token> {
        const tokens: Token[] = [];

        while (!this.atEOF()) {
            const char: string = this.peek();

            if (/\s/.test(char)) {
                if (char === "\n") {
                    this.line++;
                    this.column = 0;
                }
                this.advance();
                continue;
            }

            if (/[0-9]/.test(char)) {
                let nString: string = "";

                while (!this.atEOF() && /[0-9]/.test(this.peek())) nString += this.advance;

                tokens.push(this.createToken(TokenType.Number, nString));
            }

            if (/[a-zA-Z_]/.test(char)) {
                let text: string = "";

                while (!this.atEOF() && /[a-zA-Z0-9_]/.test(this.peek())) {
                    text += this.advance();
                }

                if ((keywords as readonly string[]).includes(text))
                    tokens.push(this.createToken(TokenType.Keyword, text));
                else tokens.push(this.createToken(TokenType.Identifier, text));

                continue;
            }

            if (char === '"') {
                this.advance();

                let str: string = "";

                while (!this.atEOF() && this.peek() !== '"') {
                    str += this.advance();
                }

                this.advance();

                tokens.push(this.createToken(TokenType.String, str));

                continue;
            }
        }

        return [];
    }
}
