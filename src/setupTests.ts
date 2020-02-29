// setupTests.ts
import ReactDOM from 'react-dom';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetch from 'jest-fetch-mock';

Enzyme.configure({ adapter: new Adapter() });

const globalAny: any = global;

// Fetch mock
globalAny.fetch = fetch;

// localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

// Mock portals since react-test-renderer seems not to support them 😔
ReactDOM.createPortal = (node: any) => node;

globalAny.localStorage = localStorageMock;
