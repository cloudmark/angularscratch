//function parse(expr){
//    return function(scope){
//        with(scope){
//            return eval(expr);
//        }
//    }
//}
//
'use strict';

function parse(expr) {
    // Input String, e.g.
    //      "a + b"
    // Lexer,
    //      [
    //          {text: 'a', identifier: true}
    //          {text: '+'},
    //          {text: 'b', identifier: true}
    //      ]
    // AST Builder,
    //      [
    //          type: AST.BinaryExpression,
    //          operator: '+',
    //          left: {
    //              type: AST.Identifier,
    //              name: 'a'
    //          }
    //          left: {
    //              type: AST.Identifier,
    //              name: 'b'
    //          }
    //      ]
    // AST Compiler
    //      function(scope){
    //          return scope.a + scope.b
    //      }
}

// LEXER
function Lexer(){}
Lexer.prototype.lex = function(text){
    this.text = text; // Original String
    this.index = 0; // Our current character index in the string.
    this.ch = undefined; // The current character
    this.tokens = []; // The resulting collection of tokens.

    while(this.index < this.text.length){
        this.ch = this.text.charAt(this.index);
        if (this.isNumber(this.ch)) {
            this.readNumber();
        } else {
            throw 'Unexpected next character: ' + this.ch;
        }
    }

    return this.tokens;
};

Lexer.prototype.readNumber = function() {
    var number = '';
    while (this.index < this.text.length) { // consumes characters that are numbers.
        var ch = this.text.charAt(this.index);
        if (this.isNumber(ch)) {
            number += ch;
        } else {
            break;
        }
        this.index++;
    }
    this.tokens.push({
        text: number,
        value: Number(number)
    })
};

Lexer.prototype.isNumber = function(ch) {
    return '0' <= ch && ch <= '9';
};

// AST
AST.Program = 'Program';
AST.Literal = 'Literal';
function AST(lexer){
    this.lexer = lexer;
}
AST.prototype.ast = function(text){
    this.tokens = this.lexer.lex(text);
    return this.program();
};
AST.prototype.program = function(){
    return {type: AST.Program, body: this.constant()};
};
AST.prototype.constant = function(){
    return {type: AST.Literal, value: this.tokens[0].value};
};

// COMPILER
function ASTCompiler(astBuilder){
    this.astBuilder = astBuilder;
}
ASTCompiler.prototype.compile = function(text){
    var ast = this.astBuilder.ast(text);
    // AST compilation will be done here.
    this.state = {body: []};
    this.recurse(ast);
};
ASTCompiler.prototype.recurse = function(){
    var ast = this.astBuilder.ast(text);
    this.state = {body: []};
    this.recurse(ast);
    return new Function(this.state.body.join(''));
}

// PARSER
function Parser(lexer){
    this.lexer = lexer;
    this.ast = new AST(this.lexer);
    this.astCompiler = new ASTCompiler(ast);
}
Parser.prototype.parse = function(expr){
    var lexer = new Lexer();
    var parser = new Parser(lexer);
    return parser.parse(expr);
};



