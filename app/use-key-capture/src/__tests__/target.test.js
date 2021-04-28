import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import TestComponent from './utils/TestComponent';

describe('component with target', () => {
  afterEach(() => cleanup());

  it('updated when keydown event is in the target', async () => {
    const { findByTestId, queryByTestId, container } = render(
      <TestComponent />
    );

    const targetInput = await findByTestId('input');
    let displayDOM = queryByTestId('displayDOM');

    expect(displayDOM).toBeNull();

    fireEvent.keyDown(targetInput, {
      key: 'Shift'
    });

    displayDOM = queryByTestId('displayDOM');

    expect(displayDOM.textContent).not.toBeNull();
    expect(displayDOM.textContent).toBe('Shift');
  });

  it('should not update, when the event is made on the non-target element', async () => {
    const { findByTestId, queryByTestId } = render(<TestComponent />);

    const targetInput = await findByTestId('secondary_input');
    let displayDOM = queryByTestId('displayDOM');

    expect(displayDOM).toBeNull();

    fireEvent.keyDown(targetInput, {
      key: 'Shift'
    });

    displayDOM = queryByTestId('displayDOM');
    expect(displayDOM).toBeNull();
  });
});
