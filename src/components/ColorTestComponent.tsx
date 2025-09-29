import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, tomorrow, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './color-test-component.scss'

const ColorTestComponent = () => {
  const sampleCode = `function hello() {
  const message = "Hello, World!";
  const number = 42;
{{ ... }}
      return this.name;
    }
  }
`;

  return (
    <div className="color-test">
      <h2>Syntax Highlighting Test</h2>
      
      <h3>Tomorrow Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={tomorrow}
        showLineNumbers={true}
      >
        {sampleCode}
      </SyntaxHighlighter>
      
      <h3>Prism Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={prism}
        showLineNumbers={true}
      >
        {sampleCode}
      </SyntaxHighlighter>
      
      <h3>VS Theme</h3>
      <SyntaxHighlighter
        language="javascript"
        style={vs}
        showLineNumbers={true}
      >
        {sampleCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default ColorTestComponent;