import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SavedReplyManager from './src/SavedReplyManager.jsx';

// Expose React globally for the component which expects a global React
global.React = React;
import SavedReplyManager from './SavedReplyManager.jsx';

// Expose React globally for the component which expects a global React
global.React = React;
import SavedReplyManager from './SavedReplyManager';

describe('SavedReplyManager', () => {
  test('renders initial category and subcategory', () => {
    render(<SavedReplyManager />);
    expect(screen.getByText('엘리스LXP')).toBeInTheDocument();
    expect(screen.getByText('로그인')).toBeInTheDocument();
  });

  test('adds new template', () => {
    render(<SavedReplyManager />);
    fireEvent.change(screen.getByPlaceholderText('Issue'), {
      target: { value: '새 이슈' },
    });
    fireEvent.change(screen.getByPlaceholderText('Action Item'), {
      target: { value: '새 액션' },
    });
    fireEvent.change(screen.getByPlaceholderText('Saved Reply'), {
      target: { value: '새 답변' },
    });
    fireEvent.change(screen.getByPlaceholderText('Note'), {
      target: { value: '노트' },
    });
    fireEvent.click(screen.getByText('템플릿 추가'));
    expect(screen.getByText('새 이슈')).toBeInTheDocument();
  });
});
