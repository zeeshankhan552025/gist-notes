import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ColorTestComponent = () => {
  const sampleCode = `function hello() {
  const message = "Hello, World!";
  const number = 42;
  const isTrue = true;
  console.log(message);
  
  // This is a comment
  if (isTrue) {
    return {
      status: 'success',
      data: message,
      count: number
    };
  }
  
  const array = [1, 2, 3, 'string'];
  const regex = /[a-zA-Z]+/g;
  
  class MyClass {
    constructor(name) {
      this.name = name;
    }
    
    getName() {
      return this.name;
    }
  }
}`;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Syntax Highlighting Test</h2>
      
      <h3>Tomorrow Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={tomorrow}
        showLineNumbers={true}
        customStyle={{
          fontSize: '13px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
        }}
      >
        {sampleCode}
      </SyntaxHighlighter>
      
      <h3>Prism Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={prism}
        showLineNumbers={true}
        customStyle={{
          fontSize: '13px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
        }}
      >
        {sampleCode}
      </SyntaxHighlighter>
      
      <h3>VS Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={vs}
        showLineNumbers={true}
        customStyle={{
          fontSize: '13px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
        }}
      >
        {sampleCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default ColorTestComponent;