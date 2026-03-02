import React from 'react';
import { createRoot } from 'react-dom/client';
 
class MyComponent extends React.Component {
  render() {
    return <p>Hello, {this.props.name}!</p>;
  }
}
 
const root = createRoot(document.getElementById('root'));
root.render(<MyComponent name="Dicoding"/>);